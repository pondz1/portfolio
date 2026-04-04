"use client";

import { useState, useMemo, useCallback } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { NeoBlock } from "@/components/ui/NeoBlock";
import { NeoButton } from "@/components/ui/NeoButton";
import { Binary, Copy, Check, RefreshCw } from "lucide-react";

const DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function convertToBase(value: bigint, base: number): string {
  const ZERO = BigInt(0);
  if (value < ZERO) return "-" + convertToBase(-value, base);
  if (value === ZERO) return "0";
  let result = "";
  let v = value;
  const baseBig = BigInt(base);
  while (v > ZERO) {
    result = DIGITS[Number(v % baseBig)] + result;
    v = v / baseBig;
  }
  return result;
}

function parseInput(input: string, base: number): bigint | null {
  if (!input.trim()) return null;
  try {
    const upper = input.toUpperCase().trim();
    for (const ch of upper) {
      const idx = DIGITS.indexOf(ch);
      if (idx === -1 || idx >= base) return null;
    }
    if (base === 10) return BigInt(upper);
    let result = BigInt(0);
    const baseBig = BigInt(base);
    for (const ch of upper) {
      result = result * baseBig + BigInt(DIGITS.indexOf(ch));
    }
    return result;
  } catch {
    return null;
  }
}

const BASE_PRESETS = [
  { name: "Binary", base: 2, color: "bg-emerald-500", icon: "01" },
  { name: "Octal", base: 8, color: "bg-blue-500", icon: "0-7" },
  { name: "Decimal", base: 10, color: "bg-amber-500", icon: "0-9" },
  { name: "Hex", base: 16, color: "bg-purple-500", icon: "0-F" },
];

function BitVisualization({ binary }: { binary: string }) {
  const bits = binary.replace(/[^01]/g, "");
  // Pad to nearest 8
  const padded = bits.padStart(Math.ceil(bits.length / 8) * 8, "0");
  const groups: string[] = [];
  for (let i = 0; i < padded.length; i += 8) {
    groups.push(padded.slice(i, i + 8));
  }

  return (
    <div className="mt-4">
      <h3 className="text-sm font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-3">
        Bit Visualization
      </h3>
      <div className="flex flex-wrap gap-3">
        {groups.map((group, gi) => (
          <div key={gi} className="flex flex-col items-center gap-1">
            <div className="flex gap-0.5">
              {group.split("").map((bit, bi) => (
                <div
                  key={bi}
                  className={`w-6 h-6 border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center text-xs font-black ${
                    bit === "1"
                      ? "bg-emerald-500 text-white"
                      : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {bit}
                </div>
              ))}
            </div>
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
              {gi * 8}-{gi * 8 + 7}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mt-3">
        Total bits: {bits.length} | Byte groups: {groups.length}
      </p>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className={`p-2 border-2 border-zinc-900 dark:border-zinc-100 transition-all flex items-center justify-center flex-shrink-0 cursor-pointer ${
        copied
          ? "bg-emerald-500 text-white shadow-none"
          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 shadow-[2px_2px_0_0_#18181b] dark:shadow-[2px_2px_0_0_#fafafa] hover:-translate-y-1 hover:shadow-[3px_3px_0_0_#18181b] dark:hover:shadow-[3px_3px_0_0_#fafafa] active:translate-y-1 active:shadow-none"
      }`}
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

export default function BaseConverterPage() {
  const [input, setInput] = useState("");
  const [inputBase, setInputBase] = useState(10);
  const [customBase, setCustomBase] = useState(36);

  const activeBase = inputBase === -1 ? Math.max(2, Math.min(36, customBase)) : inputBase;

  const parsedValue = useMemo(() => parseInput(input, activeBase), [input, activeBase]);

  const conversions = useMemo((): Record<number, string> | null => {
    if (parsedValue === null) return null;
    return {
      2: convertToBase(parsedValue, 2),
      8: convertToBase(parsedValue, 8),
      10: convertToBase(parsedValue, 10),
      16: convertToBase(parsedValue, 16),
      ...(inputBase === -1 ? { [activeBase]: convertToBase(parsedValue, activeBase) } : {}),
    };
  }, [parsedValue, activeBase, inputBase]);

  const handleBaseSelect = (base: number) => {
    setInputBase(base);
    if (parsedValue !== null) {
      const newVal = convertToBase(parsedValue, base);
      setInput(newVal);
    }
  };

  const handleCustomBaseChange = (val: number) => {
    setCustomBase(val);
    if (inputBase === -1 && parsedValue !== null) {
      setInput(convertToBase(parsedValue, val));
    }
  };

  const handleReset = () => {
    setInput("");
    setInputBase(10);
    setCustomBase(36);
  };

  const isError = input.trim() !== "" && parsedValue === null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PageHeader
        title="Base Converter"
        subtitle="Convert between number bases"
        icon={<Binary className="w-5 h-5" />}
        iconClass="bg-purple-600 text-white"
        shadowClass="shadow-[0_4px_0_0_#9333EA]"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Input Section */}
          <NeoBlock shadowClass="shadow-[8px_8px_0_0_#9333EA]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black uppercase tracking-tight">Input</h2>
              <NeoButton variant="secondary" onClick={handleReset} className="text-xs px-3 py-1.5">
                <RefreshCw className="w-3 h-3" />
                Reset
              </NeoButton>
            </div>

            {/* Base Selector */}
            <div className="mb-4">
              <label className="text-sm font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-2">
                Input Base
              </label>
              <div className="flex flex-wrap gap-2">
                {BASE_PRESETS.map((preset) => (
                  <button
                    key={preset.base}
                    onClick={() => handleBaseSelect(preset.base)}
                    className={`px-4 py-2 border-2 border-zinc-900 dark:border-zinc-100 font-black text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                      inputBase === preset.base
                        ? `${preset.color} text-white shadow-[3px_3px_0_0_#18181b] dark:shadow-[3px_3px_0_0_#fafafa]`
                        : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-[2px_2px_0_0_#18181b] dark:shadow-[2px_2px_0_0_#fafafa] hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#18181b] dark:hover:shadow-[4px_4px_0_0_#fafafa] active:translate-y-1 active:shadow-none"
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
                <button
                  onClick={() => {
                    if (inputBase !== -1 && parsedValue !== null) {
                      setInput(convertToBase(parsedValue, customBase));
                    }
                    setInputBase(-1);
                  }}
                  className={`px-4 py-2 border-2 border-zinc-900 dark:border-zinc-100 font-black text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                    inputBase === -1
                      ? "bg-rose-500 text-white shadow-[3px_3px_0_0_#18181b] dark:shadow-[3px_3px_0_0_#fafafa]"
                      : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-[2px_2px_0_0_#18181b] dark:shadow-[2px_2px_0_0_#fafafa] hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#18181b] dark:hover:shadow-[4px_4px_0_0_#fafafa] active:translate-y-1 active:shadow-none"
                  }`}
                >
                  Custom
                </button>
              </div>
            </div>

            {/* Custom Base Input */}
            {inputBase === -1 && (
              <div className="mb-4">
                <label className="text-sm font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-2">
                  Custom Base (2-36)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={2}
                    max={36}
                    value={customBase}
                    onChange={(e) => handleCustomBaseChange(parseInt(e.target.value) || 10)}
                    className="w-24 px-4 py-2 border-2 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-black text-lg text-center shadow-[2px_2px_0_0_#18181b] dark:shadow-[2px_2px_0_0_#fafafa] focus:outline-none focus:shadow-[4px_4px_0_0_#9333EA] dark:focus:shadow-[4px_4px_0_0_#9333EA]"
                  />
                  <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
                    Digits: 0-{DIGITS[customBase - 1]}
                  </span>
                </div>
              </div>
            )}

            {/* Number Input */}
            <div>
              <label className="text-sm font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-2">
                Value (Base {activeBase})
              </label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Enter a base-${activeBase} number...`}
                className={`w-full px-4 py-3 border-2 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-black text-xl tracking-wider shadow-[2px_2px_0_0_#18181b] dark:shadow-[2px_2px_0_0_#fafafa] focus:outline-none focus:shadow-[4px_4px_0_0_#9333EA] dark:focus:shadow-[4px_4px_0_0_#9333EA] font-mono ${
                  isError ? "border-rose-500" : ""
                }`}
              />
              {isError && (
                <p className="text-sm font-bold text-rose-600 mt-1">
                  Invalid digit for base {activeBase}
                </p>
              )}
            </div>
          </NeoBlock>

          {/* Conversions */}
          {conversions && (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                {BASE_PRESETS.map((preset) => (
                  <NeoBlock
                    key={preset.base}
                    shadowClass={`shadow-[6px_6px_0_0_${
                      preset.base === 2
                        ? "#10B981"
                        : preset.base === 8
                        ? "#3B82F6"
                        : preset.base === 10
                        ? "#F59E0B"
                        : "#A855F7"
                    }]`}
                    className="flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 ${preset.color} border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center`}>
                          <span className="text-[9px] font-black text-white">{preset.icon}</span>
                        </div>
                        <span className="text-sm font-black uppercase tracking-wider">
                          {preset.name} ({preset.base})
                        </span>
                      </div>
                      <CopyButton text={conversions[preset.base]} />
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-100 px-3 py-2 font-mono font-bold text-sm text-zinc-900 dark:text-zinc-50 break-all min-h-[40px] flex items-center">
                      {conversions[preset.base]}
                    </div>
                  </NeoBlock>
                ))}

                {/* Custom base output */}
                {inputBase === -1 && (
                  <NeoBlock
                    shadowClass="shadow-[6px_6px_0_0_#EF4444]"
                    className="flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-rose-500 border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center">
                          <span className="text-[9px] font-black text-white">C</span>
                        </div>
                        <span className="text-sm font-black uppercase tracking-wider">
                          Base {activeBase}
                        </span>
                      </div>
                      <CopyButton text={conversions[activeBase] || ""} />
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-100 px-3 py-2 font-mono font-bold text-sm text-zinc-900 dark:text-zinc-50 break-all min-h-[40px] flex items-center">
                      {conversions[activeBase] || "-"}
                    </div>
                  </NeoBlock>
                )}
              </div>

              {/* Bit Visualization */}
              <NeoBlock shadowClass="shadow-[8px_8px_0_0_#10B981]">
                <BitVisualization binary={conversions[2]} />
              </NeoBlock>
            </>
          )}

          {/* Empty State */}
          {!conversions && !isError && (
            <NeoBlock shadowClass="shadow-[8px_8px_0_0_#A855F7]">
              <div className="text-center py-8">
                <Binary className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
                <p className="text-lg font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Enter a number to convert
                </p>
                <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500 mt-2">
                  Supports bases 2 through 36 with real-time conversion
                </p>
              </div>
            </NeoBlock>
          )}

          {/* Reference */}
          <NeoBlock shadowClass="shadow-[6px_6px_0_0_#6366F1]" className="text-sm">
            <h3 className="text-lg font-black uppercase tracking-wider mb-3">Base Reference</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {BASE_PRESETS.map((preset) => (
                <div key={preset.base} className="bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-100 p-3">
                  <div className={`text-xs font-black uppercase tracking-wider mb-1 ${preset.color} text-white px-2 py-0.5 inline-block`}>
                    {preset.name}
                  </div>
                  <p className="font-bold text-zinc-700 dark:text-zinc-300 text-xs mt-1">
                    {preset.base === 2 && "0, 1"}
                    {preset.base === 8 && "0-7"}
                    {preset.base === 10 && "0-9"}
                    {preset.base === 16 && "0-9, A-F"}
                  </p>
                </div>
              ))}
            </div>
          </NeoBlock>
        </div>
      </div>
    </div>
  );
}
