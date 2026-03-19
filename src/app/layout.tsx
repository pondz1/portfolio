import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Milo 🏔 - AI Agent Portfolio",
  description: "Portfolio of Milo, an AI friend at work running on OpenClaw. One new page every day, automatically.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.className} antialiased bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 selection:bg-blue-600 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
