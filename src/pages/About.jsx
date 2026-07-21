import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAdmin } from '../context/AdminContext';
import EditableText from '../components/EditableText';

function Reveal({ children, delay = 0 }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function About() {
  const { siteData } = useAdmin();
  const { about = {}, hero = {} } = siteData;

  const certs = siteData.skills?.certs || [];

  return (
    <div className="about-page">
      <div className="page-container">
        <div className="about-grid">
          {/* Left col */}
          <div className="about-left">
            <Reveal>
              <p className="section-label">About</p>
              <div className="gold-line" />
              <h1 className="about-heading">
                Crafting intelligence<br />
                <span className="about-heading-gold">from first principles.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="about-bio">
                <EditableText path="about.bio" />
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <p className="about-bio">
                <EditableText path="about.bio2" />
              </p>
            </Reveal>

            <Reveal delay={0.35}>
              <div className="about-edu">
                <span className="edu-label">Education</span>
                <div className="edu-card">
                  <div className="edu-header">
                    <span className="edu-cgpa">
                      <EditableText path="about.cgpa" /> CGPA
                    </span>
                    <span className="edu-year">
                      <EditableText path="about.year" />
                    </span>
                  </div>
                  <div className="edu-college">
                    <EditableText path="about.college" />
                  </div>
                  <div className="edu-degree">
                    <EditableText path="about.degree" />
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.45}>
              <div className="certs-section">
                <span className="edu-label">Certifications</span>
                <div className="certs-list">
                  {certs.map((c, i) => (
                    <div key={i} className="cert-pill">
                      <span className="cert-check">✓</span>
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right col — visual card */}
          <div className="about-right">
            <Reveal delay={0.2}>
              <div className="profile-card">
                <div className="profile-avatar">
                  <img src="/avatar.jpg" alt="Rohit Thanvi" className="avatar-photo" />
                  <div className="avatar-ring" />
                  <div className="avatar-ring ring2" />
                </div>

                <div className="profile-info">
                  <div className="profile-name">
                    <EditableText path="hero.name" />
                  </div>
                  <div className="profile-role-tag">AI/ML Engineering Undergraduate</div>
                  <div className="profile-location">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    Jaipur, Rajasthan, India
                  </div>
                </div>

                <div className="profile-links">
                  <a href={`mailto:${hero.email}`} className="profile-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    {hero.email}
                  </a>
                  <a href={`https://github.com/${hero.github}`} target="_blank" rel="noreferrer" className="profile-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                    github.com/{hero.github}
                  </a>
                  <a href={`https://linkedin.com/in/${hero.linkedin}`} target="_blank" rel="noreferrer" className="profile-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    linkedin.com/in/{hero.linkedin}
                  </a>
                </div>

                <div className="profile-card-deco" />
              </div>
            </Reveal>

            {/* SKIT CoE role */}
            <Reveal delay={0.4}>
              <div className="leadership-card">
                <span className="section-label" style={{ marginBottom: '0.5rem' }}>Leadership</span>
                <div className="leadership-title">Student Coordinator</div>
                <div className="leadership-org">SKIT Centre of Excellence in AI & ML</div>
                <p className="leadership-desc">Overseeing 7 concurrent AI/ML project teams (20–30 students) — scoping timelines, reviewing model development decisions, and mentoring on deployment practices.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <style>{`
        .about-page {
          min-height: 100vh;
          padding: 8rem 0 6rem;
          position: relative;
        }
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr; gap: 4rem; }
        }
        .about-heading {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 5vw, 4rem);
          line-height: 1.05;
          letter-spacing: 0.03em;
          color: var(--white);
          margin-bottom: 2rem;
        }
        .about-heading-gold { color: var(--gold); }
        .about-bio {
          font-size: 0.95rem;
          line-height: 1.85;
          color: var(--white-dim);
          margin-bottom: 1.5rem;
        }
        .about-edu { margin-bottom: 2.5rem; }
        .edu-label {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--gold-dim);
          display: block;
          margin-bottom: 0.8rem;
        }
        .edu-card {
          border: 1px solid var(--white-faint);
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }
        .edu-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px; height: 100%;
          background: var(--gold);
        }
        .edu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .edu-cgpa {
          font-family: var(--font-display);
          font-size: 1.5rem;
          letter-spacing: 0.05em;
          color: var(--gold);
        }
        .edu-year {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          color: var(--white-dim);
        }
        .edu-college {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--white);
          margin-bottom: 0.2rem;
        }
        .edu-degree {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--white-dim);
        }
        .certs-section { margin-bottom: 2rem; }
        .certs-list { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.8rem; }
        .cert-pill {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          font-size: 0.85rem;
          color: var(--white-dim);
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--white-faint);
        }
        .cert-check {
          color: var(--gold);
          font-size: 0.7rem;
        }

        /* Profile card */
        .profile-card {
          background: var(--navy);
          border: 1px solid var(--white-faint);
          padding: 2.5rem;
          position: relative;
          overflow: hidden;
          margin-bottom: 2rem;
          transition: border-color 0.3s ease;
        }
        .profile-card:hover { border-color: var(--gold-dim); }
        .profile-card-deco {
          position: absolute;
          top: -30px; right: -30px;
          width: 120px; height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(37,99,235,0.12), transparent 70%);
          pointer-events: none;
        }
        .profile-avatar {
          position: relative;
          width: 80px; height: 80px;
          margin-bottom: 1.5rem;
        }
        .avatar-photo {
          width: 80px; height: 80px;
          border-radius: 50%;
          object-fit: cover;
          object-position: center 20%;
          position: relative;
          z-index: 1;
          display: block;
        }
        .avatar-ring {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 1px solid var(--gold);
          opacity: 0.4;
          animation: ring-pulse 3s ease infinite;
        }
        .ring2 {
          inset: -14px;
          border-color: var(--blue-bright);
          opacity: 0.2;
          animation-delay: 1s;
        }
        @keyframes ring-pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.05); opacity: 0.2; }
        }
        .profile-name {
          font-family: var(--font-display);
          font-size: 1.8rem;
          letter-spacing: 0.05em;
          color: var(--white);
          margin-bottom: 0.2rem;
        }
        .profile-role-tag {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 0.5rem;
        }
        .profile-location {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: var(--white-dim);
          margin-bottom: 1.5rem;
        }
        .profile-links { display: flex; flex-direction: column; gap: 0.6rem; }
        .profile-link {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--white-dim);
          text-decoration: none;
          transition: color 0.2s ease;
          letter-spacing: 0.05em;
        }
        .profile-link:hover { color: var(--gold); }
        .profile-info { margin-bottom: 1.5rem; }

        /* Leadership */
        .leadership-card {
          border: 1px solid var(--blue);
          border-top: 3px solid var(--blue);
          padding: 1.5rem;
          background: rgba(37,99,235,0.04);
        }
        .leadership-title {
          font-family: var(--font-display);
          font-size: 1.4rem;
          letter-spacing: 0.05em;
          color: var(--white);
          margin-bottom: 0.2rem;
        }
        .leadership-org {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--blue-bright);
          margin-bottom: 0.8rem;
        }
        .leadership-desc {
          font-size: 0.82rem;
          line-height: 1.7;
          color: var(--white-dim);
        }
      `}</style>
    </div>
  );
}
