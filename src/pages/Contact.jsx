import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';

export default function Contact() {
  const { siteData } = useAdmin();
  const { hero } = siteData;
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:${hero.email}?subject=${encodeURIComponent(form.subject || 'Portfolio Contact')}&body=${encodeURIComponent(`From: ${form.name} (${form.email})\n\n${form.message}`)}`;
    window.open(mailtoLink);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const contacts = [
    {
      label: 'Email',
      value: hero.email,
      href: `mailto:${hero.email}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      )
    },
    {
      label: 'GitHub',
      value: `github.com/${hero.github}`,
      href: `https://github.com/${hero.github}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      )
    },
    {
      label: 'LinkedIn',
      value: `linkedin.com/in/${hero.linkedin}`,
      href: `https://linkedin.com/in/${hero.linkedin}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      label: 'Phone',
      value: hero.phone,
      href: `tel:${hero.phone}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.59a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      )
    },
  ];

  return (
    <div className="contact-page">
      <div className="page-container">
        <motion.div
          className="contact-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label">Contact</p>
          <div className="gold-line" />
          <h1 className="contact-title">
            Let's build<br />
            <span className="contact-gold">something.</span>
          </h1>
          <p className="contact-sub">Open to research collaborations, internship opportunities, and interesting problems.</p>
        </motion.div>

        <div className="contact-layout">
          {/* Left: links */}
          <motion.div
            className="contact-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="contact-links">
              {contacts.map((c, i) => (
                <motion.a
                  key={c.label}
                  href={c.href}
                  target={c.label !== 'Email' && c.label !== 'Phone' ? '_blank' : undefined}
                  rel="noreferrer"
                  className="contact-link-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ x: 6 }}
                >
                  <div className="link-icon">{c.icon}</div>
                  <div className="link-info">
                    <span className="link-label">{c.label}</span>
                    <span className="link-value">{c.value}</span>
                  </div>
                  <svg className="link-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </motion.a>
              ))}
            </div>

            <div className="availability-badge">
              <span className="avail-dot" />
              <span>Available for opportunities — 2025/2026</span>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            className="contact-right"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="contact-form-wrap">
              <div className="form-header">
                <span className="section-label" style={{ marginBottom: '0.3rem' }}>Send a message</span>
                <p style={{ fontSize: '0.78rem', color: 'var(--white-dim)' }}>Opens your mail client.</p>
              </div>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      className="form-input"
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="What's this about?"
                    value={form.subject}
                    onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Your message..."
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    required
                  />
                </div>
                <button type="submit" className={`form-submit ${sent ? 'sent' : ''}`}>
                  {sent ? 'Opening mail client...' : 'Send Message'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="page-container">
          <div className="footer-inner">
            <span className="footer-copy">
              © 2025 Rohit Thanvi
            </span>
            <span className="footer-mono">
              Built with precision.
            </span>
          </div>
        </div>
      </footer>

      <style>{`
        .contact-page {
          min-height: 100vh;
          padding: 8rem 0 0;
          display: flex;
          flex-direction: column;
        }
        .contact-header { margin-bottom: 4rem; }
        .contact-title {
          font-family: var(--font-display);
          font-size: clamp(3rem, 6vw, 5rem);
          letter-spacing: 0.03em;
          line-height: 1.05;
          color: var(--white);
          margin-bottom: 1rem;
        }
        .contact-gold { color: var(--gold); }
        .contact-sub {
          font-size: 0.9rem;
          color: var(--white-dim);
          max-width: 480px;
          line-height: 1.7;
        }
        .contact-layout {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 5rem;
          align-items: start;
          margin-bottom: 6rem;
        }
        @media (max-width: 900px) {
          .contact-layout { grid-template-columns: 1fr; gap: 3rem; }
        }
        .contact-links { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 2.5rem; }
        .contact-link-card {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          padding: 1.2rem 1.5rem;
          border: 1px solid var(--white-faint);
          text-decoration: none;
          transition: border-color 0.2s ease, background 0.2s ease;
          background: var(--navy);
        }
        .contact-link-card:hover {
          border-color: var(--gold-dim);
          background: rgba(201,168,76,0.04);
        }
        .link-icon { color: var(--gold); display: flex; }
        .link-info { flex: 1; display: flex; flex-direction: column; gap: 0.15rem; }
        .link-label {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--white-dim);
        }
        .link-value {
          font-size: 0.82rem;
          color: var(--white);
          font-weight: 500;
        }
        .link-arrow { color: var(--white-dim); }
        .availability-badge {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          color: #10B981;
          padding: 0.8rem 1.2rem;
          border: 1px solid rgba(16,185,129,0.3);
          background: rgba(16,185,129,0.05);
        }
        .avail-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #10B981;
          animation: pulse-dot 2s ease infinite;
        }

        /* Form */
        .contact-form-wrap {
          border: 1px solid var(--white-faint);
          padding: 2.5rem;
          background: var(--navy);
        }
        .form-header { margin-bottom: 2rem; }
        .contact-form { display: flex; flex-direction: column; gap: 1.2rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 500px) { .form-row { grid-template-columns: 1fr; } }
        .form-group { display: flex; flex-direction: column; gap: 0.35rem; }
        .form-label {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--gold-dim);
        }
        .form-input {
          font-family: var(--font-body);
          font-size: 0.88rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--white-faint);
          color: var(--white);
          padding: 0.75rem 1rem;
          outline: none;
          transition: border-color 0.2s ease;
          resize: none;
        }
        .form-input:focus { border-color: var(--gold); }
        .form-input::placeholder { color: var(--white-faint); font-size: 0.82rem; }
        .form-textarea { min-height: 120px; }
        .form-submit {
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 1rem 2rem;
          background: var(--gold);
          color: var(--black);
          border: none;
          cursor: none;
          transition: all 0.25s ease;
          align-self: flex-start;
        }
        .form-submit:hover { background: var(--gold-bright); transform: translateY(-2px); }
        .form-submit.sent { background: #10B981; color: var(--white); }

        /* Footer */
        .footer {
          border-top: 1px solid var(--white-faint);
          padding: 2rem 0;
          margin-top: auto;
        }
        .footer-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer-copy {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          color: var(--white-dim);
        }
        .footer-mono {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          color: var(--gold-dim);
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
}
