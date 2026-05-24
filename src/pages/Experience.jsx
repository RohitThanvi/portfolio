import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAdmin } from '../context/AdminContext';

function TimelineItem({ item, index, isLast }) {
  const [open, setOpen] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const colors = ['var(--gold)', 'var(--blue-bright)', '#10B981'];
  const color = colors[index % colors.length];

  return (
    <motion.div
      ref={ref}
      className="timeline-item"
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Connector line */}
      {!isLast && (
        <motion.div
          className="timeline-connector"
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: 1, delay: index * 0.15 + 0.4 }}
        />
      )}

      {/* Node */}
      <div className="timeline-node" style={{ background: color, boxShadow: `0 0 20px ${color}40` }}>
        <div className="node-inner" />
      </div>

      {/* Card */}
      <div className={`timeline-card ${open ? 'expanded' : ''}`} onClick={() => setOpen(o => !o)}>
        <div className="card-header">
          <div className="card-left">
            <div className="card-period" style={{ color }}>
              {item.period}
            </div>
            <div className="card-company">{item.company}</div>
            <div className="card-role">{item.role}</div>
          </div>
          <div className="card-right">
            <span className="card-location">{item.location}</span>
            <span className="expand-toggle" style={{ color }}>
              {open ? '−' : '+'}
            </span>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              className="card-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <ul className="bullet-list">
                {item.bullets.map((b, i) => (
                  <motion.li
                    key={i}
                    className="bullet-item"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <span className="bullet-dash" style={{ color }}>—</span>
                    {b}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const { siteData, isAdmin, editMode, updateData } = useAdmin();
  const experience = siteData.experience;

  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      company: "New Company",
      role: "Role Title",
      period: "Month YYYY – Month YYYY",
      location: "City, India",
      bullets: ["Bullet point one", "Bullet point two"]
    };
    updateData('experience', [...experience, newExp]);
  };

  return (
    <div className="experience-page">
      <div className="page-container">
        <motion.div
          className="exp-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label">Experience</p>
          <div className="gold-line" />
          <h1 className="exp-title">
            Where I've<br />
            <span className="exp-title-gold">built things.</span>
          </h1>
          <p className="exp-sub">Click any card to expand details.</p>
        </motion.div>

        <div className="timeline-wrapper">
          {experience.map((item, i) => (
            <TimelineItem
              key={item.id}
              item={item}
              index={i}
              isLast={i === experience.length - 1}
            />
          ))}
        </div>

        {isAdmin && editMode && (
          <motion.button
            className="add-exp-btn"
            onClick={addExperience}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            + Add Experience
          </motion.button>
        )}
      </div>

      <style>{`
        .experience-page {
          min-height: 100vh;
          padding: 8rem 0 6rem;
        }
        .exp-header {
          margin-bottom: 5rem;
        }
        .exp-title {
          font-family: var(--font-display);
          font-size: clamp(3rem, 6vw, 5rem);
          letter-spacing: 0.03em;
          line-height: 1.05;
          color: var(--white);
          margin-bottom: 1rem;
        }
        .exp-title-gold { color: var(--gold); }
        .exp-sub {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          color: var(--white-dim);
          text-transform: uppercase;
        }
        .timeline-wrapper {
          position: relative;
          padding-left: 3rem;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        @media (max-width: 600px) { .timeline-wrapper { padding-left: 1.5rem; } }

        .timeline-item {
          position: relative;
          padding-bottom: 3rem;
          display: flex;
          align-items: flex-start;
          gap: 2rem;
        }
        .timeline-connector {
          position: absolute;
          left: 10px;
          top: 24px;
          bottom: 0;
          width: 1px;
          background: var(--white-faint);
          transform-origin: top;
        }
        .timeline-node {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 2px;
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .node-inner {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--black);
        }
        .timeline-card {
          flex: 1;
          border: 1px solid var(--white-faint);
          background: var(--navy);
          padding: 1.5rem 2rem;
          cursor: none;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
          overflow: hidden;
        }
        .timeline-card:hover {
          border-color: rgba(201,168,76,0.3);
          box-shadow: 0 4px 30px rgba(0,0,0,0.3);
        }
        .timeline-card.expanded {
          border-color: rgba(201,168,76,0.3);
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }
        .card-period {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 0.4rem;
        }
        .card-company {
          font-family: var(--font-display);
          font-size: 1.4rem;
          letter-spacing: 0.04em;
          color: var(--white);
          margin-bottom: 0.2rem;
          line-height: 1.1;
        }
        .card-role {
          font-size: 0.8rem;
          color: var(--white-dim);
          font-weight: 500;
        }
        .card-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.6rem;
          flex-shrink: 0;
        }
        .card-location {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          color: var(--white-dim);
        }
        .expand-toggle {
          font-family: var(--font-display);
          font-size: 1.5rem;
          line-height: 1;
          cursor: none;
        }
        .card-body {
          overflow: hidden;
        }
        .bullet-list {
          list-style: none;
          padding-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        .bullet-item {
          display: flex;
          gap: 0.8rem;
          font-size: 0.85rem;
          line-height: 1.65;
          color: var(--white-dim);
        }
        .bullet-dash {
          flex-shrink: 0;
          font-weight: 700;
          margin-top: 1px;
        }
        .add-exp-btn {
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
        .add-exp-btn:hover {
          border-color: var(--gold);
          color: var(--gold);
        }
      `}</style>
    </div>
  );
}
