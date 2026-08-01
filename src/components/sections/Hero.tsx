import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, FileText, Github, Linkedin, Mail } from 'lucide-react';
import { contact } from '../../data/portfolio';
import type { Theme } from '../../data/portfolio';

interface HeroProps {
  theme: Theme;
}

export function Hero({ theme }: HeroProps) {
  const socials = [
    { Icon: Github, href: contact.github, label: 'GitHub' },
    { Icon: Linkedin, href: contact.linkedin, label: 'LinkedIn' },
    { Icon: Mail, href: `mailto:${contact.email}`, label: 'Email' },
    { Icon: FileText, href: contact.resume, label: 'Resume' },
  ];

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden studio-hero">
      <div className="absolute inset-0 studio-noise opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,rgba(56,189,248,0.12),transparent_34%),radial-gradient(circle_at_20%_20%,rgba(129,140,248,0.1),transparent_30%)]" />

      <div className="relative z-10 min-h-screen max-w-7xl mx-auto px-6 md:px-10 flex items-center">
        <div className="w-full md:w-[54%] pt-28 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs tracking-[0.18em] uppercase text-sky-200/90 mb-7"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {contact.availability}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-sm text-slate-400 mb-4 tracking-wide"
          >
            Software Engineer · AI Systems · Product Engineering
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="display-title text-[clamp(3.2rem,7.4vw,7.2rem)] font-semibold leading-[0.86] tracking-[-0.055em] text-white"
          >
            Swetabh
            <br />
            <span className={`bg-gradient-to-r ${theme.colors.accent} bg-clip-text text-transparent`}>
              Salampuria
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2 }}
            className="mt-7 max-w-xl text-base md:text-lg text-slate-300 leading-relaxed"
          >
            Product-minded engineer building AI systems, real-time platforms, and
            interfaces where complexity feels effortless.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.3 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <a href="#featured" className="studio-btn studio-btn-primary">
              View selected work
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href={contact.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="studio-btn"
            >
              Download resume
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex items-center gap-3"
          >
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="studio-icon"
                aria-label={label}
                title={label}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </motion.div>
        </div>
      </div>

      <a
        href="#featured"
        className="absolute bottom-7 right-7 z-20 hidden items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/45 transition-colors hover:text-white md:flex"
      >
        Scroll to explore
        <ArrowDownRight className="h-4 w-4" />
      </a>
      <div className="absolute bottom-0 left-0 z-10 w-full overflow-hidden border-y border-white/8 bg-black/15 py-3 backdrop-blur-sm">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          className="flex w-max gap-10 whitespace-nowrap text-[10px] uppercase tracking-[0.28em] text-white/35"
        >
          {[0, 1].map((copy) => (
            <span key={copy}>
              Full-stack systems&nbsp;&nbsp;✦&nbsp;&nbsp;Applied AI&nbsp;&nbsp;✦&nbsp;&nbsp;Product
              engineering&nbsp;&nbsp;✦&nbsp;&nbsp;Real-time experiences&nbsp;&nbsp;✦&nbsp;&nbsp;
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
