"use client";

import { useState } from "react";

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
      case "+":
        return first + second;
      case "-":
        return first - second;
      case "*":
        return first * second;
      case "/":
        return second !== 0 ? first / second : 0;
      case "^":
        return Math.pow(first, second);
      case "%":
        return first % second;
      default:
        return second;
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
      case "sin":
        result = Math.sin(value * Math.PI / 180);
        break;
      case "cos":
        result = Math.cos(value * Math.PI / 180);
        break;
      case "tan":
        result = Math.tan(value * Math.PI / 180);
        break;
      case "log":
        result = Math.log10(value);
        break;
      case "ln":
        result = Math.log(value);
        break;
      case "sqrt":
        result = Math.sqrt(value);
        break;
      case "square":
        result = value * value;
        break;
      case "fact":
        result = factorial(Math.floor(value));
        break;
      default:
        result = value;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-zinc-800">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold dark:text-white">Calculator 🧮</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Basic & Scientific</p>
            </div>
            <a
              href="/"
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
            >
              ← Back to Portfolio
            </a>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="p-1 bg-zinc-200 dark:bg-zinc-700 rounded-lg flex gap-2">
            <button
              onClick={() => setMode("basic")}
              className={`px-6 py-2 rounded-md font-medium transition ${
                mode === "basic"
                  ? "bg-white dark:bg-zinc-600 shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-600"
              }`}
            >
              Basic
            </button>
            <button
              onClick={() => setMode("scientific")}
              className={`px-6 py-2 rounded-md font-medium transition ${
                mode === "scientific"
                  ? "bg-white dark:bg-zinc-600 shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-600"
              }`}
            >
              Scientific
            </button>
          </div>
        </div>

        {/* Display */}
        <div className="bg-zinc-900 dark:bg-black rounded-2xl shadow-lg p-6 mb-6">
          <div className="text-right">
            <div className="text-zinc-400 dark:text-zinc-500 text-sm mb-1">
              {previousValue && operation ? `${previousValue} ${operation}` : " "}
            </div>
            <div className="text-4xl font-mono text-white dark:text-zinc-100">
              {formatDisplay(display)}
            </div>
          </div>
        </div>

        {/* Basic Buttons */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "C", action: handleClear, className: "bg-red-500 hover:bg-red-600 text-white" },
            { label: "±", action: () => setDisplay(String(-parseFloat(display))), className: "bg-zinc-500 hover:bg-zinc-600 text-white" },
            { label: "%", action: () => handleOperation("%"), className: "bg-zinc-500 hover:bg-zinc-600 text-white" },
            { label: "÷", action: () => handleOperation("/"), className: "bg-orange-500 hover:bg-orange-600 text-white" },
          ].map((btn) => (
            <button
              key={btn.label}
              onClick={() => "action" in btn ? (btn.action as () => void)() : null}
              className={`p-4 rounded-xl text-xl font-bold transition ${btn.className}`}
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
              className="p-4 rounded-xl text-xl font-bold bg-white dark:bg-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-600 transition shadow-sm"
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
              className="p-4 rounded-xl text-xl font-bold bg-white dark:bg-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-600 transition shadow-sm"
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
              className="p-4 rounded-xl text-xl font-bold bg-white dark:bg-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-600 transition shadow-sm"
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
              className={`p-4 rounded-xl text-xl font-bold bg-white dark:bg-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-600 transition shadow-sm ${
                label === "=" ? "bg-blue-500 hover:bg-blue-600 text-white col-span-2" : ""
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Scientific Buttons */}
        {mode === "scientific" && (
          <div className="grid grid-cols-5 gap-3 mb-6">
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
                className="p-4 rounded-xl text-lg font-bold bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800 transition"
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}

        {/* Instructions */}
        <div className="p-6 bg-white/80 dark:bg-zinc-800/80 rounded-xl">
          <h2 className="font-semibold mb-3 dark:text-white">Features</h2>
          <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>• Basic: Add, subtract, multiply, divide, modulo</li>
            <li>• Scientific: Trig functions, logarithms, square root, factorial</li>
            <li>• Switch between Basic and Scientific modes</li>
            <li>• Keyboard support: Type digits and operators</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
