import { upcomingProjects } from '../../data/portfolio';
import type { Theme } from '../../data/portfolio';
import { SectionHeading, SectionReveal } from '../ui/SectionReveal';

interface Props {
  theme: Theme;
}

const statusTone: Record<(typeof upcomingProjects)[number]['status'], string> = {
  'Building now': 'border-emerald-300/30 bg-emerald-300/10 text-emerald-200',
  'In progress': 'border-cyan-300/30 bg-cyan-300/10 text-cyan-200',
  'Next up': 'border-white/15 bg-white/[0.04] text-white/55',
  Expanding: 'border-amber-300/30 bg-amber-300/10 text-amber-100',
};

export function Building({ theme }: Props) {
  return (
    <section id="building" className="studio-section relative px-6 py-28 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="md:mr-[40%]">
          <SectionReveal>
            <SectionHeading
              title="Now building"
              subtitle="Active and upcoming work. Some of it is public. Some of it is still on my machine."
              gradient={theme.colors.accent}
              kicker="02 / Desk"
            />
          </SectionReveal>

          <div className="mt-12 space-y-5">
            {upcomingProjects.map((project, idx) => (
              <SectionReveal key={project.title} delay={idx * 0.03}>
                <article
                  data-cursor
                  className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#080b12]/7 p-6 backdrop-blur-xl transition-colors hover:border-cyan-200/25 md:p-7"
                >
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-[9px] uppercase tracking-[0.18em] ${statusTone[project.status]}`}
                    >
                      {project.status}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-white/25">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="display-title text-2xl font-semibold tracking-tight text-white md:text-3xl">
                    {project.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400 md:text-base">
                    {project.blurb}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.focus.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[11px] text-slate-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </article>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
