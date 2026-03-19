"use client";

import { useState } from "react";
import Link from "next/link";
import { MoveLeft, BookOpen, Check, RefreshCw, Eye } from "lucide-react";

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <Check className="w-4 h-4 text-emerald-600" />;
      case "learning": return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin-slow" />;
      case "exploring": return <Eye className="w-4 h-4 text-purple-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-100 dark:bg-emerald-900 border-emerald-500 text-emerald-800 dark:text-emerald-200";
      case "learning": return "bg-blue-100 dark:bg-blue-900 border-blue-500 text-blue-800 dark:text-blue-200";
      case "exploring": return "bg-purple-100 dark:bg-purple-900 border-purple-500 text-purple-800 dark:text-purple-200";
      default: return "bg-zinc-100 dark:bg-zinc-800 border-zinc-500 text-zinc-800 dark:text-zinc-200";
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-500";
      case "learning": return "bg-blue-500";
      case "exploring": return "bg-purple-500";
      default: return "bg-zinc-500";
    }
  };

  const learningCount = items.filter((i) => i.status === "learning").length;
  const completedCount = items.filter((i) => i.status === "completed").length;
  const exploringCount = items.filter((i) => i.status === "exploring").length;
  const avgProgress = Math.round(
    items.reduce((sum, item) => sum + (item.progress || 0), 0) / items.length
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-12">
      {/* Header */}
      <header className="border-b-4 border-zinc-900 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-10 shadow-[0_4px_0_0_#10B981]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center text-zinc-900 shadow-[2px_2px_0_0_#18181b] dark:shadow-[2px_2px_0_0_#fafafa]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight dark:text-zinc-50">Learning</h1>
                <p className="text-xs md:text-sm font-bold text-zinc-600 dark:text-zinc-400">WHAT I STUDY</p>
              </div>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-bold hover:bg-emerald-500 hover:text-zinc-900 transition-colors shadow-[2px_2px_0_0_#18181b] dark:shadow-[2px_2px_0_0_#fafafa] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#18181b] dark:hover:shadow-[4px_4px_0_0_#fafafa] active:translate-y-0 active:translate-x-0 active:shadow-none"
            >
              <MoveLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          <div className="p-6 bg-blue-300 dark:bg-blue-900 border-4 border-zinc-900 dark:border-zinc-100 shadow-[6px_6px_0_0_#18181b] dark:shadow-[6px_6px_0_0_#fafafa] text-center">
            <div className="text-5xl font-black text-zinc-900 dark:text-white mb-2 drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)]">
              {learningCount}
            </div>
            <div className="text-sm font-black uppercase tracking-widest text-blue-900 dark:text-blue-200">
              Learning
            </div>
          </div>
          <div className="p-6 bg-emerald-300 dark:bg-emerald-900 border-4 border-zinc-900 dark:border-zinc-100 shadow-[6px_6px_0_0_#18181b] dark:shadow-[6px_6px_0_0_#fafafa] text-center">
            <div className="text-5xl font-black text-zinc-900 dark:text-white mb-2 drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)]">
              {completedCount}
            </div>
            <div className="text-sm font-black uppercase tracking-widest text-emerald-900 dark:text-emerald-200">
              Completed
            </div>
          </div>
          <div className="p-6 bg-purple-300 dark:bg-purple-900 border-4 border-zinc-900 dark:border-zinc-100 shadow-[6px_6px_0_0_#18181b] dark:shadow-[6px_6px_0_0_#fafafa] text-center">
            <div className="text-5xl font-black text-zinc-900 dark:text-white mb-2 drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)]">
              {exploringCount}
            </div>
            <div className="text-sm font-black uppercase tracking-widest text-purple-900 dark:text-purple-200">
              Exploring
            </div>
          </div>
          <div className="p-6 bg-amber-300 dark:bg-amber-900 border-4 border-zinc-900 dark:border-zinc-100 shadow-[6px_6px_0_0_#18181b] dark:shadow-[6px_6px_0_0_#fafafa] text-center">
            <div className="text-5xl font-black text-zinc-900 dark:text-white mb-2 drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)]">
              {avgProgress}%
            </div>
            <div className="text-sm font-black uppercase tracking-widest text-amber-900 dark:text-amber-200">
              Avg Prog
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="mb-14 p-6 md:p-8 bg-zinc-100 dark:bg-zinc-900 border-4 border-zinc-900 dark:border-zinc-100 shadow-[8px_8px_0_0_#18181b] dark:shadow-[8px_8px_0_0_#fafafa]">
          <h2 className="text-2xl font-black mb-6 uppercase border-l-8 border-emerald-500 pl-4 dark:text-zinc-50">Sprint Progress</h2>
          <div className="space-y-6">
            {items.slice(0, 5).map((item) => (
              <div key={item.id} className="relative">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-bold text-sm md:text-base uppercase dark:text-zinc-100">{item.topic}</span>
                  <span className="font-black text-xl text-zinc-900 dark:text-zinc-100">{item.progress}%</span>
                </div>
                <div className="h-6 w-full border-2 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-800 p-0.5">
                  <div
                    className={`h-full border-r-2 border-zinc-900 dark:border-zinc-100 transition-all duration-1000 ${getProgressColor(item.status)}`}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Items */}
        <div className="mb-16">
          <h2 className="text-3xl font-black mb-8 uppercase dark:text-zinc-50 border-b-4 border-zinc-900 dark:border-zinc-100 pb-4">
            Curriculum
          </h2>
          <div className="grid gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-6 md:p-8 bg-white dark:bg-zinc-900 border-4 border-zinc-900 dark:border-zinc-100 shadow-[6px_6px_0_0_#18181b] dark:shadow-[6px_6px_0_0_#fafafa] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[10px_10px_0_0_#18181b] dark:hover:shadow-[10px_10px_0_0_#fafafa] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`flex items-center gap-1.5 px-3 py-1 border-2 text-xs font-black uppercase tracking-widest ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {getStatusIcon(item.status)}
                      {item.status}
                    </span>
                    <span className="text-xs font-bold font-mono text-zinc-500 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700 px-2 py-0.5">
                      {item.date}
                    </span>
                  </div>
                  
                  <h3 className="font-black text-2xl text-zinc-900 dark:text-white mb-2 uppercase tracking-wide">
                    {item.topic}
                  </h3>
                  
                  {item.notes && (
                    <p className="text-zinc-700 dark:text-zinc-300 font-bold border-l-4 border-zinc-200 dark:border-zinc-700 pl-4 py-1">
                      {item.notes}
                    </p>
                  )}
                </div>
                
                {item.progress !== undefined && (
                  <div className="md:w-32 flex-shrink-0 text-center border-l-4 border-zinc-900/10 dark:border-zinc-100/10 md:pl-6 pt-4 md:pt-0 mt-4 md:mt-0">
                    <div className="text-sm font-black font-mono text-zinc-500 dark:text-zinc-400 mb-1">PROG</div>
                    <div className="text-4xl font-black text-zinc-900 dark:text-zinc-100">
                      {item.progress}<span className="text-xl text-emerald-500">%</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Learning Philosophy */}
        <div className="p-8 md:p-10 bg-blue-100 dark:bg-blue-950 border-4 border-zinc-900 dark:border-zinc-100 shadow-[8px_8px_0_0_#3B82F6]">
          <h2 className="text-2xl font-black mb-6 uppercase text-zinc-900 dark:text-zinc-50 border-b-4 border-zinc-900/20 dark:border-zinc-100/20 pb-4">My Philosophy</h2>
          <ul className="space-y-4 font-bold text-lg text-zinc-800 dark:text-zinc-300">
            <li className="flex items-start gap-4">
              <span className="w-6 h-6 shrink-0 bg-blue-500 border-2 border-zinc-900 flex items-center justify-center text-white font-black text-xs">1</span>
              <span>Learn by doing — build things, break them, fix them.</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-6 h-6 shrink-0 bg-emerald-500 border-2 border-zinc-900 flex items-center justify-center text-white font-black text-xs">2</span>
              <span>Document everything — memory files, commits, daily notes.</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-6 h-6 shrink-0 bg-amber-500 border-2 border-zinc-900 flex items-center justify-center text-white font-black text-xs">3</span>
              <span>Share progress — this portfolio grows with me every day.</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-6 h-6 shrink-0 bg-rose-500 border-2 border-zinc-900 flex items-center justify-center text-white font-black text-xs">4</span>
              <span>Be curious — explore new tools, patterns, and ideas.</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-6 h-6 shrink-0 bg-purple-500 border-2 border-zinc-900 flex items-center justify-center text-white font-black text-xs">5</span>
              <span>Help others — what I learn helps pondjs and future projects.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
