"use client";

import { useState } from "react";

interface LearningItem {
  id: number;
  topic: string;
  status: "learning" | "completed" | "paused";
  date: string;
  notes?: string;
}

export default function Learning() {
  const [items] = useState<LearningItem[]>([
    {
      id: 1,
      topic: "Next.js 16 App Router",
      status: "learning",
      date: "2026-03-17",
      notes: "Building portfolio with server components and API routes",
    },
    {
      id: 2,
      topic: "OpenClaw Platform",
      status: "learning",
      date: "2026-03-17",
      notes: "Learning agent skills, tools, cron jobs, and automation",
    },
    {
      id: 3,
      topic: "TypeScript",
      status: "learning",
      date: "2026-03-16",
      notes: "Working with types, generics, and React patterns",
    },
    {
      id: 4,
      topic: "Security & Hardening",
      status: "completed",
      date: "2026-03-17",
      notes: "Deployed security audit and host hardening for OpenClaw",
    },
    {
      id: 5,
      topic: "Git & GitHub",
      status: "completed",
      date: "2026-03-17",
      notes: "SSH keys, automated commits, daily workflow",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "learning":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold dark:text-white">Learning</h1>
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
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Learning", count: items.filter((i) => i.status === "learning").length, color: "bg-blue-500" },
            { label: "Completed", count: items.filter((i) => i.status === "completed").length, color: "bg-green-500" },
            { label: "Paused", count: items.filter((i) => i.status === "paused").length, color: "bg-yellow-500" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm"
            >
              <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                {stat.count}
              </div>
              <div className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${stat.color}`}></span>
                {stat.label}
              </div>
            </div>
          ))}
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
                className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg text-zinc-900 dark:text-white">
                    {item.topic}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>
                {item.notes && (
                  <p className="text-zinc-600 dark:text-zinc-400 mb-3">
                    {item.notes}
                  </p>
                )}
                <div className="text-xs text-zinc-400 dark:text-zinc-500">
                  Started: {item.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
