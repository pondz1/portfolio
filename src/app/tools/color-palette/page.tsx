"use client";

import { useState } from "react";
import { Palette, Copy } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { NeoBlock } from "@/components/ui/NeoBlock";
import { NeoButton } from "@/components/ui/NeoButton";

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
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  }

  function getContrastColor(hex: string): string {
    const [r, g, b] = hexToRgb(hex);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#18181b" : "#fafafa";
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-12">
      <PageHeader 
        title="Color Palette" 
        subtitle="BEAUTIFUL SHADES" 
        icon={<Palette className="w-5 h-5" />} 
        iconClass="bg-amber-500 text-zinc-900" 
        shadowClass="shadow-[0_4px_0_0_#F59E0B]" 
      />

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        {/* Generator Controls */}
        <NeoBlock shadowClass="shadow-[8px_8px_0_0_#F59E0B]" className="mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-black uppercase text-zinc-900 dark:text-zinc-50 mb-2">
                Base Color Hex
              </label>
              <div className="flex items-center gap-3">
                <div className="relative border-2 border-zinc-900 dark:border-zinc-100 overflow-hidden w-14 h-14 shrink-0 shadow-[4px_4px_0_0_#18181b] dark:shadow-[4px_4px_0_0_#fafafa]">
                  <input
                    type="color"
                    value={baseColor}
                    onChange={(e) => {
                      setBaseColor(e.target.value);
                      setPalettes([generatePalette(e.target.value), ...palettes]);
                    }}
                    className="absolute -inset-2 w-[200%] h-[200%] cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  value={baseColor.toUpperCase()}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                      setBaseColor(val);
                      setPalettes([generatePalette(val), ...palettes]);
                    }
                  }}
                  className="flex-1 px-4 py-4 uppercase font-black text-xl border-4 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:border-amber-500 shadow-[inset_4px_4px_0_0_rgba(0,0,0,0.05)] dark:shadow-[inset_4px_4px_0_0_rgba(255,255,255,0.05)]"
                />
              </div>
            </div>
            <NeoButton onClick={generateNewPalette} variant="primary" className="py-4 text-lg whitespace-nowrap">
              Random Palette
            </NeoButton>
          </div>
        </NeoBlock>

        {/* Palettes Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {palettes.map((palette, idx) => (
             <NeoBlock key={idx} noPadding className="flex flex-col bg-zinc-100 dark:bg-zinc-800 border-4 shadow-[8px_8px_0_0_#18181b] dark:shadow-[8px_8px_0_0_#fafafa]">
              <div className="flex h-64 border-b-4 border-zinc-900 dark:border-zinc-100">
                {palette.map((color, colorIdx) => (
                  <div
                    key={colorIdx}
                    className="flex-1 flex flex-col items-center justify-end pb-6 cursor-pointer hover:flex-[1.5] transition-all duration-300 group border-r-2 border-zinc-900/20 last:border-r-0"
                    style={{ backgroundColor: color }}
                    onClick={() => copyToClipboard(color)}
                  >
                    <div 
                      className={`text-sm md:text-base font-black opacity-0 group-hover:opacity-100 transition-opacity rotate-[-90deg] mb-6 whitespace-nowrap tracking-wider`}
                      style={{ color: getContrastColor(color) }}
                    >
                      {color.toUpperCase()}
                    </div>
                    <Copy 
                      className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" 
                      style={{ color: getContrastColor(color) }} 
                    />
                  </div>
                ))}
              </div>
              <div className="p-4 bg-white dark:bg-zinc-900">
                <div className="flex gap-2">
                  {palette.map((color) => (
                    <div
                      key={color}
                      className="flex-1 text-center group"
                      onClick={() => copyToClipboard(color)}
                    >
                      <div
                        className="w-full h-10 border-2 border-zinc-900 dark:border-zinc-100 mb-2 cursor-pointer group-hover:-translate-y-1 transition-transform shadow-[2px_2px_0_0_#18181b] dark:shadow-[2px_2px_0_0_#fafafa]"
                        style={{ backgroundColor: color }}
                      ></div>
                      <div className="text-[10px] md:text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase truncate px-1">
                        {hexToHsl(color)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </NeoBlock>
          ))}
        </div>

        {/* Info */}
        <NeoBlock shadowClass="shadow-[6px_6px_0_0_#F59E0B]" className="mt-12 bg-zinc-100 dark:bg-zinc-900">
          <h2 className="text-xl font-black mb-4 dark:text-zinc-50 uppercase">How It Works</h2>
          <ul className="space-y-3 font-bold text-zinc-700 dark:text-zinc-400">
            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-blue-600"></div> Click any color band to copy the code.</li>
             <li className="flex items-center gap-3"><div className="w-2 h-2 bg-rose-600"></div> Automatically generates a 5-step monochromatic scale.</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-emerald-600"></div> Output includes Hex and HSL values.</li>
          </ul>
        </NeoBlock>
      </div>
    </div>
  );
}
