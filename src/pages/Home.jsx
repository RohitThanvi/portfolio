import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import EditableText from '../components/EditableText';

const ROLES = ['AI/ML Engineer', 'LLM Architect', 'Systems Builder', 'Researcher'];

export default function Home() {
  const { siteData } = useAdmin();
  const hero = siteData.hero || {};
  const canvasRef = useRef(null);
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  // Typewriter
  useEffect(() => {
    let timeout;
    const role = ROLES[roleIdx];
    if (typing) {
      if (displayed.length < role.length) {
        timeout = setTimeout(() => setDisplayed(role.slice(0, displayed.length + 1)), 70);
      } else {
        timeout = setTimeout(() => setTyping(false), 1800);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(d => d.slice(0, -1)), 40);
      } else {
        setRoleIdx(i => (i + 1) % ROLES.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing, roleIdx]);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${p.opacity})`;
        ctx.fill();
      });
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(37,99,235,${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  const stats = [
    { val: '3', label: 'Internships' },
    { val: '6+', label: 'Projects' },
    { val: '8.99', label: 'CGPA' },
    { val: '5', label: 'Countries Served' },
  ];

  return (
    <section className="hero-section">
      <canvas ref={canvasRef} className="hero-canvas" />
      
      <motion.div className="hero-content page-container" style={{ y: heroY, opacity: heroOpacity }}>
        <motion.div
          className="hero-eyebrow"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <span className="eyebrow-dot" />
          <span className="section-label" style={{ marginBottom: 0 }}>Available for opportunities</span>
        </motion.div>

        <motion.h1
          className="hero-name"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <EditableText path="hero.name" tag="span" />
        </motion.h1>

        <motion.div
          className="hero-role-row"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <span className="hero-role">{displayed}<span className="caret">|</span></span>
        </motion.div>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
        >
          <EditableText path="hero.subtitle" />
        </motion.p>

        <motion.div
          className="hero-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <Link to="/projects" className="btn-primary">View Work</Link>
          <Link to="/contact" className="btn-blue">Get in Touch</Link>
        </motion.div>

        <motion.div
          className="hero-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          {stats.map((s, i) => (
            <div key={i} className="stat-item">
              <span className="stat-val">{s.val}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="scroll-line" />
        <span className="scroll-text">Scroll</span>
      </motion.div>

      {/* Big decorative text */}
      <div className="hero-deco-text">ENGINEER</div>

      <style>{`
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding-top: 8rem;
          padding-bottom: 4rem;
        }
        .hero-canvas {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 900px;
        }
        .hero-eyebrow {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 1.5rem;
        }
        .eyebrow-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--gold);
          animation: pulse-dot 2s ease infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(201,168,76,0); }
        }
        .hero-name {
          font-family: var(--font-display);
          font-size: clamp(4rem, 11vw, 9rem);
          line-height: 0.9;
          letter-spacing: 0.02em;
          color: var(--white);
          margin-bottom: 1.2rem;
          text-shadow: 0 0 80px rgba(37,99,235,0.15);
        }
        .hero-role-row {
          margin-bottom: 1.5rem;
          min-height: 2.5rem;
        }
        .hero-role {
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 4vw, 2.8rem);
          letter-spacing: 0.08em;
          color: var(--gold);
        }
        .caret {
          animation: blink 1s step-end infinite;
          color: var(--blue-bright);
          margin-left: 2px;
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .hero-subtitle {
          font-size: 1rem;
          line-height: 1.7;
          color: var(--white-dim);
          max-width: 520px;
          margin-bottom: 2.5rem;
        }
        .hero-cta {
          display: flex;
          gap: 1.2rem;
          flex-wrap: wrap;
          margin-bottom: 4rem;
        }
        .hero-stats {
          display: flex;
          gap: 3rem;
          flex-wrap: wrap;
          border-top: 1px solid var(--white-faint);
          padding-top: 2rem;
        }
        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .stat-val {
          font-family: var(--font-display);
          font-size: 2.5rem;
          letter-spacing: 0.05em;
          color: var(--white);
          line-height: 1;
        }
        .stat-label {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--gold-dim);
        }
        .scroll-indicator {
          position: absolute;
          bottom: 2.5rem;
          right: clamp(1.5rem, 5vw, 5rem);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          z-index: 2;
        }
        .scroll-line {
          width: 1px;
          height: 60px;
          background: linear-gradient(to bottom, var(--gold), transparent);
          animation: scroll-line 2s ease infinite;
        }
        @keyframes scroll-line {
          0% { transform: scaleY(0); transform-origin: top; opacity: 1; }
          50% { transform: scaleY(1); transform-origin: top; opacity: 1; }
          100% { transform: scaleY(1); transform-origin: bottom; opacity: 0; }
        }
        .scroll-text {
          font-family: var(--font-mono);
          font-size: 0.55rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--white-dim);
          writing-mode: vertical-rl;
        }
        .hero-deco-text {
          position: absolute;
          right: -2%;
          top: 50%;
          transform: translateY(-50%);
          font-family: var(--font-display);
          font-size: clamp(6rem, 18vw, 18rem);
          letter-spacing: 0.05em;
          color: transparent;
          -webkit-text-stroke: 1px rgba(37,99,235,0.08);
          pointer-events: none;
          user-select: none;
          z-index: 1;
          white-space: nowrap;
        }
      `}</style>
    </section>
  );
}
