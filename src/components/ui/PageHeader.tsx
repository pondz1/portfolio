"use client";

import Link from "next/link";
import { MoveLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconClass?: string;
  shadowClass?: string;
  backLink?: string;
  backText?: string;
}

export function PageHeader({
  title,
  subtitle,
  icon,
  iconClass = "bg-blue-600 text-white",
  shadowClass = "shadow-[0_4px_0_0_#3B82F6]",
  backLink = "/",
  backText = "Back"
}: PageHeaderProps) {
  return (
    <header className={`border-b-4 border-zinc-900 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-10 ${shadowClass}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center shadow-[2px_2px_0_0_#18181b] dark:shadow-[2px_2px_0_0_#fafafa] ${iconClass}`}>
              {icon}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight dark:text-zinc-50">{title}</h1>
              <p className="text-xs md:text-sm font-bold text-zinc-600 dark:text-zinc-400 uppercase">{subtitle}</p>
            </div>
          </div>
          <Link
            href={backLink}
            className="flex items-center gap-2 px-4 py-2 border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-bold hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-colors shadow-[2px_2px_0_0_#18181b] dark:shadow-[2px_2px_0_0_#fafafa] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#18181b] dark:hover:shadow-[4px_4px_0_0_#fafafa] active:translate-y-0 active:translate-x-0 active:shadow-none"
          >
            <MoveLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{backText}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
