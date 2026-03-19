"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface NeoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "success" | "danger" | "warning";
}

export function NeoButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: NeoButtonProps) {
  let colorClass = "";
  
  switch (variant) {
    case "primary":
      colorClass = "bg-blue-600 text-white hover:bg-blue-500";
      break;
    case "secondary":
      colorClass = "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600";
      break;
    case "success":
      colorClass = "bg-emerald-500 text-zinc-900 hover:bg-emerald-400";
      break;
    case "danger":
      colorClass = "bg-rose-500 text-zinc-900 hover:bg-rose-400";
      break;
    case "warning":
      colorClass = "bg-amber-400 text-zinc-900 hover:bg-amber-300";
      break;
  }

  return (
    <button
      className={`px-6 py-3 border-4 border-zinc-900 dark:border-zinc-100 font-black uppercase text-sm md:text-base tracking-widest shadow-[4px_4px_0_0_#18181b] dark:shadow-[4px_4px_0_0_#fafafa] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#18181b] dark:hover:shadow-[6px_6px_0_0_#fafafa] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer ${colorClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
