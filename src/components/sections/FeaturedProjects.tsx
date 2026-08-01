import { ExternalLink, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { featuredProjects } from '../../data/portfolio';
import type { Theme } from '../../data/portfolio';
import { usePointerTilt } from '../../hooks/usePointerTilt';
import { SectionHeading, SectionReveal } from '../ui/SectionReveal';

interface Props {
  theme: Theme;
}

export function FeaturedProjects({ theme }: Props) {
  const tilt = usePointerTilt({ strength: 5 });

  return (
    <section id="featured" className="studio-section relative px-6 py-28 md:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionReveal>
          <SectionHeading
            title="Selected Work"
            subtitle="Six products. Different domains. The same obsession with making hard systems feel clear."
            gradient={theme.colors.accent}
            kicker="01 / Work"
          />
        </SectionReveal>

        <div className="mt-16 space-y-24 md:space-y-32">
          {featuredProjects.map((project, idx) => (
            <SectionReveal key={project.title} delay={0.04}>
              <motion.article
                data-cursor
                onPointerMove={tilt.onPointerMove}
                onPointerLeave={tilt.onPointerLeave}
                className={`project-story group relative min-h-[68vh] overflow-hidden rounded-[2rem] border border-white/10 bg-[#080b12]/72 p-7 shadow-2xl backdrop-blur-xl md:p-12 ${
                  idx % 2 === 0 ? 'md:mr-[38%]' : 'md:ml-[38%]'
                }`}
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-[0.08] transition-opacity duration-700 group-hover:opacity-[0.18]`}
                />
                <span className="pointer-events-none absolute -right-3 -top-12 display-title text-[10rem] font-semibold text-white/[0.035] md:text-[15rem]">
                  {String(idx + 1).padStart(2, '0')}
                </span>

                <div className="relative flex min-h-[58vh] flex-col">
                  <div className="mb-14 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {String(idx + 1).padStart(2, '0')} / {project.role}
                    </span>
                    <span className="hidden items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-200/[0.04] px-3 py-1.5 text-[8px] uppercase tracking-[0.18em] text-cyan-100/50 transition-colors group-hover:border-cyan-200/40 group-hover:text-cyan-100 md:flex">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 transition-shadow group-hover:shadow-[0_0_10px_#67e8f9]" />
                      Hover — character reacts
                    </span>
                  </div>

                  <div className="mb-5 flex items-start justify-between gap-4">
                    <h3 className="display-title text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
                      {project.title}
                    </h3>
                    <div className="flex gap-2">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="studio-icon !w-9 !h-9"
                        aria-label={`${project.title} GitHub`}
                      >
                        <Github className="w-4 h-4" />
                      </a>
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="studio-icon !w-9 !h-9"
                          aria-label={`${project.title} live demo`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="mb-7 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
                    {project.description}
                  </p>

                  <div className="mb-8 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto grid gap-3 border-t border-white/10 pt-7 sm:grid-cols-2">
                    {project.highlights.map((highlight) => (
                      <div key={highlight} className="flex items-start gap-2.5">
                        <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sky-300" />
                        <p className="text-xs leading-relaxed text-slate-400">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
