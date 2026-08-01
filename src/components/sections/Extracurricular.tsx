import { extracurricular } from '../../data/portfolio';
import type { Theme } from '../../data/portfolio';
import { GlassCard } from '../ui/GlassCard';
import { SectionHeading, SectionReveal } from '../ui/SectionReveal';

interface Props {
  theme: Theme;
}

export function Extracurricular({ theme }: Props) {
  return (
    <section id="extracurricular" className="studio-section py-28 px-6 md:px-10 relative">
      <div className="max-w-4xl mx-auto">
        <SectionReveal>
          <SectionHeading
            title="Beyond Code"
            subtitle="Performance and teamwork outside engineering keep the craft balanced."
            gradient={theme.colors.accent}
            kicker="Life"
          />
        </SectionReveal>
        <SectionReveal delay={0.08}>
          <GlassCard className="p-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl" aria-hidden>
                🕺
              </span>
              <h3 className="display-title text-2xl font-semibold text-white">
                {extracurricular.title}
              </h3>
            </div>
            <p className="text-slate-400 leading-relaxed">{extracurricular.desc}</p>
          </GlassCard>
        </SectionReveal>
      </div>
    </section>
  );
}
