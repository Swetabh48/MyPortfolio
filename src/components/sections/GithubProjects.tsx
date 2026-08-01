import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  GitFork,
  Star,
} from 'lucide-react';
import { useState } from 'react';
import type { Theme } from '../../data/portfolio';
import { useGithubRepos } from '../../hooks/useGithubRepos';
import { GlassCard } from '../ui/GlassCard';
import { SectionHeading, SectionReveal } from '../ui/SectionReveal';

interface Props {
  theme: Theme;
}

export function GithubProjects({ theme }: Props) {
  const { repos, loading, error } = useGithubRepos();
  const [index, setIndex] = useState(0);
  const pageSize = 2;

  const next = () =>
    setIndex((prev) => (prev + pageSize >= repos.length ? 0 : prev + pageSize));
  const prev = () =>
    setIndex((prev) =>
      prev - pageSize < 0 ? Math.max(0, repos.length - pageSize) : prev - pageSize,
    );

  return (
    <section id="projects" className="studio-section py-28 px-6 md:px-10 relative">
      <div className="max-w-7xl mx-auto">
        <SectionReveal>
          <SectionHeading
            title="More on GitHub"
            subtitle="Additional public repositories beyond the featured case studies."
            gradient={theme.colors.accent}
            kicker="Archive"
          />
        </SectionReveal>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-14 h-14 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-slate-400">Loading projects...</p>
          </div>
        ) : error ? (
          <p className="text-center text-red-300">{error}</p>
        ) : (
          <div className="relative">
            <button
              type="button"
              onClick={prev}
              disabled={index === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-5 z-10 p-3 rounded-full border border-white/10 bg-white/5 transition-all disabled:opacity-0 disabled:pointer-events-none hover:scale-105"
              aria-label="Previous projects"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="overflow-hidden px-2">
              <div className="grid md:grid-cols-2 gap-6" key={index}>
                {repos.slice(index, index + pageSize).map((repo, idx) => (
                  <SectionReveal key={repo.id} delay={idx * 0.06}>
                    <GlassCard className="p-8 min-h-[320px]">
                      <div className="relative h-full flex flex-col">
                        <div className="flex items-start justify-between mb-5">
                          <h3
                            className={`display-title text-2xl font-semibold ${theme.colors.text} line-clamp-2 flex-1 pr-3`}
                          >
                            {repo.name}
                          </h3>
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="studio-icon !w-10 !h-10 flex-shrink-0"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>

                        <p className="text-sm text-slate-300 mb-5 line-clamp-3 flex-grow leading-relaxed">
                          {repo.description || 'No description available'}
                        </p>

                        {repo.language && (
                          <div className="flex items-center gap-2 mb-4">
                            <span className="w-2.5 h-2.5 rounded-full bg-sky-300" />
                            <span className="text-sm text-slate-300">{repo.language}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-5 text-sm text-slate-400 mb-4">
                          <div className="flex items-center gap-1.5">
                            <Star className="w-4 h-4" />
                            <span>{repo.stargazers_count}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <GitFork className="w-4 h-4" />
                            <span>{repo.forks_count}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(repo.updated_at).toLocaleDateString('en-US', {
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>

                        {repo.topics?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {repo.topics.slice(0, 4).map((topic) => (
                              <span
                                key={topic}
                                className="px-2.5 py-1 bg-white/[0.04] text-xs rounded-lg border border-white/10"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </GlassCard>
                  </SectionReveal>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={next}
              disabled={index + pageSize >= repos.length}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-5 z-10 p-3 rounded-full border border-white/10 bg-white/5 transition-all disabled:opacity-0 disabled:pointer-events-none hover:scale-105"
              aria-label="Next projects"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="flex justify-center items-center gap-2.5 mt-10">
              {Array.from({ length: Math.ceil(repos.length / pageSize) }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setIndex(idx * pageSize)}
                  className={`rounded-full transition-all ${
                    index === idx * pageSize
                      ? 'bg-sky-300 w-10 h-2.5'
                      : 'bg-white/25 w-2.5 h-2.5 hover:bg-white/50'
                  }`}
                  aria-label={`Go to page ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
