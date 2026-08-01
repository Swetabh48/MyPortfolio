import { about } from '../../data/portfolio';
import type { Theme } from '../../data/portfolio';
import { GlassCard } from '../ui/GlassCard';
import { SectionHeading, SectionReveal } from '../ui/SectionReveal';

interface Props {
  theme: Theme;
}

export function About({ theme }: Props) {
  const stats = [
    { value: '2026', label: 'Graduation' },
    { value: '1955', label: 'LeetCode' },
    { value: '8.05', label: 'CPI' },
  ];

  return (
    <section id="about" className="studio-section py-28 px-6 md:px-10 relative">
      <div className="max-w-7xl mx-auto">
        <SectionReveal>
          <SectionHeading
            title="About"
            subtitle="A practical engineer focused on systems that survive real usage—clean interfaces, durable backends, and AI that earns its place in production."
            gradient={theme.colors.accent}
            kicker="Introduction"
          />
        </SectionReveal>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
          <SectionReveal delay={0.05}>
            <GlassCard className="p-8 md:p-10 h-full" hover={false}>
              <div className="space-y-5">
                {about.paragraphs.map((p, index) => (
                  <p
                    key={p.slice(0, 40)}
                    className={
                      index === 0
                        ? 'text-lg text-slate-200 leading-relaxed'
                        : 'text-[15px] text-slate-400 leading-relaxed'
                    }
                  >
                    {p}
                  </p>
                ))}
              </div>
            </GlassCard>
          </SectionReveal>

          <SectionReveal delay={0.12}>
            <GlassCard className="p-8 h-full" hover={false}>
              <div className="section-kicker mb-6">Snapshot</div>
              <div className="space-y-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-end justify-between border-b border-white/8 pb-4"
                  >
                    <div>
                      <div className="display-title text-3xl font-semibold text-white">
                        {stat.value}
                      </div>
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-500 mt-1">
                        {stat.label}
                      </div>
                    </div>
                    <div className={`h-px w-16 bg-gradient-to-r ${theme.colors.accent}`} />
                  </div>
                ))}
              </div>
            </GlassCard>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
