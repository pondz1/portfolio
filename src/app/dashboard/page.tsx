"use client";

import { useEffect, useState } from "react";

interface GitHubStats {
  repos: number;
  followers: number;
  following: number;
  publicRepos: any[];
  languages: { [key: string]: number };
}

export default function Dashboard() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/github")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch GitHub data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-red-500">Failed to load GitHub data</div>
      </div>
    );
  }

  const sortedLanguages = Object.entries(stats.languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold dark:text-white">Dashboard</h1>
            <a
              href="/"
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
            >
              ← Back to Portfolio
            </a>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              {stats.repos}
            </div>
            <div className="text-zinc-500 dark:text-zinc-400">Repositories</div>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              {stats.followers}
            </div>
            <div className="text-zinc-500 dark:text-zinc-400">Followers</div>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              {stats.following}
            </div>
            <div className="text-zinc-500 dark:text-zinc-400">Following</div>
          </div>
        </div>

        {/* Languages */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Top Languages</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {sortedLanguages.map(([lang, count]) => (
              <div
                key={lang}
                className="p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-sm"
              >
                <div className="font-semibold dark:text-white mb-2">{lang}</div>
                <div className="text-2xl font-bold text-zinc-600 dark:text-zinc-400">
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Repositories */}
        <div>
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Repositories</h2>
          <div className="space-y-4">
            {stats.publicRepos.slice(0, 10).map((repo: any) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">
                      {repo.name}
                    </h3>
                    {repo.description && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                        {repo.description}
                      </p>
                    )}
                    <div className="flex gap-4 text-xs text-zinc-500 dark:text-zinc-500">
                      {repo.language && (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-zinc-400"></span>
                          {repo.language}
                        </span>
                      )}
                      <span>⭐ {repo.stargazers_count}</span>
                      <span>🍴 {repo.forks_count}</span>
                    </div>
                  </div>
                  <span className="text-zinc-400">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
