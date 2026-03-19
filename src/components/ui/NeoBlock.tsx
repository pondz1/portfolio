"use client";

import { ReactNode, HTMLAttributes } from "react";

interface NeoBlockProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  shadowClass?: string;
  noPadding?: boolean;
}

export function NeoBlock({
  children,
  shadowClass,
  noPadding = false,
  className = "",
  ...props
}: NeoBlockProps) {
  // We use shadowClass manually if passed, otherwise default down
  return (
    <div
      className={`border-4 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-900 ${
        noPadding ? "" : "p-6 md:p-8"
      } ${shadowClass ? shadowClass : "shadow-[8px_8px_0_0_#18181b] dark:shadow-[8px_8px_0_0_#fafafa]"} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
