"use client";

import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { NeoBlock } from "@/components/ui/NeoBlock";
import { NeoButton } from "@/components/ui/NeoButton";
import { QrCode, Copy, Download, Link2, Mail, Phone, Text } from "lucide-react";

type InputMode = "text" | "url" | "email" | "phone";

export default function QrGenerator() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<InputMode>("text");
  const [size, setSize] = useState(256);
  const [qrUrl, setQrUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const modes: { key: InputMode; label: string; icon: React.ReactNode; placeholder: string }[] = [
    { key: "text", label: "Text", icon: <Text className="w-4 h-4" />, placeholder: "Enter any text..." },
    { key: "url", label: "URL", icon: <Link2 className="w-4 h-4" />, placeholder: "https://example.com" },
    { key: "email", label: "Email", icon: <Mail className="w-4 h-4" />, placeholder: "hello@example.com" },
    { key: "phone", label: "Phone", icon: <Phone className="w-4 h-4" />, placeholder: "+1234567890" },
  ];

  useEffect(() => {
    if (!input.trim()) {
      setQrUrl("");
      setError("");
      return;
    }

    let data = input.trim();
    if (mode === "email" && !data.startsWith("mailto:")) {
      data = `mailto:${data}`;
    } else if (mode === "phone" && !data.startsWith("tel:")) {
      data = `tel:${data}`;
    } else if (mode === "url") {
      if (!/^https?:\/\//i.test(data)) {
        data = `https://${data}`;
      }
    }

    const encoded = encodeURIComponent(data);
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&format=png&margin=10`;
    setQrUrl(url);
    setError("");
  }, [input, mode, size]);

  const downloadQr = async () => {
    if (!qrUrl) return;
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qr-code-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setError("Download failed. Try right-clicking the image instead.");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(input.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentMode = modes.find((m) => m.key === mode)!;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PageHeader
        title="QR Code Generator"
        subtitle="Create scannable QR codes"
        icon={<QrCode className="w-5 h-5" />}
        iconClass="bg-purple-500 text-white"
        shadowClass="shadow-[0_4px_0_0_#A855F7]"
        backLink="/tools"
        backText="Tools"
      />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="space-y-6">
            {/* Mode Selector */}
            <NeoBlock shadowClass="shadow-[6px_6px_0_0_#3B82F6]">
              <h2 className="text-sm font-black uppercase text-zinc-500 dark:text-zinc-400 mb-3 tracking-widest">
                Input Type
              </h2>
              <div className="grid grid-cols-4 gap-2">
                {modes.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => { setMode(m.key); setInput(""); }}
                    className={`flex flex-col items-center gap-1 p-3 border-2 font-black text-xs uppercase transition-all cursor-pointer ${
                      mode === m.key
                        ? "border-zinc-900 dark:border-zinc-100 bg-blue-600 text-white shadow-[3px_3px_0_0_#18181b] dark:shadow-[3px_3px_0_0_#fafafa] translate-x-[3px] -translate-y-[3px]"
                        : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-900 dark:hover:border-zinc-100"
                    }`}
                  >
                    {m.icon}
                    {m.label}
                  </button>
                ))}
              </div>
            </NeoBlock>

            {/* Text Input */}
            <NeoBlock shadowClass="shadow-[6px_6px_0_0_#10B981]">
              <h2 className="text-sm font-black uppercase text-zinc-500 dark:text-zinc-400 mb-3 tracking-widest">
                Content
              </h2>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={currentMode.placeholder}
                rows={4}
                className="w-full border-4 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-800 p-3 font-bold text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:translate-x-[2px] focus:-translate-y-[2px] focus:shadow-[4px_4px_0_0_#3B82F6] transition-all resize-none"
              />
              <div className="flex justify-between items-center mt-3">
                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                  {input.length} characters
                </p>
                {input.trim() && (
                  <button
                    onClick={copyLink}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                )}
              </div>
            </NeoBlock>

            {/* Size Selector */}
            <NeoBlock shadowClass="shadow-[6px_6px_0_0_#F59E0B]">
              <h2 className="text-sm font-black uppercase text-zinc-500 dark:text-zinc-400 mb-3 tracking-widest">
                Size
              </h2>
              <div className="flex gap-2">
                {[128, 256, 512].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`flex-1 py-2 border-2 font-black text-sm uppercase transition-all cursor-pointer ${
                      size === s
                        ? "border-zinc-900 dark:border-zinc-100 bg-amber-400 text-zinc-900 shadow-[3px_3px_0_0_#18181b] dark:shadow-[3px_3px_0_0_#fafafa] translate-x-[3px] -translate-y-[3px]"
                        : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-900 dark:hover:border-zinc-100"
                    }`}
                  >
                    {s}px
                  </button>
                ))}
              </div>
            </NeoBlock>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <NeoBlock shadowClass="shadow-[6px_6px_0_0_#A855F7]">
              <h2 className="text-sm font-black uppercase text-zinc-500 dark:text-zinc-400 mb-4 tracking-widest">
                Preview
              </h2>
              <div className="flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 p-6" style={{ minHeight: "300px" }}>
                {qrUrl ? (
                  <img
                    src={qrUrl}
                    alt="QR Code"
                    className="max-w-full"
                    style={{ width: Math.min(size, 280), height: Math.min(size, 280) }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-zinc-400 dark:text-zinc-500">
                    <QrCode className="w-16 h-16" />
                    <p className="text-sm font-bold uppercase">Enter text to generate</p>
                  </div>
                )}
              </div>

              {error && (
                <p className="mt-3 text-sm font-bold text-rose-600">{error}</p>
              )}

              {qrUrl && (
                <div className="mt-4">
                  <NeoButton onClick={downloadQr} variant="primary" className="w-full">
                    <Download className="w-5 h-5" />
                    Download PNG
                  </NeoButton>
                </div>
              )}
            </NeoBlock>

            {/* How to use */}
            <NeoBlock shadowClass="shadow-[4px_4px_0_0_#18181b] dark:shadow-[4px_4px_0_0_#fafafa]">
              <h2 className="text-sm font-black uppercase text-zinc-500 dark:text-zinc-400 mb-3 tracking-widest">
                Tips
              </h2>
              <ul className="space-y-2 text-sm font-bold text-zinc-600 dark:text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 mt-1.5 shrink-0" />
                  URL mode auto-adds https:// if missing
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 mt-1.5 shrink-0" />
                  Email mode creates mailto: links
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 mt-1.5 shrink-0" />
                  Phone mode creates tel: links
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 mt-1.5 shrink-0" />
                  Larger sizes are better for printing
                </li>
              </ul>
            </NeoBlock>
          </div>
        </div>
      </main>
    </div>
  );
}
