import { useEffect, useState } from 'react';
import {
  contact,
  githubHiddenRepos,
  githubPreferredOrder,
} from '../data/portfolio';

export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
  fork: boolean;
  homepage: string | null;
}

export function useGithubRepos() {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${contact.githubUser}/repos?sort=updated&per_page=100`,
        );
        if (!response.ok) throw new Error('Failed to fetch GitHub repos');
        const data: GithubRepo[] = await response.json();

        const filtered = data
          .filter(
            (repo) =>
              !repo.fork &&
              !githubHiddenRepos.includes(repo.name) &&
              repo.name !== 'MyPortfolio',
          )
          .sort((a, b) => {
            const ai = githubPreferredOrder.indexOf(a.name);
            const bi = githubPreferredOrder.indexOf(b.name);
            const aRank = ai === -1 ? 999 : ai;
            const bRank = bi === -1 ? 999 : bi;
            if (aRank !== bRank) return aRank - bRank;
            return b.stargazers_count - a.stargazers_count;
          });

        setRepos(filtered);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  return { repos, loading, error };
}
