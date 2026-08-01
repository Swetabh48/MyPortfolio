import { Target, Trophy } from 'lucide-react';
import { achievements } from '../../data/portfolio';
import type { Theme } from '../../data/portfolio';
import { GlassCard } from '../ui/GlassCard';
import { SectionHeading, SectionReveal } from '../ui/SectionReveal';

const icons = [Trophy, Target];

interface Props {
  theme: Theme;
}

export function Achievements({ theme }: Props) {
  return (
    <section id="achievements" className="studio-section py-28 px-6 md:px-10 relative">
      <div className="max-w-7xl mx-auto">
        <SectionReveal>
          <SectionHeading
            title="Achievements"
            subtitle="Milestones from competitive coding and robotics competitions."
            gradient={theme.colors.accent}
            kicker="Highlights"
          />
        </SectionReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {achievements.map((item, idx) => {
            const Icon = icons[idx] ?? Trophy;
            return (
              <SectionReveal key={item.title} delay={idx * 0.08}>
                <GlassCard className="p-8">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 bg-gradient-to-br ${item.color} rounded-xl flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="display-title text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                </GlassCard>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
