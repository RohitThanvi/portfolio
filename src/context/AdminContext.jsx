import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { defaultData, ADMIN_USERNAME, ADMIN_PASSWORD_HASH, DATA_VERSION } from '../data/portfolio';

const AdminContext = createContext();

const DATA_KEY = 'portfolioData';
const VERSION_KEY = 'portfolioDataVersion';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MS = 30000;

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

// Recursively fills in any field missing from `saved` with the value from
// `defaults`. This is what keeps the site from crashing (or silently
// showing blank sections) when: (a) a visitor has an older copy of the
// data cached in localStorage from before new fields/sections existed, or
// (b) an admin edit only touched part of the data. Arrays are taken from
// `saved` as-is when present (that's the admin's actual content), objects
// are merged key by key, and anything missing falls back to `defaults`.
function deepMergeWithDefaults(defaults, saved) {
  if (!isPlainObject(defaults)) {
    return saved !== undefined ? saved : defaults;
  }
  const result = { ...defaults };
  if (!isPlainObject(saved)) return result;
  for (const key of Object.keys(defaults)) {
    if (saved[key] === undefined) continue;
    if (isPlainObject(defaults[key]) && isPlainObject(saved[key])) {
      result[key] = deepMergeWithDefaults(defaults[key], saved[key]);
    } else {
      result[key] = saved[key];
    }
  }
  return result;
}

async function sha256Hex(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function loadInitialData() {
  try {
    const saved = localStorage.getItem(DATA_KEY);
    if (!saved) return defaultData;
    const parsed = JSON.parse(saved);
    // Merge onto defaults rather than trusting the saved blob wholesale —
    // this is the fix for the intermittent "client-side exception" when
    // navigating between pages: a saved copy missing a newer field (e.g.
    // a new experience/project section added in an update) used to leave
    // that field `undefined`, and pages that did `siteData.experience.map(...)`
    // with no fallback would throw. Merging guarantees every top-level
    // section always exists.
    return deepMergeWithDefaults(defaultData, parsed);
  } catch {
    // Corrupted JSON in localStorage — fall back to defaults instead of
    // crashing the whole app on load.
    return defaultData;
  }
}

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [siteData, setSiteData] = useState(loadInitialData);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const attempts = useRef({ count: 0, lockedUntil: 0 });

  useEffect(() => {
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify(siteData));
      localStorage.setItem(VERSION_KEY, String(DATA_VERSION));
    } catch {
      // localStorage can throw (private browsing, quota exceeded, etc) —
      // editing still works for the current session, it just won't persist.
    }
  }, [siteData]);

  useEffect(() => {
    const adminSession = sessionStorage.getItem('adminSession');
    if (adminSession === 'true') setIsAdmin(true);
  }, []);

  const login = async (username, password) => {
    const now = Date.now();
    if (now < attempts.current.lockedUntil) {
      const secondsLeft = Math.ceil((attempts.current.lockedUntil - now) / 1000);
      return { success: false, error: `Too many attempts. Try again in ${secondsLeft}s.` };
    }

    const hash = await sha256Hex(password || '');
    const ok = username === ADMIN_USERNAME && hash === ADMIN_PASSWORD_HASH;

    if (ok) {
      attempts.current = { count: 0, lockedUntil: 0 };
      setIsAdmin(true);
      sessionStorage.setItem('adminSession', 'true');
      setShowLoginModal(false);
      return { success: true };
    }

    attempts.current.count += 1;
    if (attempts.current.count >= MAX_LOGIN_ATTEMPTS) {
      attempts.current.lockedUntil = now + LOCKOUT_MS;
      attempts.current.count = 0;
      return { success: false, error: 'Too many attempts. Try again in 30s.' };
    }
    return { success: false, error: 'Invalid credentials.' };
  };

  const logout = () => {
    setIsAdmin(false);
    setEditMode(false);
    sessionStorage.removeItem('adminSession');
  };

  const updateData = (section, newData) => {
    setSiteData(prev => ({ ...prev, [section]: newData }));
  };

  const updateNestedData = (path, value) => {
    setSiteData(prev => {
      const parts = path.split('.');
      const updated = { ...prev };
      let ref = updated;
      for (let i = 0; i < parts.length - 1; i++) {
        ref[parts[i]] = { ...ref[parts[i]] };
        ref = ref[parts[i]];
      }
      ref[parts[parts.length - 1]] = value;
      return updated;
    });
  };

  const resetToDefault = () => {
    setSiteData(defaultData);
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify(defaultData));
      localStorage.setItem(VERSION_KEY, String(DATA_VERSION));
    } catch {
      // ignore — see note above
    }
  };

  return (
    <AdminContext.Provider value={{
      isAdmin, login, logout,
      showLoginModal, setShowLoginModal,
      editMode, setEditMode,
      siteData, updateData, updateNestedData, resetToDefault
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
