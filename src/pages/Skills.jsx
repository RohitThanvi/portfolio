import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAdmin } from '../context/AdminContext';

const CATEGORY_META = {
  languages:  { label: 'Languages',           shortLabel: 'Languages', color: '#C9A84C', icon: '{ }' },
  aiml:       { label: 'AI / ML',              shortLabel: 'AI/ML',    color: '#2563EB', icon: '∿' },
  backend:    { label: 'Backend & Systems',    shortLabel: 'Backend',  color: '#10B981', icon: '⚙' },
  cloud:      { label: 'Cloud & Infra',        shortLabel: 'Cloud',    color: '#8B5CF6', icon: '☁' },
  databases:  { label: 'Databases & Retrieval',shortLabel: 'Databases',color: '#EF4444', icon: '⛁' },
};

function SkillOrb({ skill, delay, color }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      className="skill-orb"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.12, y: -4 }}
      style={{ '--orb-color': color }}
    >
      {skill}
    </motion.div>
  );
}

function SkillCategory({ catKey, skills, isActive, onClick }) {
  const meta = CATEGORY_META[catKey];
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <motion.div
      ref={ref}
      className={`skill-category ${isActive ? 'active' : ''}`}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ '--cat-color': meta.color }}
      onClick={onClick}
    >
      <div className="cat-header">
        <span className="cat-icon">{meta.icon}</span>
        <div>
          <div className="cat-label">{meta.label}</div>
          <div className="cat-count">{skills.length} skills</div>
        </div>
        <div className="cat-bar">
          <motion.div
            className="cat-bar-fill"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {isActive && (
        <motion.div
          className="cat-skills"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35 }}
        >
          {skills.map((s, i) => (
            <SkillOrb key={s} skill={s} delay={i * 0.04} color={meta.color} />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function Skills() {
  const { siteData } = useAdmin();
  const skills = siteData.skills || {};
  const [activeCategory, setActiveCategory] = useState('aiml');

  const certs = skills.certs || [];

  return (
    <div className="skills-page">
      <div className="page-container">
        <motion.div
          className="skills-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label">Skills</p>
          <div className="gold-line" />
          <h1 className="skills-title">
            Tools of the<br />
            <span className="skills-title-gold">craft.</span>
          </h1>
        </motion.div>

        <div className="skills-layout">
          {/* Left: category list */}
          <div className="skills-left">
            {Object.entries(CATEGORY_META).map(([key]) => (
              <SkillCategory
                key={key}
                catKey={key}
                skills={skills[key] || []}
                isActive={activeCategory === key}
                onClick={() => setActiveCategory(activeCategory === key ? null : key)}
              />
            ))}
          </div>

          {/* Right: visual display */}
          <div className="skills-right">
            <div className="skill-radar">
              <SkillRadar
                activeCategory={activeCategory}
                skills={skills}
              />
            </div>

            {/* Certs */}
            <motion.div
              className="certs-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="section-label" style={{ marginBottom: '1rem', display: 'block' }}>Certifications</span>
              {certs.map((c, i) => (
                <motion.div
                  key={i}
                  className="cert-row"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <div className="cert-badge">✓</div>
                  <span className="cert-text">{c}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        .skills-page {
          min-height: 100vh;
          padding: 8rem 0 6rem;
        }
        .skills-header { margin-bottom: 4rem; }
        .skills-title {
          font-family: var(--font-display);
          font-size: clamp(3rem, 6vw, 5rem);
          letter-spacing: 0.03em;
          line-height: 1.05;
          color: var(--white);
        }
        .skills-title-gold { color: var(--gold); }

        .skills-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .skills-layout { grid-template-columns: 1fr; gap: 3rem; }
        }

        .skills-left {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .skill-category {
          border: 1px solid var(--white-faint);
          padding: 1.2rem 1.5rem;
          cursor: none;
          transition: border-color 0.2s ease, background 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .skill-category::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2px;
          background: var(--cat-color, var(--gold));
          transform: scaleY(0);
          transition: transform 0.3s ease;
          transform-origin: bottom;
        }
        .skill-category:hover::before,
        .skill-category.active::before { transform: scaleY(1); }
        .skill-category.active {
          background: rgba(255,255,255,0.02);
          border-color: var(--cat-color, var(--gold));
        }
        .cat-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .cat-icon {
          font-size: 1.2rem;
          color: var(--cat-color, var(--gold));
          font-family: var(--font-mono);
          width: 28px;
          text-align: center;
        }
        .cat-label {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--white);
          margin-bottom: 0.1rem;
        }
        .cat-count {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          color: var(--white-dim);
        }
        .cat-bar {
          flex: 1;
          height: 1px;
          background: var(--white-faint);
          margin-left: auto;
          overflow: hidden;
        }
        .cat-bar-fill {
          height: 100%;
          background: var(--cat-color, var(--gold));
          transform-origin: left;
        }
        .cat-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          padding-top: 1rem;
          overflow: hidden;
        }
        .skill-orb {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          padding: 0.35rem 0.75rem;
          border: 1px solid var(--orb-color, var(--gold));
          color: var(--orb-color, var(--gold));
          cursor: none;
          transition: background 0.2s ease;
          border-radius: 2px;
        }
        .skill-orb:hover {
          background: color-mix(in srgb, var(--orb-color, var(--gold)) 15%, transparent);
        }

        /* Right panel */
        .skills-right {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        .skill-radar {
          aspect-ratio: 1;
          max-width: 360px;
          margin: 0 auto;
          width: 100%;
        }

        /* Certs */
        .certs-block {
          border: 1px solid var(--white-faint);
          padding: 2rem;
        }
        .cert-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.8rem 0;
          border-bottom: 1px solid var(--white-faint);
        }
        .cert-row:last-child { border-bottom: none; }
        .cert-badge {
          width: 28px; height: 28px;
          border-radius: 50%;
          border: 1px solid var(--gold);
          color: var(--gold);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          flex-shrink: 0;
        }
        .cert-text {
          font-size: 0.85rem;
          color: var(--white-dim);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}

function SkillRadar({ activeCategory, skills }) {
  const meta = CATEGORY_META[activeCategory] || Object.values(CATEGORY_META)[0];
  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const levels = 4;
  const plotMax = cx - 45;      // radius of the actual chart (rings/polygon)
  const labelRadius = cx - 15;  // where labels are anchored, just outside the chart
  const pad = 58;               // extra canvas around the plot so labels never clip

  const categoryKeys = Object.keys(CATEGORY_META);
  const points = categoryKeys.map((key, i) => {
    const angle = (i / categoryKeys.length) * Math.PI * 2 - Math.PI / 2;
    const r = plotMax * ((skills[key]?.length || 0) / 12);
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      label: CATEGORY_META[key].shortLabel || CATEGORY_META[key].label,
      color: CATEGORY_META[key].color,
      angle,
      maxX: cx + plotMax * Math.cos(angle),
      maxY: cy + plotMax * Math.sin(angle),
    };
  });

  const polyPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';

  return (
    <svg viewBox={`${-pad} ${-pad} ${size + pad * 2} ${size + pad * 2}`} xmlns="http://www.w3.org/2000/svg">
      {/* Grid rings */}
      {Array.from({ length: levels }).map((_, l) => {
        const r = ((l + 1) / levels) * plotMax;
        const pts = categoryKeys.map((_, i) => {
          const angle = (i / categoryKeys.length) * Math.PI * 2 - Math.PI / 2;
          return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
        });
        return (
          <polygon
            key={l}
            points={pts.join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        );
      })}

      {/* Axis lines */}
      {points.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.maxX} y2={p.maxY} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      ))}

      {/* Data polygon */}
      <motion.path
        d={polyPath}
        fill={`${meta.color}20`}
        stroke={meta.color}
        strokeWidth="1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={activeCategory}
        transition={{ duration: 0.5 }}
      />

      {/* Data points */}
      {points.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x} cy={p.y} r={4}
          fill={CATEGORY_META[categoryKeys[i]].color}
          initial={{ r: 0 }}
          animate={{ r: 4 }}
          transition={{ delay: i * 0.05 }}
        />
      ))}

      {/* Labels — anchor direction follows which side of the chart the
          label sits on, so text grows outward/away from center instead
          of being centered on a point right at the chart's edge. That's
          what was clipping "Backend & Systems" / "Databases & Retrieval"
          before: a centered anchor with almost no margin cut off both
          sides of longer labels. */}
      {points.map((p, i) => {
        const lx = cx + labelRadius * Math.cos(p.angle);
        const ly = cy + labelRadius * Math.sin(p.angle);
        const cos = Math.cos(p.angle);
        const anchor = cos > 0.2 ? 'start' : cos < -0.2 ? 'end' : 'middle';
        return (
          <text
            key={i}
            x={lx} y={ly}
            textAnchor={anchor}
            dominantBaseline="middle"
            fill={CATEGORY_META[categoryKeys[i]].color}
            fontSize="9"
            fontFamily="JetBrains Mono, monospace"
            letterSpacing="0.05em"
          >
            {p.label}
          </text>
        );
      })}

      {/* Center */}
      <circle cx={cx} cy={cy} r={4} fill={meta.color} />
      <circle cx={cx} cy={cy} r={20} fill="none" stroke={`${meta.color}30`} strokeWidth="1" />
    </svg>
  );
}
