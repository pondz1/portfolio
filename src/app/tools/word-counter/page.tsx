"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { NeoBlock } from "@/components/ui/NeoBlock";
import { NeoButton } from "@/components/ui/NeoButton";
import { FileText, Trash2, Copy, Check, FileCode } from "lucide-react";

export default function WordCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = {
    words: text.trim() === "" ? 0 : text.trim().split(/\s+/).length,
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, "").length,
    sentences: text.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
    paragraphs: text.split(/\n\n+/).filter(p => p.trim().length > 0).length,
    lines: text.split("\n").length,
  };

  const handleClear = () => {
    setText("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const readingTime = Math.ceil(stats.words / 200); // Average reading speed: 200 words/min

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Word Counter"
          subtitle="Count words, characters, sentences & more"
          icon={<FileText className="w-5 h-5" />}
          iconClass="bg-emerald-600 text-white"
          shadowClass="shadow-[0_4px_0_0_#059669]"
        />

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          {/* Main Editor */}
          <div className="lg:col-span-2">
            <NeoBlock
              shadowClass="shadow-[8px_8px_0_0_#10B981]"
              className="p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black uppercase text-zinc-900 dark:text-zinc-50">
                  Text Input
                </h2>
                <div className="flex gap-2">
                  <NeoButton
                    onClick={handleCopy}
                    variant="secondary"
                    className="py-2 px-4 text-sm flex items-center gap-2"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied ? "Copied!" : "Copy"}
                  </NeoButton>
                  <NeoButton
                    onClick={handleClear}
                    variant="danger"
                    className="py-2 px-4 text-sm flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </NeoButton>
                </div>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Start typing or paste your text here..."
                className="w-full h-96 p-4 font-mono text-base border-2 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 resize-none focus:outline-none focus:border-zinc-600 dark:focus:border-zinc-400"
              />
            </NeoBlock>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <NeoBlock
                shadowClass="shadow-[4px_4px_0_0_#3B82F6]"
                className="p-4 text-center"
              >
                <p className="text-3xl font-black text-blue-600">{stats.words}</p>
                <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400 mt-1 uppercase">
                  Words
                </p>
              </NeoBlock>
              <NeoBlock
                shadowClass="shadow-[4px_4px_0_0_#8B5CF6]"
                className="p-4 text-center"
              >
                <p className="text-3xl font-black text-purple-600">{stats.characters}</p>
                <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400 mt-1 uppercase">
                  Characters
                </p>
              </NeoBlock>
              <NeoBlock
                shadowClass="shadow-[4px_4px_0_0_#EC4899]"
                className="p-4 text-center"
              >
                <p className="text-3xl font-black text-pink-600">{stats.sentences}</p>
                <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400 mt-1 uppercase">
                  Sentences
                </p>
              </NeoBlock>
              <NeoBlock
                shadowClass="shadow-[4px_4px_0_0_#F59E0B]"
                className="p-4 text-center"
              >
                <p className="text-3xl font-black text-amber-600">{readingTime}</p>
                <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400 mt-1 uppercase">
                  Min Read
                </p>
              </NeoBlock>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <NeoBlock
              shadowClass="shadow-[6px_6px_0_0_#6366F1]"
              className="p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 border-2 border-zinc-900 dark:border-zinc-100 bg-indigo-500 text-white flex items-center justify-center shadow-[2px_2px_0_0_#18181b] dark:shadow-[2px_2px_0_0_#fafafa]">
                  <FileCode className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black uppercase text-zinc-900 dark:text-zinc-50">
                  Detailed Stats
                </h3>
              </div>

              <div className="space-y-4">
                <StatItem
                  label="Characters (no spaces)"
                  value={stats.charactersNoSpaces}
                  color="text-indigo-600"
                />
                <StatItem
                  label="Paragraphs"
                  value={stats.paragraphs}
                  color="text-rose-600"
                />
                <StatItem
                  label="Lines"
                  value={stats.lines}
                  color="text-emerald-600"
                />
              </div>
            </NeoBlock>

            <NeoBlock
              shadowClass="shadow-[6px_6px_0_0_#14B8A6]"
              className="p-6"
            >
              <h3 className="text-lg font-black uppercase text-zinc-900 dark:text-zinc-50 mb-4">
                Reading Time
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 font-bold">
                Based on average reading speed of{" "}
                <span className="text-teal-600">200 words/minute</span>
              </p>
              <div className="mt-4 p-4 bg-teal-50 dark:bg-zinc-800 border-2 border-teal-500">
                <p className="text-4xl font-black text-teal-600">
                  {readingTime} min
                </p>
              </div>
            </NeoBlock>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-100">
      <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400 uppercase">
        {label}
      </p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}
