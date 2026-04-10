"use client";

import { useState, useCallback, useMemo } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { NeoBlock } from "@/components/ui/NeoBlock";
import { NeoButton } from "@/components/ui/NeoButton";
import { Copy, Check, FileText, AlignLeft, Type, RefreshCw, Settings2 } from "lucide-react";

type Unit = "paragraphs" | "sentences" | "words";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde",
  "omnis", "iste", "natus", "error", "voluptatem", "accusantium", "doloremque",
  "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo",
  "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta",
  "explicabo", "nemo", "ipsam", "quia", "voluptas", "aspernatur", "aut", "odit",
  "fugit", "consequuntur", "magni", "dolores", "eos", "ratione", "sequi", "nesciunt",
  "neque", "porro", "quisquam", "dolorem", "adipisci", "numquam", "eius", "modi",
  "tempora", "magnam", "quaerat", "minima", "nostrum", "exercitationem", "ullam",
  "corporis", "suscipit", "laboriosam", "nihil", "impedit", "quo", "minus", "quod",
  "maxime", "placeat", "facere", "possimus", "assumenda", "repellendus", "temporibus",
  "quibusdam", "illum", "corrupti", "vero", "recusandae", "eveniet", "voluptates",
  "deleniti", "atque", "corrupti", "quos", "quas", "molestias", "excepturi", "occaecati",
  "cupiditate", "provident", "similique", "mollitia", "animi", "sapiente", "delectus",
  "rerum", "hic", "tenetur", "soluta", "nobis", "eligendi", "optio", "cumque",
];

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function randomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function generateSentence(): string {
  const length = Math.floor(Math.random() * 10) + 8;
  const words: string[] = [];
  for (let i = 0; i < length; i++) {
    words.push(randomWord());
  }
  words[0] = capitalize(words[0]);
  return words.join(" ") + ".";
}

function generateParagraph(): string {
  const sentenceCount = Math.floor(Math.random() * 4) + 4;
  const sentences: string[] = [];
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence());
  }
  return sentences.join(" ");
}

const LOREM_OPENER = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";

export default function LoremIpsumGenerator() {
  const [unit, setUnit] = useState<Unit>("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const maxCount: Record<Unit, number> = {
    paragraphs: 20,
    sentences: 50,
    words: 500,
  };

  const generate = useCallback(() => {
    let result = "";

    if (unit === "paragraphs") {
      const paragraphs: string[] = [];
      for (let i = 0; i < count; i++) {
        let p = generateParagraph();
        if (i === 0 && startWithLorem) {
          p = LOREM_OPENER + p;
        }
        paragraphs.push(p);
      }
      result = paragraphs.join("\n\n");
    } else if (unit === "sentences") {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        if (i === 0 && startWithLorem) {
          sentences.push(LOREM_OPENER.trim());
        } else {
          sentences.push(generateSentence());
        }
      }
      result = sentences.join(" ");
    } else {
      const words: string[] = [];
      for (let i = 0; i < count; i++) {
        if (i === 0 && startWithLorem) {
          words.push("Lorem");
          if (count > 1) words.push("ipsum");
          if (count > 2) words.push("dolor");
        } else {
          words.push(randomWord());
        }
      }
      words[0] = capitalize(words[0]);
      result = words.join(" ");
    }

    setOutput(result);
  }, [unit, count, startWithLorem]);

  const wordCount = useMemo(() => (output ? output.split(/\s+/).filter(Boolean).length : 0), [output]);
  const charCount = useMemo(() => output.length, [output]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [output]);

  const unitLabels: Record<Unit, { label: string; icon: React.ReactNode }> = {
    paragraphs: { label: "Paragraphs", icon: <AlignLeft className="w-4 h-4" /> },
    sentences: { label: "Sentences", icon: <FileText className="w-4 h-4" /> },
    words: { label: "Words", icon: <Type className="w-4 h-4" /> },
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PageHeader
        title="Lorem Ipsum Generator"
        subtitle="Generate placeholder text for your designs"
        icon={<FileText className="w-5 h-5" />}
        iconClass="bg-purple-500 text-white"
        shadowClass="shadow-[0_4px_0_0_#8B5CF6]"
      />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Settings Panel */}
        <NeoBlock shadowClass="shadow-[8px_8px_0_0_#F59E0B]" className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings2 className="w-5 h-5 text-amber-500" />
            <h3 className="font-black text-lg uppercase">Settings</h3>
          </div>

          {/* Unit Selection */}
          <div className="mb-6">
            <label className="block font-bold text-sm uppercase text-zinc-600 dark:text-zinc-400 mb-2">Generate by</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(unitLabels) as Unit[]).map((u) => (
                <button
                  key={u}
                  onClick={() => {
                    setUnit(u);
                    if (count > maxCount[u]) setCount(maxCount[u]);
                  }}
                  className={`px-4 py-2 border-2 border-zinc-900 dark:border-zinc-100 font-bold text-sm uppercase flex items-center gap-2 transition-all cursor-pointer ${
                    unit === u
                      ? "bg-purple-500 text-white shadow-[3px_3px_0_0_#18181b] dark:shadow-[3px_3px_0_0_#fafafa]"
                      : "bg-white dark:bg-zinc-800 hover:bg-purple-100 dark:hover:bg-zinc-700"
                  }`}
                >
                  {unitLabels[u].icon}
                  {unitLabels[u].label}
                </button>
              ))}
            </div>
          </div>

          {/* Count Slider */}
          <div className="mb-6">
            <label className="block font-bold text-sm uppercase text-zinc-600 dark:text-zinc-400 mb-2">
              Count: <span className="text-zinc-900 dark:text-zinc-50">{count}</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={maxCount[unit]}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-700 appearance-none cursor-pointer border-2 border-zinc-900 dark:border-zinc-100 accent-purple-500"
              />
              <input
                type="number"
                min={1}
                max={maxCount[unit]}
                value={count}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (v >= 1 && v <= maxCount[unit]) setCount(v);
                }}
                className="w-20 px-3 py-2 border-2 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-800 font-bold text-center text-zinc-900 dark:text-zinc-50 focus:outline-none"
              />
            </div>
          </div>

          {/* Lorem Toggle */}
          <div className="mb-6">
            <button
              onClick={() => setStartWithLorem(!startWithLorem)}
              className={`flex items-center gap-3 px-4 py-3 border-2 border-zinc-900 dark:border-zinc-100 font-bold text-sm uppercase w-full transition-all cursor-pointer ${
                startWithLorem
                  ? "bg-emerald-500 text-zinc-900 shadow-[3px_3px_0_0_#18181b] dark:shadow-[3px_3px_0_0_#fafafa]"
                  : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              }`}
            >
              <span className={`w-6 h-6 border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center ${startWithLorem ? "bg-white text-zinc-900" : "bg-transparent"}`}>
                {startWithLorem && <Check className="w-4 h-4" />}
              </span>
              Start with &quot;Lorem ipsum dolor sit amet...&quot;
            </button>
          </div>

          {/* Generate Button */}
          <NeoButton onClick={generate} variant="primary" className="w-full py-4 text-lg">
            <RefreshCw className="w-5 h-5" />
            Generate {unitLabels[unit].label}
          </NeoButton>
        </NeoBlock>

        {/* Output */}
        {output && (
          <NeoBlock shadowClass="shadow-[8px_8px_0_0_#8B5CF6]" className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-lg uppercase">Output</h3>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-500 uppercase">
                  {wordCount} words / {charCount} chars
                </span>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-2 border-2 border-zinc-900 dark:border-zinc-100 font-bold text-sm uppercase transition-all cursor-pointer shadow-[3px_3px_0_0_#18181b] dark:shadow-[3px_3px_0_0_#fafafa] hover:-translate-y-1 hover:shadow-[5px_5px_0_0_#18181b] dark:hover:shadow-[5px_5px_0_0_#fafafa] active:translate-y-1 active:shadow-none ${
                    copied ? "bg-emerald-500 text-zinc-900" : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 p-4 md:p-6">
              {unit === "paragraphs" ? (
                <div className="space-y-4">
                  {output.split("\n\n").map((p, i) => (
                    <p key={i} className="text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
                  {output}
                </p>
              )}
            </div>
          </NeoBlock>
        )}
      </main>
    </div>
  );
}
