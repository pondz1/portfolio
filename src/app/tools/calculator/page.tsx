"use client";

import { useState } from "react";
import Link from "next/link";
import { MoveLeft, Calculator as CalcIcon } from "lucide-react";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [mode, setMode] = useState<"basic" | "scientific">("basic");

  function handleDigit(digit: string): void {
    if (waitingForNewValue) {
      setDisplay(digit);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  }

  function handleDecimal(): void {
    if (waitingForNewValue) {
      setDisplay("0.");
      setWaitingForNewValue(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  }

  function handleOperation(nextOperation: string): void {
    const value = parseFloat(display);

    if (operation && !waitingForNewValue) {
      const result = calculate(parseFloat(previousValue!), value, operation);
      setDisplay(String(result));
      setPreviousValue(String(result));
    } else {
      setPreviousValue(display);
    }

    setOperation(nextOperation);
    setWaitingForNewValue(true);
  }

  function calculate(first: number, second: number, op: string): number {
    switch (op) {
      case "+": return first + second;
      case "-": return first - second;
      case "*": return first * second;
      case "/": return second !== 0 ? first / second : 0;
      case "^": return Math.pow(first, second);
      case "%": return first % second;
      default: return second;
    }
  }

  function handleEqual(): void {
    const value = parseFloat(display);

    if (!operation || !previousValue) return;

    const result = calculate(parseFloat(previousValue), value, operation);
    setDisplay(String(result));
    setOperation(null);
    setPreviousValue(null);
    setWaitingForNewValue(true);
  }

  function handleClear(): void {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  }

  function handleScientific(func: string): void {
    const value = parseFloat(display);
    let result: number;

    switch (func) {
      case "sin": result = Math.sin(value * Math.PI / 180); break;
      case "cos": result = Math.cos(value * Math.PI / 180); break;
      case "tan": result = Math.tan(value * Math.PI / 180); break;
      case "log": result = Math.log10(value); break;
      case "ln": result = Math.log(value); break;
      case "sqrt": result = Math.sqrt(value); break;
      case "square": result = value * value; break;
      case "fact": result = factorial(Math.floor(value)); break;
      default: result = value;
    }

    setDisplay(String(result));
  }

  function factorial(n: number): number {
    if (n < 0) return 0;
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
  }

  function formatDisplay(value: string): string {
    if (value.length > 12) {
      return value.substring(0, 12) + "...";
    }
    return value;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-12">
      {/* Header */}
      <header className="border-b-4 border-zinc-900 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-10 shadow-[0_4px_0_0_#059669]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center text-zinc-900 shadow-[2px_2px_0_0_#18181b] dark:shadow-[2px_2px_0_0_#fafafa]">
                <CalcIcon className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight dark:text-zinc-50">Calculator</h1>
                <p className="text-xs md:text-sm font-bold text-zinc-600 dark:text-zinc-400">BASIC & SCIENTIFIC</p>
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

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-2xl">
        <div className="bg-white dark:bg-zinc-900 border-4 border-zinc-900 dark:border-zinc-100 shadow-[12px_12px_0_0_#059669] p-6 md:p-8">
          
          {/* Mode Toggle */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-100 shadow-[inset_4px_4px_0_0_rgba(0,0,0,0.1)] dark:shadow-[inset_4px_4px_0_0_rgba(255,255,255,0.1)] p-1">
              <button
                onClick={() => setMode("basic")}
                className={`px-8 py-3 font-bold uppercase tracking-wider text-sm transition-all border-2 ${
                  mode === "basic"
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border-zinc-900 dark:border-zinc-100 shadow-[2px_2px_0_0_#18181b] dark:shadow-[2px_2px_0_0_#fafafa]"
                    : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                Basic
              </button>
              <button
                onClick={() => setMode("scientific")}
                className={`px-8 py-3 font-bold uppercase tracking-wider text-sm transition-all border-2 ${
                  mode === "scientific"
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border-zinc-900 dark:border-zinc-100 shadow-[2px_2px_0_0_#18181b] dark:shadow-[2px_2px_0_0_#fafafa]"
                    : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                Scientific
              </button>
            </div>
          </div>

          {/* Display */}
          <div className="bg-zinc-900 dark:bg-black border-4 border-zinc-900 dark:border-zinc-100 shadow-[inset_4px_4px_0_0_rgba(255,255,255,0.1)] dark:shadow-[inset_4px_4px_0_0_rgba(255,255,255,0.2)] p-6 mb-8 text-right overflow-hidden relative">
            <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <div className="text-zinc-400 dark:text-zinc-500 font-bold mb-2 min-h-[1.5rem] uppercase tracking-widest text-sm">
              {previousValue && operation ? `${previousValue} ${operation}` : " "}
            </div>
            <div className="text-5xl md:text-6xl font-black text-emerald-400 tracking-tighter drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] whitespace-nowrap">
              {formatDisplay(display)}
            </div>
          </div>

          {/* Scientific Buttons */}
          {mode === "scientific" && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mb-4">
              {[
                { label: "sin", func: "sin" },
                { label: "cos", func: "cos" },
                { label: "tan", func: "tan" },
                { label: "log", func: "log" },
                { label: "ln", func: "ln" },
                { label: "√", func: "sqrt" },
                { label: "x²", func: "square" },
                { label: "x!", func: "fact" },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => handleScientific(btn.func)}
                  className="p-3 border-2 border-zinc-900 dark:border-zinc-100 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-black text-sm hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#18181b] dark:hover:shadow-[4px_4px_0_0_#fafafa] active:translate-y-0 active:shadow-none transition-all cursor-pointer uppercase"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}

          {/* Basic Buttons */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "C", action: handleClear, className: "bg-rose-500 text-zinc-900 hover:bg-rose-400" },
              { label: "±", action: () => setDisplay(String(-parseFloat(display))), className: "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600" },
              { label: "%", action: () => handleOperation("%"), className: "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600" },
              { label: "÷", action: () => handleOperation("/"), className: "bg-amber-400 text-zinc-900 hover:bg-amber-300" },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => "action" in btn ? (btn.action as () => void)() : null}
                className={`p-4 md:p-5 border-2 border-zinc-900 dark:border-zinc-100 text-xl font-black shadow-[4px_4px_0_0_#18181b] dark:shadow-[4px_4px_0_0_#fafafa] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[6px_6px_0_0_#18181b] dark:hover:shadow-[6px_6px_0_0_#fafafa] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer ${btn.className}`}
              >
                {btn.label}
              </button>
            ))}
            
            {["7", "8", "9", "×"].map((label) => (
              <button
                key={label}
                onClick={() => {
                  if (label === "×") handleOperation("*");
                  else handleDigit(label);
                }}
                className={`p-4 md:p-5 border-2 border-zinc-900 dark:border-zinc-100 text-2xl font-black shadow-[4px_4px_0_0_#18181b] dark:shadow-[4px_4px_0_0_#fafafa] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[6px_6px_0_0_#18181b] dark:hover:shadow-[6px_6px_0_0_#fafafa] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer ${
                  label === "×" ? "bg-amber-400 text-zinc-900 hover:bg-amber-300" : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                }`}
              >
                {label}
              </button>
            ))}

            {["4", "5", "6", "-"].map((label) => (
              <button
                key={label}
                onClick={() => {
                  if (label === "-") handleOperation("-");
                  else handleDigit(label);
                }}
                className={`p-4 md:p-5 border-2 border-zinc-900 dark:border-zinc-100 text-2xl font-black shadow-[4px_4px_0_0_#18181b] dark:shadow-[4px_4px_0_0_#fafafa] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[6px_6px_0_0_#18181b] dark:hover:shadow-[6px_6px_0_0_#fafafa] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer ${
                  label === "-" ? "bg-amber-400 text-zinc-900 hover:bg-amber-300" : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                }`}
              >
                {label}
              </button>
            ))}

            {["1", "2", "3", "+"].map((label) => (
              <button
                key={label}
                onClick={() => {
                  if (label === "+") handleOperation("+");
                  else handleDigit(label);
                }}
                className={`p-4 md:p-5 border-2 border-zinc-900 dark:border-zinc-100 text-2xl font-black shadow-[4px_4px_0_0_#18181b] dark:shadow-[4px_4px_0_0_#fafafa] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[6px_6px_0_0_#18181b] dark:hover:shadow-[6px_6px_0_0_#fafafa] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer ${
                  label === "+" ? "bg-amber-400 text-zinc-900 hover:bg-amber-300" : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                }`}
              >
                {label}
              </button>
            ))}

            {["0", ".", "="].map((label) => (
              <button
                key={label}
                onClick={() => {
                  if (label === ".") handleDecimal();
                  else if (label === "0") handleDigit("0");
                  else handleEqual();
                }}
                className={`p-4 md:p-5 border-2 border-zinc-900 dark:border-zinc-100 text-2xl font-black shadow-[4px_4px_0_0_#18181b] dark:shadow-[4px_4px_0_0_#fafafa] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[6px_6px_0_0_#18181b] dark:hover:shadow-[6px_6px_0_0_#fafafa] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer ${
                  label === "=" 
                    ? "bg-blue-600 text-white hover:bg-blue-500 col-span-2" 
                    : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-zinc-100 dark:bg-zinc-900 border-4 border-zinc-900 dark:border-zinc-100 shadow-[6px_6px_0_0_#18181b] dark:shadow-[6px_6px_0_0_#fafafa]">
          <h2 className="text-xl font-black mb-4 dark:text-zinc-50 uppercase">Features</h2>
          <ul className="space-y-3 font-bold text-zinc-700 dark:text-zinc-400">
            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-blue-600"></div> Basic math operations</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-rose-600"></div> Scientific trigonometric options</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-emerald-600"></div> Supports mode toggling</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
