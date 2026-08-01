import { coursework, education } from '../../data/portfolio';
import type { Theme } from '../../data/portfolio';
import { GlassCard } from '../ui/GlassCard';
import { SectionHeading, SectionReveal } from '../ui/SectionReveal';

interface Props {
  theme: Theme;
}

export function Education({ theme }: Props) {
  return (
    <section id="education" className="studio-section py-28 px-6 md:px-10 relative">
      <div className="max-w-7xl mx-auto">
        <SectionReveal>
          <SectionHeading
            title="Education"
            subtitle="Civil engineering taught systems thinking. Computer science gave me the tools to build those systems in software."
            gradient={theme.colors.accent}
            kicker="Background"
          />
        </SectionReveal>

        <div className="space-y-4 mb-8">
          {education.map((edu, idx) => (
            <SectionReveal key={edu.name} delay={idx * 0.06}>
              <GlassCard className="p-7 md:p-8">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <h3 className="display-title text-2xl md:text-3xl font-semibold mb-2 text-white">
                      {edu.name}
                    </h3>
                    <p className="text-slate-300 mb-1">{edu.degree}</p>
                    <p className="text-sm text-slate-500">{edu.year}</p>
                  </div>
                  <div
                    className={`text-3xl font-semibold bg-gradient-to-r ${theme.colors.accent} bg-clip-text text-transparent`}
                  >
                    {edu.score}
                  </div>
                </div>
              </GlassCard>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal delay={0.2}>
          <div className="flex flex-wrap gap-2">
            {coursework.map((c) => (
              <span
                key={c}
                className="px-3 py-1.5 text-sm rounded-full bg-white/[0.03] border border-white/10 text-slate-300"
              >
                {c}
              </span>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
