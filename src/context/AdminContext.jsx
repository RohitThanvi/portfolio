import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { defaultData, ADMIN_USERNAME, ADMIN_PASSWORD_HASH } from '../data/portfolio';

const AdminContext = createContext();

const DRAFT_KEY = 'portfolioDraft';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MS = 30000;

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

// Recursively fills in any field missing from `saved` with the value from
// `defaults`. Keeps the admin's in-progress draft from crashing pages if
// it's missing a section that a newer publish introduced (e.g. the admin
// has an old draft sitting in their browser from before a new section was
// added to content.json).
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

function loadDraft() {
  try {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (!saved) return defaultData;
    return deepMergeWithDefaults(defaultData, JSON.parse(saved));
  } catch {
    return defaultData;
  }
}

export const AdminProvider = ({ children }) => {
  // Regular visitors ALWAYS see `defaultData` — the actual published
  // content.json baked into this build. Nothing here ever touches their
  // localStorage. Only once someone is logged in as admin does siteData
  // switch to a draft (loaded from this browser's own localStorage) that
  // they can edit and preview before publishing it for everyone.
  const [isAdmin, setIsAdmin] = useState(false);
  const [siteData, setSiteData] = useState(defaultData);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [publishState, setPublishState] = useState('idle'); // idle | publishing | success | error
  const [publishError, setPublishError] = useState('');
  const attempts = useRef({ count: 0, lockedUntil: 0 });

  useEffect(() => {
    const adminSession = sessionStorage.getItem('adminSession');
    if (adminSession === 'true') {
      setIsAdmin(true);
      setSiteData(loadDraft());
    }
  }, []);

  // Only persist a draft while logged in as admin — this is what makes
  // in-progress edits survive a refresh during an editing session,
  // without ever writing to a regular visitor's browser storage.
  useEffect(() => {
    if (!isAdmin) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(siteData));
    } catch {
      // localStorage can throw (private browsing, quota, etc) — editing
      // still works for the current session, it just won't survive a reload.
    }
  }, [siteData, isAdmin]);

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
      setSiteData(loadDraft());
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
    setSiteData(defaultData);
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

  const discardDraft = () => {
    setSiteData(defaultData);
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
  };

  // "Reset to Default" in the panel — same as discarding the draft.
  const resetToDefault = discardDraft;

  // Sends the current draft to the serverless publish endpoint, which
  // commits it to content.json in the repo (see /api/publish.js). A
  // successful publish triggers Vercel to redeploy with the new content,
  // so it becomes the new `defaultData` for every visitor once that
  // finishes (usually under a minute). We then clear the local draft
  // since it has effectively become the new baseline.
  const publish = async (password) => {
    setPublishState('publishing');
    setPublishError('');
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, data: siteData }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error || `Publish failed (${res.status})`);
      }
      try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      setPublishState('success');
      return { success: true };
    } catch (err) {
      setPublishState('error');
      setPublishError(err.message || 'Publish failed.');
      return { success: false, error: err.message || 'Publish failed.' };
    }
  };

  return (
    <AdminContext.Provider value={{
      isAdmin, login, logout,
      showLoginModal, setShowLoginModal,
      editMode, setEditMode,
      siteData, updateData, updateNestedData,
      resetToDefault, discardDraft,
      publish, publishState, publishError, setPublishState,
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
