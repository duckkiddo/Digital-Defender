'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

interface ConfettiBurstProps {
  count?: number;
  durationMs?: number;
  className?: string;
}

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

function ConfettiBurstBase({ count = 24, durationMs = 1600, className = '' }: ConfettiBurstProps) {
  const items = Array.from({ length: count });
  return (
    <div className={`pointer-events-none relative ${className}`} aria-hidden>
      {items.map((_, i) => {
        const color = COLORS[i % COLORS.length];
        const startX = 0;
        const startY = 0;
        const angle = (i / count) * Math.PI * 2;
        const radius = 60 + (i % 6) * 10;
        const endX = Math.cos(angle) * radius;
        const endY = Math.sin(angle) * radius + 40; // fall slightly
        const size = 4 + (i % 3) * 2;

        return (
          <motion.span
            key={i}
            className="absolute block rounded-sm"
            style={{ width: size, height: size, background: color, left: startX, top: startY }}
            initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
            animate={{ opacity: [0, 1, 0.8, 0], x: endX, y: endY, rotate: 180 + i * 20 }}
            transition={{ duration: durationMs / 1000, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
}

export default memo(ConfettiBurstBase);

