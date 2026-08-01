import { Briefcase } from 'lucide-react';
import { experience } from '../../data/portfolio';
import type { Theme } from '../../data/portfolio';
import { GlassCard } from '../ui/GlassCard';
import { SectionHeading, SectionReveal } from '../ui/SectionReveal';

interface Props {
  theme: Theme;
}

export function Experience({ theme }: Props) {
  return (
    <section id="experience" className="studio-section py-28 px-6 md:px-10 relative">
      <div className="max-w-7xl mx-auto">
        <SectionReveal>
          <SectionHeading
            title="Experience"
            subtitle="Production engineering under real constraints: incomplete requirements, evolving domain models, and systems that must stay reliable."
            gradient={theme.colors.accent}
            kicker="Career"
          />
        </SectionReveal>

        {experience.map((job, idx) => (
          <SectionReveal key={job.company} delay={0.08 * (idx + 1)}>
            <GlassCard className="p-8 md:p-10">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-sky-400/10 border border-sky-300/20">
                    <Briefcase className="w-5 h-5 text-sky-300" />
                  </div>
                  <div>
                    <h3 className="display-title text-2xl md:text-3xl font-semibold text-white">
                      {job.role}
                    </h3>
                    <p className={`${theme.colors.text} font-medium mt-1`}>{job.company}</p>
                    <p className="text-sm text-slate-400 mt-1">
                      Client: {job.client} · {job.location}
                    </p>
                  </div>
                </div>
                <span className="px-4 py-2 rounded-full text-sm border border-white/10 bg-white/5 text-slate-200">
                  {job.period}
                </span>
              </div>

              <ul className="grid md:grid-cols-2 gap-3">
                {job.bullets.map((bullet, bulletIndex) => (
                  <li key={bullet.slice(0, 48)} className="flex items-start gap-3">
                    <span className="mt-0.5 grid place-items-center w-6 h-6 rounded-full border border-sky-300/20 text-[10px] text-sky-300 flex-shrink-0">
                      {String(bulletIndex + 1).padStart(2, '0')}
                    </span>
                    <p className="text-slate-400 text-sm leading-relaxed">{bullet}</p>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </SectionReveal>
        ))}
      </div>
    </section>
  );
}
