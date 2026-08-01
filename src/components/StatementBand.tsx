import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface StatementBandProps {
  eyebrow: string;
  lineOne: string;
  lineTwo: string;
  reverse?: boolean;
}

export function StatementBand({
  eyebrow,
  lineOne,
  lineTwo,
  reverse = false,
}: StatementBandProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const firstX = useTransform(scrollYProgress, [0, 1], reverse ? ['-12%', '7%'] : ['7%', '-12%']);
  const secondX = useTransform(scrollYProgress, [0, 1], reverse ? ['8%', '-10%'] : ['-10%', '8%']);

  return (
    <section ref={ref} className="relative z-20 overflow-hidden border-y border-white/10 bg-[#06080d]/80 py-24 backdrop-blur-md md:py-36">
      <div className="mx-auto mb-10 max-w-7xl px-6 text-[10px] uppercase tracking-[0.28em] text-cyan-200/55 md:px-10">
        {eyebrow}
      </div>
      <motion.p
        style={{ x: firstX }}
        className="display-title whitespace-nowrap text-[clamp(4rem,11vw,10rem)] font-semibold leading-[0.76] tracking-[-0.065em] text-white"
      >
        {lineOne}
      </motion.p>
      <motion.p
        style={{ x: secondX }}
        className="display-title whitespace-nowrap text-[clamp(4rem,11vw,10rem)] font-semibold leading-[0.9] tracking-[-0.065em] text-transparent [-webkit-text-stroke:1px_rgba(125,211,252,0.45)]"
      >
        {lineTwo}
      </motion.p>
    </section>
  );
}
