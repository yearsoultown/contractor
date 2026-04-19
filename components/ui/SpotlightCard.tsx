'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function SpotlightCard({ children, className, ...props }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  // Spotlight is pointer-only — skip on touch devices entirely
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    setIsPointer(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={isPointer ? (e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      } : undefined}
      onMouseEnter={isPointer ? () => setHovered(true) : undefined}
      onMouseLeave={isPointer ? () => setHovered(false) : undefined}
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      {isPointer && (
        <AnimatePresence>
          {hovered && (
            <motion.div
              key="spot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                background: `radial-gradient(400px at ${pos.x}px ${pos.y}px, rgba(0,82,255,0.07), transparent 80%)`,
              }}
            />
          )}
        </AnimatePresence>
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}