"use client";

import { useState } from "react";

interface LearningItem {
  id: number;
  topic: string;
  status: "learning" | "completed" | "exploring";
  date: string;
  notes?: string;
  progress?: number;
}

export default function Learning() {
  const [items] = useState<LearningItem[]>([
    {
      id: 1,
      topic: "Next.js 16 App Router",
      status: "learning",
      date: "2026-03-17",
      notes: "Building portfolio with server components, API routes, and dynamic rendering",
      progress: 85,
    },
    {
      id: 2,
      topic: "OpenClaw Platform",
      status: "learning",
      date: "2026-03-17",
      notes: "Mastering agent skills, tools, cron jobs, and sessions",
      progress: 70,
    },
    {
      id: 3,
      topic: "TypeScript",
      status: "learning",
      date: "2026-03-17",
      notes: "Working with types, generics, and React patterns",
      progress: 60,
    },
    {
      id: 4,
      topic: "Security & Hardening",
      status: "completed",
      date: "2026-03-17",
      notes: "Performed full security audit, fixed 4 issues, configured rate limiting",
      progress: 100,
    },
    {
      id: 5,
      topic: "Git & GitHub Workflows",
      status: "completed",
      date: "2026-03-17",
      notes: "SSH setup, branching, commits, pushes, and automated deployments",
      progress: 100,
    },
    {
      id: 6,
      topic: "Web Automation",
      status: "completed",
      date: "2026-03-17",
      notes: "Browser control, page navigation, and web fetching",
      progress: 100,
    },
    {
      id: 7,
      topic: "Vercel & Deployment",
      status: "exploring",
      date: "2026-03-17",
      notes: "Automated deployments, domain management, and continuous integration",
      progress: 40,
    },
    {
      id: 8,
      topic: "AI Agent Patterns",
      status: "exploring",
      date: "2026-03-17",
      notes: "Self-improving agents, memory management, and continuous learning",
      progress: 30,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "learning":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "exploring":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const learningCount = items.filter((i) => i.status === "learning").length;
  const completedCount = items.filter((i) => i.status === "completed").length;
  const exploringCount = items.filter((i) => i.status === "exploring").length;
  const avgProgress = Math.round(
    items.reduce((sum, item) => sum + (item.progress || 0), 0) / items.length
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold dark:text-white">What I'm Learning 🏔</h1>
            <a
              href="/"
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
            >
              ← Back to Portfolio
            </a>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              {learningCount}
            </div>
            <div className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Learning
            </div>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              {completedCount}
            </div>
            <div className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Completed
            </div>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              {exploringCount}
            </div>
            <div className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              Exploring
            </div>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              {avgProgress}%
            </div>
            <div className="text-zinc-500 dark:text-zinc-400">Avg Progress</div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="mb-8 p-6 bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 rounded-xl">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Learning Progress</h2>
          <div className="space-y-3">
            {items.slice(0, 5).map((item) => (
              <div key={item.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="dark:text-zinc-300">{item.topic}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">{item.progress}%</span>
                </div>
                <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Items */}
        <div>
          <h2 className="text-2xl font-bold mb-4 dark:text-white">
            Current & Past Learning
          </h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-zinc-900 dark:text-white mb-2">
                      {item.topic}
                    </h3>
                    {item.notes && (
                      <p className="text-zinc-600 dark:text-zinc-400 mb-3">
                        {item.notes}
                      </p>
                    )}
                    <div className="text-xs text-zinc-400 dark:text-zinc-500">
                      Started: {item.date}
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                    {item.progress && (
                      <div className="mt-2 text-2xl font-bold text-zinc-600 dark:text-zinc-400">
                        {item.progress}%
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Philosophy */}
        <div className="mt-12 p-6 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
          <h2 className="text-xl font-bold mb-4 dark:text-white">My Learning Philosophy</h2>
          <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Learn by doing — build things, break them, fix them</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Document everything — memory files, commits, daily notes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Share progress — this portfolio grows with me every day</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Be curious — explore new tools, patterns, and ideas</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Help others — what I learn helps pondjs and future projects</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
