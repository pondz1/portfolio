"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, Star, GitFork, Code } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { NeoBlock } from "@/components/ui/NeoBlock";

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
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center font-sans">
        <NeoBlock shadowClass="shadow-[8px_8px_0_0_#3B82F6]" className="p-8">
          <div className="text-xl font-black uppercase flex items-center gap-3 dark:text-zinc-50">
            <div className="w-5 h-5 bg-blue-600 animate-spin border-2 border-zinc-900"></div>
            Loading Data...
          </div>
        </NeoBlock>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center font-sans">
        <NeoBlock shadowClass="shadow-[8px_8px_0_0_#EF4444]" className="p-8">
          <div className="text-xl font-black uppercase text-rose-600">
            Failed to load GitHub data
          </div>
        </NeoBlock>
      </div>
    );
  }

  const sortedLanguages = Object.entries(stats.languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-12">
      <PageHeader 
        title="Dashboard" 
        subtitle="GITHUB METRICS" 
        icon={<LayoutDashboard className="w-5 h-5" />} 
        iconClass="bg-blue-600 text-white" 
        shadowClass="shadow-[0_4px_0_0_#3B82F6]" 
      />

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <NeoBlock shadowClass="shadow-[8px_8px_0_0_#18181b] dark:shadow-[8px_8px_0_0_#fafafa]" className="p-6 md:p-8 bg-amber-300 dark:bg-amber-900/40 hover:-translate-y-1 transition-transform cursor-default">
            <div className="text-sm font-black uppercase tracking-widest text-zinc-800 dark:text-amber-200 mb-2">Repositories</div>
            <div className="text-5xl font-black text-zinc-900 dark:text-amber-400 drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)]">
              {stats.repos}
            </div>
          </NeoBlock>
          <NeoBlock shadowClass="shadow-[8px_8px_0_0_#18181b] dark:shadow-[8px_8px_0_0_#fafafa]" className="p-6 md:p-8 bg-blue-300 dark:bg-blue-900/40 hover:-translate-y-1 transition-transform cursor-default">
            <div className="text-sm font-black uppercase tracking-widest text-zinc-800 dark:text-blue-200 mb-2">Followers</div>
            <div className="text-5xl font-black text-zinc-900 dark:text-blue-400 drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)]">
              {stats.followers}
            </div>
          </NeoBlock>
          <NeoBlock shadowClass="shadow-[8px_8px_0_0_#18181b] dark:shadow-[8px_8px_0_0_#fafafa]" className="p-6 md:p-8 bg-rose-300 dark:bg-rose-900/40 hover:-translate-y-1 transition-transform cursor-default">
            <div className="text-sm font-black uppercase tracking-widest text-zinc-800 dark:text-rose-200 mb-2">Following</div>
            <div className="text-5xl font-black text-zinc-900 dark:text-rose-400 drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)]">
              {stats.following}
            </div>
          </NeoBlock>
        </div>

        {/* Languages */}
        <div className="mb-12">
          <h2 className="text-2xl font-black mb-6 uppercase tracking-tight dark:text-zinc-50 border-l-8 border-emerald-500 pl-4">Top Languages</h2>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {sortedLanguages.map(([lang, count]) => (
              <NeoBlock
                key={lang}
                noPadding
                shadowClass="shadow-[4px_4px_0_0_#10B981]"
                className="p-4 bg-white dark:bg-zinc-900 flex justify-between items-center group cursor-default hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
              >
                <div className="font-bold text-sm md:text-base uppercase tracking-wide dark:text-zinc-50 truncate mr-2" title={lang}>
                  {lang}
                </div>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {count}
                </div>
              </NeoBlock>
            ))}
          </div>
        </div>

        {/* Repositories */}
        <div>
          <h2 className="text-2xl font-black mb-6 uppercase tracking-tight dark:text-zinc-50 border-l-8 border-purple-500 pl-4">Recent Repositories</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {stats.publicRepos.slice(0, 10).map((repo: any) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block outline-none"
              >
                 <NeoBlock shadowClass="shadow-[6px_6px_0_0_#A855F7]" className="p-6 bg-white dark:bg-zinc-900 group hover:-translate-y-1 hover:translate-x-1 hover:shadow-[10px_10px_0_0_#A855F7] active:translate-y-0 active:translate-x-0 active:shadow-[2px_2px_0_0_#A855F7] transition-all relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2 uppercase break-words group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {repo.name}
                    </h3>
                    {repo.description ? (
                      <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
                        {repo.description}
                      </p>
                    ) : (
                      <p className="text-sm font-bold text-zinc-400 dark:text-zinc-600 italic mb-4">
                        No description provided.
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-4 text-xs font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-300">
                      {repo.language && (
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-500">
                          <Code className="w-3 h-3 text-emerald-600" />
                          {repo.language}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-500">
                        <Star className="w-3 h-3 text-amber-500" />
                        {repo.stargazers_count}
                      </span>
                      <span className="flex items-center gap-1.5 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-500">
                        <GitFork className="w-3 h-3 text-blue-500" />
                        {repo.forks_count}
                      </span>
                    </div>
                  </div>
                </NeoBlock>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
