import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAdmin } from '../context/AdminContext';

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  const onMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    setTilt({ x: ((y - cy) / cy) * 10, y: -((x - cx) / cx) * 10 });
    setSpotlight({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const onMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
    >
      <div
        ref={cardRef}
        className="project-card"
        onMouseMove={onMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onMouseLeave}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.02 : 1})`,
          '--spot-x': `${spotlight.x}%`,
          '--spot-y': `${spotlight.y}%`,
          '--accent': project.color,
          borderTopColor: hovered ? project.color : 'var(--white-faint)',
        }}
      >
        {/* Spotlight overlay */}
        <div className="card-spotlight" style={{ opacity: hovered ? 1 : 0 }} />

        <div className="project-card-inner">
          <div className="project-top">
            <span className="project-category">{project.category}</span>
            <a href={project.link || project.github} target="_blank" rel="noreferrer" className="project-ext-link" onClick={e => e.stopPropagation()}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15,3 21,3 21,9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          </div>

          <div className="project-name">{project.name}</div>
          <div className="project-fullname">{project.fullName}</div>
          <p className="project-desc">{project.description}</p>

          <div className="project-highlights">
            {project.highlights.map((h, i) => (
              <div key={i} className="highlight-item">
                <span className="highlight-dot" style={{ background: project.color }} />
                <span>{h}</span>
              </div>
            ))}
          </div>

          <div className="project-tech-row">
            {project.tech.slice(0, 5).map((t, i) => (
              <span key={i} className="tech-tag">{t}</span>
            ))}
            {project.tech.length > 5 && (
              <span className="tech-tag">+{project.tech.length - 5}</span>
            )}
          </div>
        </div>

        <div className="card-number">0{index + 1}</div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const { siteData, isAdmin, editMode, updateData } = useAdmin();
  const projects = siteData.projects;
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...new Set(projects.map(p => p.category.split(' / ')[0]))];
  const filtered = filter === 'All' ? projects : projects.filter(p => p.category.includes(filter));

  const addProject = () => {
    const newP = {
      id: Date.now(),
      name: "New Project",
      fullName: "New Project: Full Name",
      description: "Project description goes here.",
      tech: ["Tech1", "Tech2"],
      highlights: ["Key achievement one", "Key achievement two"],
      category: "AI / Research",
      github: "https://github.com/RohitThanvi",
      color: "#C9A84C"
    };
    updateData('projects', [...projects, newP]);
  };

  return (
    <div className="projects-page">
      <div className="page-container">
        <motion.div
          className="projects-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label">Projects</p>
          <div className="gold-line" />
          <h1 className="projects-title">
            Systems I've<br />
            <span className="projects-title-gold">engineered.</span>
          </h1>
        </motion.div>

        {/* Filter bar */}
        <motion.div
          className="filter-bar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <div className="projects-grid">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {isAdmin && editMode && (
          <button className="add-project-btn" onClick={addProject}>
            + Add Project
          </button>
        )}
      </div>

      <style>{`
        .projects-page {
          min-height: 100vh;
          padding: 8rem 0 6rem;
        }
        .projects-header { margin-bottom: 3rem; }
        .projects-title {
          font-family: var(--font-display);
          font-size: clamp(3rem, 6vw, 5rem);
          letter-spacing: 0.03em;
          line-height: 1.05;
          color: var(--white);
        }
        .projects-title-gold { color: var(--gold); }

        .filter-bar {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 3.5rem;
        }
        .filter-btn {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 0.45rem 1rem;
          background: transparent;
          border: 1px solid var(--white-faint);
          color: var(--white-dim);
          cursor: none;
          transition: all 0.2s ease;
        }
        .filter-btn:hover { border-color: var(--gold-dim); color: var(--gold); }
        .filter-btn.active {
          background: var(--gold);
          border-color: var(--gold);
          color: var(--black);
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.5rem;
        }
        @media (max-width: 600px) { .projects-grid { grid-template-columns: 1fr; } }

        .project-card {
          position: relative;
          background: var(--navy);
          border: 1px solid var(--white-faint);
          border-top: 2px solid var(--white-faint);
          transition: transform 0.12s ease, border-color 0.25s ease, box-shadow 0.25s ease;
          transform-style: preserve-3d;
          overflow: hidden;
          cursor: none;
        }
        .project-card:hover {
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.1);
        }
        .card-spotlight {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at var(--spot-x, 50%) var(--spot-y, 50%),
            rgba(255,255,255,0.04) 0%,
            transparent 60%
          );
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 1;
        }
        .project-card-inner {
          padding: 2rem;
          position: relative;
          z-index: 2;
        }
        .project-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.2rem;
        }
        .project-category {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--accent, var(--gold));
        }
        .project-ext-link {
          color: var(--white-dim);
          transition: color 0.2s ease;
          display: flex;
        }
        .project-ext-link:hover { color: var(--accent, var(--gold)); }
        .project-name {
          font-family: var(--font-display);
          font-size: 2rem;
          letter-spacing: 0.04em;
          color: var(--white);
          line-height: 1;
          margin-bottom: 0.3rem;
        }
        .project-fullname {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          color: var(--white-dim);
          margin-bottom: 1rem;
        }
        .project-desc {
          font-size: 0.82rem;
          line-height: 1.7;
          color: var(--white-dim);
          margin-bottom: 1.2rem;
        }
        .project-highlights {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          margin-bottom: 1.5rem;
        }
        .highlight-item {
          display: flex;
          align-items: baseline;
          gap: 0.6rem;
          font-size: 0.78rem;
          color: var(--white-dim);
          line-height: 1.5;
        }
        .highlight-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 4px;
        }
        .project-tech-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .card-number {
          position: absolute;
          bottom: 1.2rem;
          right: 1.5rem;
          font-family: var(--font-display);
          font-size: 4rem;
          letter-spacing: 0.05em;
          color: rgba(255,255,255,0.03);
          line-height: 1;
          pointer-events: none;
          user-select: none;
          z-index: 1;
        }
        .add-project-btn {
          margin-top: 2rem;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 0.8rem 1.5rem;
          background: transparent;
          border: 1px dashed var(--gold-dim);
          color: var(--gold-dim);
          cursor: none;
          transition: all 0.2s ease;
        }
        .add-project-btn:hover { border-color: var(--gold); color: var(--gold); }
      `}</style>
    </div>
  );
}
