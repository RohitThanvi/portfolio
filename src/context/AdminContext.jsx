import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultData, ADMIN_CREDENTIALS } from '../data/portfolio';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [siteData, setSiteData] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolioData');
      return saved ? JSON.parse(saved) : defaultData;
    } catch { return defaultData; }
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('portfolioData', JSON.stringify(siteData));
  }, [siteData]);

  useEffect(() => {
    const adminSession = sessionStorage.getItem('adminSession');
    if (adminSession === 'true') setIsAdmin(true);
  }, []);

  const login = (username, password) => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAdmin(true);
      sessionStorage.setItem('adminSession', 'true');
      setShowLoginModal(false);
      return true;
    }
    return false;
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
    localStorage.setItem('portfolioData', JSON.stringify(defaultData));
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
