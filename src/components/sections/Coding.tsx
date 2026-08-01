import { Code2, Star, Terminal } from 'lucide-react';
import { codingProfiles } from '../../data/portfolio';
import type { Theme } from '../../data/portfolio';
import { GlassCard } from '../ui/GlassCard';
import { SectionHeading, SectionReveal } from '../ui/SectionReveal';

const icons = [Code2, Terminal, Star];

interface Props {
  theme: Theme;
}

export function Coding({ theme }: Props) {
  return (
    <section id="coding" className="studio-section py-28 px-6 md:px-10 relative">
      <div className="max-w-7xl mx-auto">
        <SectionReveal>
          <SectionHeading
            title="Profiles"
            subtitle="Competitive programming sharpened my instincts: decompose quickly, reason precisely, and optimize under pressure."
            gradient={theme.colors.accent}
            kicker="Practice"
          />
        </SectionReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {codingProfiles.map((profile, idx) => {
            const Icon = icons[idx] ?? Code2;
            return (
              <SectionReveal key={profile.platform} delay={idx * 0.07}>
                <GlassCard className="p-8 text-center">
                  <a
                    href={profile.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex p-4 bg-gradient-to-br ${profile.color} rounded-2xl mb-4 hover:opacity-90 transition`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </a>
                  <h3 className="display-title text-2xl font-semibold mb-2">
                    {profile.platform}
                  </h3>
                  <a
                    href={profile.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 text-sm mb-4 block hover:text-white transition"
                  >
                    {profile.username}
                  </a>
                  <span
                    className={`inline-block px-4 py-2 bg-gradient-to-r ${profile.color} rounded-full text-sm font-semibold mb-3`}
                  >
                    {profile.badge}
                  </span>
                  <div className="display-title text-4xl font-semibold text-white">
                    {profile.rating}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Rating</p>
                </GlassCard>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
