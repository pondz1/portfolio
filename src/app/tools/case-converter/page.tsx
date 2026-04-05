"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { NeoBlock } from "@/components/ui/NeoBlock";
import { NeoButton } from "@/components/ui/NeoButton";
import { CaseSensitive, Copy, Check, Trash2, ClipboardPaste } from "lucide-react";

type CaseType = "upper" | "lower" | "title" | "sentence" | "toggle" | "camel" | "snake" | "kebab" | "dot";

interface CaseOption {
  id: CaseType;
  label: string;
  example: string;
}

const CASE_OPTIONS: CaseOption[] = [
  { id: "upper", label: "UPPERCASE", example: "HELLO WORLD" },
  { id: "lower", label: "lowercase", example: "hello world" },
  { id: "title", label: "Title Case", example: "Hello World" },
  { id: "sentence", label: "Sentence case", example: "Hello world" },
  { id: "toggle", label: "tOGGLE cASE", example: "hELLO wORLD" },
  { id: "camel", label: "camelCase", example: "helloWorld" },
  { id: "snake", label: "snake_case", example: "hello_world" },
  { id: "kebab", label: "kebab-case", example: "hello-world" },
  { id: "dot", label: "dot.case", example: "hello.world" },
];

function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
}

function toSentenceCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
}

function toToggleCase(str: string): string {
  return str
    .split("")
    .map((char) =>
      char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
    )
    .join("");
}

function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s\-\.]+/g, "_")
    .toLowerCase();
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s\.\_]+/g, "-")
    .toLowerCase();
}

function toDotCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1.$2")
    .replace(/[\s\-\_]+/g, ".")
    .toLowerCase();
}

function convertCase(text: string, caseType: CaseType): string {
  switch (caseType) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return toTitleCase(text);
    case "sentence":
      return toSentenceCase(text);
    case "toggle":
      return toToggleCase(text);
    case "camel":
      return toCamelCase(text);
    case "snake":
      return toSnakeCase(text);
    case "kebab":
      return toKebabCase(text);
    case "dot":
      return toDotCase(text);
    default:
      return text;
  }
}

export default function CaseConverter() {
  const [input, setInput] = useState("");
  const [activeCase, setActiveCase] = useState<CaseType>("upper");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<{ input: string; output: string; type: string }[]>([]);

  const output = input ? convertCase(input, activeCase) : "";

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch {
      // Clipboard API not available
    }
  };

  const handleClear = () => {
    setInput("");
  };

  const handleConvertAndSave = (caseType: CaseType) => {
    setActiveCase(caseType);
    if (input) {
      const result = convertCase(input, caseType);
      const caseLabel = CASE_OPTIONS.find(c => c.id === caseType)?.label || caseType;
      setHistory(prev => [{ input: input.slice(0, 30), output: result.slice(0, 30), type: caseLabel }, ...prev.slice(0, 9)]);
    }
  };

  const stats = {
    characters: input.length,
    words: input.trim() === "" ? 0 : input.trim().split(/\s+/).length,
    lines: input.split("\n").length,
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Case Converter"
          subtitle="Transform text between different cases"
          icon={<CaseSensitive className="w-5 h-5" />}
          iconClass="bg-violet-600 text-white"
          shadowClass="shadow-[0_4px_0_0_#7C3AED]"
        />

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input */}
            <NeoBlock shadowClass="shadow-[8px_8px_0_0_#7C3AED]" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black uppercase text-zinc-900 dark:text-zinc-50">
                  Input Text
                </h2>
                <div className="flex gap-2">
                  <NeoButton
                    onClick={handlePaste}
                    variant="secondary"
                    className="py-2 px-3 text-sm flex items-center gap-2"
                  >
                    <ClipboardPaste className="w-4 h-4" />
                    Paste
                  </NeoButton>
                  <NeoButton
                    onClick={handleClear}
                    variant="danger"
                    className="py-2 px-3 text-sm flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </NeoButton>
                </div>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type or paste your text here..."
                className="w-full h-40 p-4 font-mono text-base border-2 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 resize-none focus:outline-none focus:border-violet-500 dark:focus:border-violet-400"
              />

              {/* Stats */}
              <div className="flex gap-4 mt-4">
                <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
                  {stats.characters} chars
                </span>
                <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
                  {stats.words} words
                </span>
                <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
                  {stats.lines} lines
                </span>
              </div>
            </NeoBlock>

            {/* Case Selection Grid */}
            <NeoBlock shadowClass="shadow-[6px_6px_0_0_#8B5CF6]" className="p-6">
              <h2 className="text-xl font-black uppercase text-zinc-900 dark:text-zinc-50 mb-4">
                Choose Case
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                {CASE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleConvertAndSave(opt.id)}
                    className={`p-3 border-2 border-zinc-900 dark:border-zinc-100 font-bold text-sm text-left transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#7C3AED] active:translate-y-0 active:shadow-none cursor-pointer ${
                      activeCase === opt.id
                        ? "bg-violet-600 text-white shadow-[4px_4px_0_0_#7C3AED]"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-[2px_2px_0_0_#18181b] dark:shadow-[2px_2px_0_0_#fafafa]"
                    }`}
                  >
                    <div className="font-black text-base">{opt.label}</div>
                    <div className={`text-xs mt-1 ${activeCase === opt.id ? "text-violet-200" : "text-zinc-500 dark:text-zinc-400"}`}>
                      {opt.example}
                    </div>
                  </button>
                ))}
              </div>
            </NeoBlock>

            {/* Output */}
            <NeoBlock shadowClass="shadow-[8px_8px_0_0_#10B981]" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black uppercase text-zinc-900 dark:text-zinc-50">
                  Result
                </h2>
                <NeoButton
                  onClick={handleCopy}
                  variant="success"
                  className="py-2 px-4 text-sm flex items-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy"}
                </NeoButton>
              </div>
              <div className="w-full min-h-[100px] p-4 font-mono text-base border-2 border-zinc-900 dark:border-zinc-100 bg-emerald-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 whitespace-pre-wrap break-words">
                {output || <span className="text-zinc-400 italic">Converted text will appear here...</span>}
              </div>
            </NeoBlock>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Preview */}
            <NeoBlock shadowClass="shadow-[6px_6px_0_0_#A855F7]" className="p-6">
              <h3 className="text-lg font-black uppercase text-zinc-900 dark:text-zinc-50 mb-4">
                Quick Preview
              </h3>
              {input ? (
                <div className="space-y-3">
                  {CASE_OPTIONS.slice(0, 5).map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleConvertAndSave(opt.id)}
                      className="w-full text-left p-3 border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800 hover:bg-violet-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                    >
                      <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-1">
                        {opt.label}
                      </p>
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">
                        {convertCase(input, opt.id)}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-bold text-zinc-400 italic">
                  Enter text to see previews
                </p>
              )}
            </NeoBlock>

            {/* History */}
            {history.length > 0 && (
              <NeoBlock shadowClass="shadow-[6px_6px_0_0_#EC4899]" className="p-6">
                <h3 className="text-lg font-black uppercase text-zinc-900 dark:text-zinc-50 mb-4">
                  Recent
                </h3>
                <div className="space-y-2">
                  {history.map((item, i) => (
                    <div
                      key={i}
                      className="p-3 border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800"
                    >
                      <p className="text-xs font-bold text-pink-600 uppercase mb-1">{item.type}</p>
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">
                        {item.output}
                      </p>
                    </div>
                  ))}
                </div>
              </NeoBlock>
            )}

            {/* Info */}
            <NeoBlock shadowClass="shadow-[4px_4px_0_0_#18181b] dark:shadow-[4px_4px_0_0_#fafafa]" className="p-6">
              <h3 className="text-lg font-black uppercase text-zinc-900 dark:text-zinc-50 mb-3">
                Supported Cases
              </h3>
              <div className="space-y-2 text-sm font-bold text-zinc-600 dark:text-zinc-400">
                <p><span className="text-violet-600">Basic:</span> upper, lower, title, sentence, toggle</p>
                <p><span className="text-emerald-600">Dev:</span> camelCase, snake_case, kebab-case, dot.case</p>
              </div>
            </NeoBlock>
          </div>
        </div>
      </div>
    </div>
  );
}
