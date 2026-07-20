import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAdmin } from '../context/AdminContext';

function GitHubWindow({ username }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=8`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRepos(data.filter(r => !r.fork).slice(0, 8));
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [username]);

  return (
    <div className="github-window">
      <div className="gh-titlebar">
        <div className="gh-dots">
          <span className="gh-dot red" />
          <span className="gh-dot yellow" />
          <span className="gh-dot green" />
        </div>
        <div className="gh-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--white-dim)' }}>
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          github.com / {username}
        </div>
        <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer" className="gh-open">
          Open ↗
        </a>
      </div>

      <div className="gh-body">
        {loading && (
          <div className="gh-loading">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="gh-skeleton" style={{ width: `${60 + Math.random() * 30}%`, animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        )}
        {error && (
          <div className="gh-error">
            <span style={{ color: 'var(--white-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              Rate limit hit. <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer" style={{ color: 'var(--gold)' }}>View on GitHub →</a>
            </span>
          </div>
        )}
        {!loading && !error && repos.map((repo, i) => (
          <motion.a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            className="repo-row"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="repo-info">
              <span className="repo-name">{repo.name}</span>
              {repo.description && <span className="repo-desc">{repo.description.slice(0, 60)}{repo.description.length > 60 ? '…' : ''}</span>}
            </div>
            <div className="repo-meta">
              {repo.language && <span className="repo-lang">{repo.language}</span>}
              <span className="repo-stars">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                {repo.stargazers_count}
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}

function ResearchCard({ paper, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      className="research-card"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15 }}
    >
      <div className="research-badge">
        <span className="badge-text">Accepted</span>
      </div>

      <div className="research-year">{paper.year}</div>
      <h2 className="research-title">{paper.title}</h2>
      <div className="research-conference">{paper.conference}</div>

      <div className="research-status-row">
        <div className="status-pill">
          <span className="status-dot" />
          {paper.status}
        </div>
      </div>

      <p className="research-desc">{paper.description}</p>

      <div className="research-corner-deco" />
      <div className="research-corner-deco right" />
    </motion.div>
  );
}

export default function Research() {
  const { siteData } = useAdmin();
  const { research = [], hero = {} } = siteData;

  return (
    <div className="research-page">
      <div className="page-container">
        <motion.div
          className="research-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label">Research & Open Source</p>
          <div className="gold-line" />
          <h1 className="research-main-title">
            Contributing to<br />
            <span className="research-gold">the field.</span>
          </h1>
        </motion.div>

        <div className="research-layout">
          {/* Papers */}
          <div className="research-left">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="section-label" style={{ marginBottom: '1.5rem' }}>Publications & Presentations</p>
            </motion.div>

            {research.map((paper, i) => (
              <ResearchCard key={paper.id} paper={paper} index={i} />
            ))}
          </div>

          {/* GitHub */}
          <div className="research-right">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="section-label" style={{ marginBottom: '1.5rem' }}>GitHub Activity</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GitHubWindow username={hero.github} />
            </motion.div>

            {/* Contribution graph placeholder */}
            <motion.div
              className="contrib-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <a
                href={`https://github.com/${hero.github}`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
                style={{ display: 'inline-block', marginTop: '1.5rem' }}
              >
                View Full Profile
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        .research-page {
          min-height: 100vh;
          padding: 8rem 0 6rem;
        }
        .research-header { margin-bottom: 4rem; }
        .research-main-title {
          font-family: var(--font-display);
          font-size: clamp(3rem, 6vw, 5rem);
          letter-spacing: 0.03em;
          line-height: 1.05;
          color: var(--white);
        }
        .research-gold { color: var(--gold); }

        .research-layout {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 4rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .research-layout { grid-template-columns: 1fr; gap: 3rem; }
        }

        /* Research card */
        .research-card {
          position: relative;
          border: 1px solid var(--gold-dim);
          background: var(--navy);
          padding: 2.5rem;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }
        .research-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 60%);
          pointer-events: none;
        }
        .research-badge {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
        }
        .badge-text {
          font-family: var(--font-mono);
          font-size: 0.55rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--black);
          background: var(--gold);
          padding: 0.25rem 0.6rem;
        }
        .research-year {
          font-family: var(--font-display);
          font-size: 5rem;
          letter-spacing: 0.05em;
          color: rgba(201,168,76,0.08);
          line-height: 1;
          margin-bottom: 0.5rem;
          user-select: none;
        }
        .research-title {
          font-family: var(--font-display);
          font-size: 1.6rem;
          letter-spacing: 0.04em;
          color: var(--white);
          line-height: 1.2;
          margin-bottom: 0.8rem;
        }
        .research-conference {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          color: var(--gold);
          margin-bottom: 1.2rem;
          line-height: 1.5;
        }
        .research-status-row {
          margin-bottom: 1.2rem;
        }
        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #10B981;
          border: 1px solid #10B98140;
          padding: 0.3rem 0.8rem;
          background: rgba(16,185,129,0.05);
        }
        .status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #10B981;
          animation: pulse-dot 2s ease infinite;
        }
        .research-desc {
          font-size: 0.85rem;
          line-height: 1.75;
          color: var(--white-dim);
        }
        .research-corner-deco {
          position: absolute;
          bottom: 0; left: 0;
          width: 40px; height: 40px;
          border-left: 2px solid var(--gold-dim);
          border-bottom: 2px solid var(--gold-dim);
          pointer-events: none;
        }
        .research-corner-deco.right {
          left: auto; right: 0;
          bottom: auto; top: 0;
          border: none;
          border-right: 2px solid var(--gold-dim);
          border-top: 2px solid var(--gold-dim);
        }

        /* GitHub window */
        .github-window {
          border: 1px solid var(--white-faint);
          background: var(--navy);
          overflow: hidden;
          font-family: var(--font-mono);
        }
        .gh-titlebar {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.7rem 1rem;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid var(--white-faint);
        }
        .gh-dots { display: flex; gap: 5px; }
        .gh-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
        }
        .gh-dot.red { background: #EF4444; }
        .gh-dot.yellow { background: #C9A84C; }
        .gh-dot.green { background: #10B981; }
        .gh-title {
          flex: 1;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          color: var(--white-dim);
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .gh-open {
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          color: var(--gold);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .gh-open:hover { color: var(--gold-bright); }
        .gh-body {
          padding: 0.5rem 0;
          max-height: 360px;
          overflow-y: auto;
        }
        .gh-loading { padding: 1rem; display: flex; flex-direction: column; gap: 0.8rem; }
        .gh-skeleton {
          height: 10px;
          background: var(--white-faint);
          animation: shimmer 1.5s ease infinite;
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        .gh-error { padding: 1.5rem; text-align: center; }
        .repo-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.7rem 1rem;
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          transition: background 0.15s ease;
          gap: 1rem;
        }
        .repo-row:hover { background: rgba(255,255,255,0.03); }
        .repo-info { flex: 1; min-width: 0; }
        .repo-name {
          display: block;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          color: var(--blue-bright);
          margin-bottom: 0.15rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .repo-desc {
          display: block;
          font-size: 0.6rem;
          color: var(--white-dim);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .repo-meta {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          flex-shrink: 0;
        }
        .repo-lang {
          font-size: 0.58rem;
          letter-spacing: 0.08em;
          color: var(--gold-dim);
          white-space: nowrap;
        }
        .repo-stars {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.58rem;
          color: var(--white-dim);
        }
      `}</style>
    </div>
  );
}
