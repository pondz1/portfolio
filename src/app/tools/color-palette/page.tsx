"use client";

import { useState } from "react";

export default function ColorPalette() {
  const [baseColor, setBaseColor] = useState("#3B82F6");
  const [palettes, setPalettes] = useState<string[][]>([
    generatePalette("#3B82F6"),
    generatePalette("#10B981"),
    generatePalette("#F59E0B"),
    generatePalette("#EF4444"),
  ]);

  function generatePalette(hex: string): string[] {
    const rgb = hexToRgb(hex);
    const colors: string[] = [];
    for (let i = 0; i < 5; i++) {
      const factor = 0.5 + (i * 0.125);
      const newRgb = rgb.map((c) => Math.round(Math.min(255, c * factor)));
      colors.push(rgbToHex(newRgb[0], newRgb[1], newRgb[2]));
    }
    return colors;
  }

  function hexToRgb(hex: string): number[] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : [0, 0, 0];
  }

  function rgbToHex(r: number, g: number, b: number): string {
    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
  }

  function hexToHsl(hex: string): string {
    const [r, g, b] = hexToRgb(hex).map((x) => x / 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  }

  function getContrastColor(hex: string): string {
    const [r, g, b] = hexToRgb(hex);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#1F2937" : "#FFFFFF";
  }

  function copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
  }

  function generateNewPalette(): void {
    const randomColor = "#" +
      Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    const newPalette = generatePalette(randomColor);
    setBaseColor(randomColor);
    setPalettes([newPalette, ...palettes]);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold dark:text-white">Color Palette Generator</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Create beautiful color palettes</p>
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

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Generator */}
        <div className="mb-8 p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Base Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={baseColor}
                  onChange={(e) => {
                    setBaseColor(e.target.value);
                    setPalettes([generatePalette(e.target.value), ...palettes]);
                  }}
                  className="w-16 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={baseColor}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                      setBaseColor(val);
                      setPalettes([generatePalette(val), ...palettes]);
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-700 dark:text-white"
                />
              </div>
            </div>
            <button
              onClick={generateNewPalette}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Generate Random Palette
            </button>
          </div>
        </div>

        {/* Palettes */}
        <div className="grid md:grid-cols-2 gap-6">
          {palettes.map((palette, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="flex h-64">
                {palette.map((color, colorIdx) => (
                  <div
                    key={colorIdx}
                    className="flex-1 flex items-end justify-center pb-4 cursor-pointer hover:opacity-90 transition group relative"
                    style={{ backgroundColor: color }}
                    onClick={() => copyToClipboard(color)}
                  >
                    <div className={`text-sm font-medium ${idx === 0 ? "animate-pulse" : ""}`} style={{ color: getContrastColor(color) }}>
                      {color}
                    </div>
                    {colorIdx < palette.length - 1 && (
                      <div
                        className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-r from-transparent to-black/10"
                      ></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-zinc-200 dark:border-zinc-700">
                <div className="flex gap-2">
                  {palette.map((color) => (
                    <div
                      key={color}
                      className="flex-1 text-center"
                      onClick={() => copyToClipboard(color)}
                    >
                      <div
                        className="w-full h-8 rounded mb-1 cursor-pointer hover:scale-105 transition"
                        style={{ backgroundColor: color }}
                      ></div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                        {hexToHsl(color)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="mt-8 p-6 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
          <h2 className="font-semibold mb-3 dark:text-white">How it works</h2>
          <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>• Click any color to copy its hex code</li>
            <li>• Generate new palettes by picking a base color or using random</li>
            <li>• Each palette is a 5-shade variation of the base color</li>
            <li>• Text color automatically adjusts for contrast</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
