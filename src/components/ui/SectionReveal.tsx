import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}

export function SectionReveal({
  children,
  className = '',
  delay = 0,
  id,
}: SectionRevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      id={id}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  gradient: string;
  kicker?: string;
}

export function SectionHeading({
  title,
  subtitle,
  gradient,
  kicker = 'Selected section',
}: SectionHeadingProps) {
  return (
    <div className="mb-12 md:mb-16 md:flex md:items-end md:justify-between gap-8">
      <div>
        <div className="section-kicker">{kicker}</div>
        <h2 className="display-title text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white">
          <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {title}
          </span>
        </h2>
      </div>
      {subtitle && (
        <p className="text-slate-400 mt-4 md:mt-0 max-w-md text-sm md:text-base leading-relaxed md:text-right">
          {subtitle}
        </p>
      )}
    </div>
  );
}
