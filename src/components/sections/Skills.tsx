import { skills } from '../../data/portfolio';
import type { Theme } from '../../data/portfolio';
import { GlassCard } from '../ui/GlassCard';
import { SectionHeading, SectionReveal } from '../ui/SectionReveal';

interface Props {
  theme: Theme;
}

export function Skills({ theme }: Props) {
  return (
    <section id="skills" className="studio-section py-28 px-6 md:px-10 relative">
      <div className="max-w-7xl mx-auto">
        <SectionReveal>
          <SectionHeading
            title="Skills"
            subtitle="A practical toolkit chosen per problem—web, backend, AI, cloud, and native client delivery."
            gradient={theme.colors.accent}
            kicker="Capabilities"
          />
        </SectionReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Object.entries(skills).map(([category, items], idx) => (
            <SectionReveal key={category} delay={idx * 0.04}>
              <GlassCard className="p-6 h-full">
                <h3 className="display-title text-lg font-semibold mb-4 text-sky-200">
                  {category}
                </h3>
                <div className="space-y-2">
                  {items.map((skill) => (
                    <div
                      key={skill}
                      className="px-3 py-2 rounded-xl bg-white/[0.025] text-sm border border-white/5 hover:border-sky-300/30 hover:bg-sky-400/5 transition-all"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
