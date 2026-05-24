import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';

export default function LoginModal() {
  const { showLoginModal, setShowLoginModal, login } = useAdmin();
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));
    const success = login(creds.username, creds.password);
    if (!success) {
      setError('Invalid credentials.');
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {showLoginModal && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowLoginModal(false)}
        >
          <motion.div
            className="modal-box"
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-lock">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h2 className="modal-title">Admin Access</h2>
              <p className="modal-sub">Authenticate to edit site content</p>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="field-group">
                <label className="field-label">Username</label>
                <input
                  type="text"
                  className="modal-input"
                  value={creds.username}
                  onChange={e => setCreds(p => ({ ...p, username: e.target.value }))}
                  placeholder="Enter username"
                  autoComplete="off"
                />
              </div>
              <div className="field-group">
                <label className="field-label">Password</label>
                <input
                  type="password"
                  className="modal-input"
                  value={creds.password}
                  onChange={e => setCreds(p => ({ ...p, password: e.target.value }))}
                  placeholder="Enter password"
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    className="modal-error"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <button type="submit" className="modal-submit" disabled={loading}>
                {loading ? (
                  <span className="spinner" />
                ) : (
                  'Authenticate'
                )}
              </button>
            </form>

            <button className="modal-close" onClick={() => setShowLoginModal(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(8,8,14,0.85);
          backdrop-filter: blur(12px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .modal-box {
          background: var(--navy);
          border: 1px solid var(--white-faint);
          padding: 3rem;
          width: 100%;
          max-width: 420px;
          position: relative;
        }
        .modal-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .modal-lock {
          width: 52px; height: 52px;
          border: 1px solid var(--gold-dim);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold);
          margin: 0 auto 1.2rem;
        }
        .modal-title {
          font-family: var(--font-display);
          font-size: 2rem;
          letter-spacing: 0.1em;
          color: var(--white);
          margin-bottom: 0.4rem;
        }
        .modal-sub {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--white-dim);
        }
        .modal-form { display: flex; flex-direction: column; gap: 1.2rem; }
        .field-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .field-label {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--gold-dim);
        }
        .modal-input {
          font-family: var(--font-body);
          font-size: 0.9rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--white-faint);
          color: var(--white);
          padding: 0.8rem 1rem;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .modal-input:focus { border-color: var(--gold); }
        .modal-input::placeholder { color: var(--white-faint); }
        .modal-error {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: #EF4444;
          letter-spacing: 0.05em;
        }
        .modal-submit {
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 1rem;
          background: var(--gold);
          color: var(--black);
          border: none;
          cursor: none;
          transition: all 0.2s ease;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
        }
        .modal-submit:hover { background: var(--gold-bright); }
        .modal-submit:disabled { opacity: 0.7; cursor: none; }
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(0,0,0,0.3);
          border-top-color: var(--black);
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .modal-close {
          position: absolute;
          top: 1rem; right: 1rem;
          background: none;
          border: none;
          color: var(--white-dim);
          cursor: none;
          padding: 0.5rem;
          transition: color 0.2s ease;
        }
        .modal-close:hover { color: var(--white); }
      `}</style>
    </AnimatePresence>
  );
}
