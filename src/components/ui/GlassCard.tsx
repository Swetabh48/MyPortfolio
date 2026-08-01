import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = '', hover = true }: GlassCardProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={`studio-panel group relative overflow-hidden ${className}`}
      whileHover={
        hover && !reduced
          ? { y: -5, borderColor: 'rgba(125,211,252,0.28)' }
          : undefined
      }
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
    >
      {children}
    </motion.div>
  );
}
