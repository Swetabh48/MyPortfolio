import { Book, CalendarDays, Star, Users } from 'lucide-react';
import { responsibilities } from '../../data/portfolio';
import type { Theme } from '../../data/portfolio';
import { GlassCard } from '../ui/GlassCard';
import { SectionHeading, SectionReveal } from '../ui/SectionReveal';

const icons = [Users, Book, Star, CalendarDays];

interface Props {
  theme: Theme;
}

export function Responsibility({ theme }: Props) {
  return (
    <section id="responsibility" className="studio-section py-28 px-6 md:px-10 relative">
      <div className="max-w-7xl mx-auto">
        <SectionReveal>
          <SectionHeading
            title="Leadership"
            subtitle="Roles that taught coordination, communication, and ownership beyond individual contribution."
            gradient={theme.colors.accent}
            kicker="Community"
          />
        </SectionReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {responsibilities.map((resp, idx) => {
            const Icon = icons[idx] ?? Users;
            return (
              <SectionReveal key={resp.title} delay={idx * 0.06}>
                <GlassCard className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-sky-400/10 border border-sky-300/20">
                      <Icon className="w-5 h-5 text-sky-300" />
                    </div>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 text-xs rounded-full">
                      {resp.period}
                    </span>
                  </div>
                  <h3 className="display-title text-xl font-semibold mb-2 text-white">
                    {resp.title}
                  </h3>
                  <p className="text-sm text-slate-400">{resp.desc}</p>
                </GlassCard>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
