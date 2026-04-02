"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { NeoBlock } from "@/components/ui/NeoBlock";
import { NeoButton } from "@/components/ui/NeoButton";
import { Braces, Copy, Check, Trash2, Download, Upload, AlertCircle } from "lucide-react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);
  const [minified, setMinified] = useState("");

  const formatJSON = () => {
    setError("");
    setOutput("");
    setMinified("");

    if (!input.trim()) {
      setError("Please paste some JSON to format");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indent);
      const mini = JSON.stringify(parsed);

      setOutput(formatted);
      setMinified(mini);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

  const minifyJSON = () => {
    if (!minified) {
      formatJSON();
      return;
    }
    navigator.clipboard.writeText(minified);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
    setMinified("");
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInput(text);
    };
    reader.readAsText(file);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch {
      // Clipboard API not available
    }
  };

  const countLines = (text: string) => (text ? text.split("\n").length : 0);
  const countChars = (text: string) => text.length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PageHeader
        title="JSON Formatter"
        subtitle="Format, minify, and validate JSON"
        icon={<Braces className="w-5 h-5" />}
        iconClass="bg-purple-600 text-white"
        shadowClass="shadow-[0_4px_0_0_#7C3AED]"
      />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400 uppercase">Indent:</span>
            {[2, 4].map((n) => (
              <NeoButton
                key={n}
                variant={indent === n ? "primary" : "secondary"}
                onClick={() => setIndent(n)}
                className="px-3 py-1 text-sm"
              >
                {n} spaces
              </NeoButton>
            ))}
          </div>
          <div className="flex gap-2">
            <NeoButton variant="secondary" onClick={handlePaste} className="px-3 py-2 text-sm">
              <Upload className="w-4 h-4" />
              Paste
            </NeoButton>
            <label className="cursor-pointer">
              <NeoButton variant="secondary" className="px-3 py-2 text-sm" onClick={() => {}}>
                <Upload className="w-4 h-4" />
                File
              </NeoButton>
              <input type="file" accept=".json,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
            <NeoButton variant="secondary" onClick={handleClear} className="px-3 py-2 text-sm">
              <Trash2 className="w-4 h-4" />
              Clear
            </NeoButton>
          </div>
        </div>

        {/* Input */}
        <NeoBlock shadowClass="shadow-[6px_6px_0_0_#7C3AED]" className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black uppercase text-zinc-500 dark:text-zinc-400">Input</h3>
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500">
              {countChars(input)} chars · {countLines(input)} lines
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste your JSON here... e.g. {"key": "value"}'
            className="w-full h-48 md:h-64 p-4 bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-600 font-mono text-sm text-zinc-900 dark:text-zinc-100 focus:border-purple-500 focus:outline-none resize-none"
            spellCheck={false}
          />
          <div className="mt-4 flex gap-3">
            <NeoButton variant="primary" onClick={formatJSON} className="flex-1">
              <Braces className="w-4 h-4" />
              Format
            </NeoButton>
            <NeoButton variant="secondary" onClick={minifyJSON} className="flex-1">
              <Braces className="w-4 h-4" />
              Minify & Copy
            </NeoButton>
          </div>
        </NeoBlock>

        {/* Error */}
        {error && (
          <NeoBlock shadowClass="shadow-[6px_6px_0_0_#E11D48]" className="mb-6 bg-rose-50 dark:bg-rose-950/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-black text-rose-700 dark:text-rose-400 uppercase text-sm mb-1">
                  Parse Error
                </p>
                <p className="font-mono text-sm text-rose-600 dark:text-rose-300">{error}</p>
              </div>
            </div>
          </NeoBlock>
        )}

        {/* Output */}
        {output && (
          <NeoBlock shadowClass="shadow-[6px_6px_0_0_#10B981]" className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-black uppercase text-zinc-500 dark:text-zinc-400">
                  Formatted Output
                </h3>
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-500 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                  Valid
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500">
                  {countChars(output)} chars · {countLines(output)} lines
                </span>
                <NeoButton
                  variant="secondary"
                  onClick={() => handleCopy(output)}
                  className="px-3 py-1 text-xs"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied!" : "Copy"}
                </NeoButton>
                <NeoButton variant="secondary" onClick={handleDownload} className="px-3 py-1 text-xs">
                  <Download className="w-3 h-3" />
                  Download
                </NeoButton>
              </div>
            </div>
            <pre className="w-full h-64 md:h-96 overflow-auto p-4 bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-600 font-mono text-sm text-zinc-900 dark:text-zinc-100">
              {output}
            </pre>
          </NeoBlock>
        )}

        {/* Tips */}
        <NeoBlock shadowClass="shadow-[6px_6px_0_0_#F59E0B]" className="bg-amber-50 dark:bg-amber-950/20">
          <h3 className="text-lg font-black uppercase mb-3 text-amber-600 dark:text-amber-400">Tips</h3>
          <ul className="space-y-2 text-sm font-bold text-zinc-700 dark:text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">-</span>
              Paste any JSON — objects, arrays, nested structures all work
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">-</span>
              Upload a .json file directly using the File button
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">-</span>
              Minify compresses JSON to a single line and copies to clipboard
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">-</span>
              Download saves the formatted output as a .json file
            </li>
          </ul>
        </NeoBlock>
      </div>
    </div>
  );
}
