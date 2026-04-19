'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

const ORBS = [
  { x: '12%', y: '22%', size: 6, dur: 5, delay: 0 },
  { x: '78%', y: '30%', size: 4, dur: 6, delay: 1 },
  { x: '28%', y: '68%', size: 5, dur: 7, delay: 0.5 },
  { x: '88%', y: '60%', size: 3, dur: 4.5, delay: 2 },
  { x: '52%', y: '14%', size: 4, dur: 5.5, delay: 1.5 },
  { x: '62%', y: '82%', size: 6, dur: 6.5, delay: 0.8 },
  { x: '40%', y: '45%', size: 3, dur: 5, delay: 1.2 },
];

export function FloatingOrbs() {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setIsMobile(!mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(!e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (isMobile) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {ORBS.map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-brand-blue/10"
          style={{ left: o.x, top: o.y, width: o.size, height: o.size }}
          animate={{ y: [-12, 12, -12], opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: o.dur, delay: o.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}