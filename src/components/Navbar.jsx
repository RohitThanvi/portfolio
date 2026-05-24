import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/experience', label: 'Experience' },
  { path: '/projects', label: 'Projects' },
  { path: '/skills', label: 'Skills' },
  { path: '/research', label: 'Research' },
  { path: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAdmin, logout, setShowLoginModal, setEditMode, editMode } = useAdmin();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <>
      <motion.nav
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="nav-inner">
          <NavLink to="/" className="nav-logo">
            <span className="logo-r">R</span>
            <span className="logo-dot" />
            <span className="logo-t">T</span>
          </NavLink>

          <div className="nav-links">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                end={link.path === '/'}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="nav-actions">
            {isAdmin ? (
              <div className="admin-controls">
                <button
                  className={`admin-btn ${editMode ? 'active' : ''}`}
                  onClick={() => setEditMode(e => !e)}
                >
                  {editMode ? 'Exit Edit' : 'Edit Mode'}
                </button>
                <button className="logout-btn" onClick={logout}>Logout</button>
              </div>
            ) : (
              <button className="login-trigger" onClick={() => setShowLoginModal(true)}>
                <span className="lock-icon">&#8857;</span>
              </button>
            )}
            <button className="burger" onClick={() => setMenuOpen(o => !o)}>
              <span className={menuOpen ? 'open' : ''} />
              <span className={menuOpen ? 'open' : ''} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <NavLink to={link.path} className="mobile-link" end={link.path === '/'}>
                  <span className="mobile-link-num">0{i+1}</span>
                  {link.label}
                </NavLink>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 9000;
          padding: 1.5rem 0;
          transition: padding 0.3s ease, background 0.3s ease, border-color 0.3s ease;
          border-bottom: 1px solid transparent;
        }
        .navbar.scrolled {
          padding: 1rem 0;
          background: rgba(8,8,14,0.92);
          backdrop-filter: blur(20px);
          border-bottom-color: rgba(201,168,76,0.1);
        }
        .nav-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 clamp(1.5rem, 5vw, 5rem);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0;
          text-decoration: none;
          font-family: var(--font-display);
          font-size: 1.8rem;
          letter-spacing: 0.05em;
        }
        .logo-r { color: var(--gold); }
        .logo-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--blue);
          margin: 0 3px;
          margin-bottom: 8px;
        }
        .logo-t { color: var(--white); }
        .nav-links {
          display: flex;
          gap: 2.5rem;
          align-items: center;
        }
        @media (max-width: 900px) { .nav-links { display: none; } }
        .nav-link {
          font-family: var(--font-body);
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          color: var(--white-dim);
          position: relative;
          transition: color 0.2s ease;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px; left: 0;
          width: 0; height: 1px;
          background: var(--gold);
          transition: width 0.3s ease;
        }
        .nav-link:hover, .nav-link.active { color: var(--white); }
        .nav-link:hover::after, .nav-link.active::after { width: 100%; }
        .nav-link.active::after { background: var(--gold); }
        .nav-actions { display: flex; align-items: center; gap: 1rem; }
        .login-trigger {
          background: none;
          border: 1px solid var(--white-faint);
          color: var(--white-dim);
          width: 36px; height: 36px;
          border-radius: 50%;
          cursor: none;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
          transition: all 0.2s ease;
        }
        .login-trigger:hover { border-color: var(--gold); color: var(--gold); }
        .admin-controls { display: flex; align-items: center; gap: 0.5rem; }
        .admin-btn {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.4rem 0.8rem;
          background: transparent;
          border: 1px solid var(--gold-dim);
          color: var(--gold);
          cursor: none;
          transition: all 0.2s ease;
        }
        .admin-btn.active { background: var(--gold); color: var(--black); }
        .admin-btn:hover { background: rgba(201,168,76,0.1); }
        .logout-btn {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.4rem 0.8rem;
          background: transparent;
          border: 1px solid var(--white-faint);
          color: var(--white-dim);
          cursor: none;
          transition: all 0.2s ease;
        }
        .logout-btn:hover { border-color: #EF4444; color: #EF4444; }
        .burger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: none;
          padding: 5px;
        }
        @media (max-width: 900px) { .burger { display: flex; } }
        .burger span {
          display: block;
          width: 24px; height: 1.5px;
          background: var(--white);
          transition: all 0.3s ease;
          transform-origin: center;
        }
        .burger span.open:first-child { transform: rotate(45deg) translate(4px, 4px); }
        .burger span.open:last-child { transform: rotate(-45deg) translate(4px, -4px); }
        .mobile-menu {
          position: fixed;
          top: 0; right: 0;
          width: min(380px, 90vw);
          height: 100vh;
          background: var(--navy);
          z-index: 8999;
          padding: 7rem 3rem 3rem;
          border-left: 1px solid var(--white-faint);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .mobile-link {
          font-family: var(--font-display);
          font-size: 2.5rem;
          letter-spacing: 0.05em;
          color: var(--white-dim);
          text-decoration: none;
          display: flex;
          align-items: baseline;
          gap: 1rem;
          transition: color 0.2s ease;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--white-faint);
        }
        .mobile-link:hover, .mobile-link.active { color: var(--gold); }
        .mobile-link-num {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--gold-dim);
        }
      `}</style>
    </>
  );
}
