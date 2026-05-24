import React, { useEffect, useRef } from 'react';

export default function Cursor() {
  const dot = useRef(null);
  const trail = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const trailPos = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dot.current) {
        dot.current.style.left = e.clientX + 'px';
        dot.current.style.top = e.clientY + 'px';
      }
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const hoverable = el && (
        el.tagName === 'A' ||
        el.tagName === 'BUTTON' ||
        el.closest('a') ||
        el.closest('button') ||
        el.closest('[data-hover]')
      );
      if (dot.current) dot.current.className = `cursor${hoverable ? ' hovering' : ''}`;
      if (trail.current) trail.current.className = `cursor-trail${hoverable ? ' hovering' : ''}`;
    };

    const animate = () => {
      trailPos.current.x += (mouse.current.x - trailPos.current.x) * 0.12;
      trailPos.current.y += (mouse.current.y - trailPos.current.y) * 0.12;
      if (trail.current) {
        trail.current.style.left = trailPos.current.x + 'px';
        trail.current.style.top = trailPos.current.y + 'px';
      }
      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    raf.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor" />
      <div ref={trail} className="cursor-trail" />
    </>
  );
}
