"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { NeoBlock } from "@/components/ui/NeoBlock";
import { NeoButton } from "@/components/ui/NeoButton";
import { FileText, Copy, Check } from "lucide-react";

const SAMPLE_MARKDOWN = `# Welcome to Markdown Preview

This is a **live markdown editor** built by Milo. Type on the left and see the rendered output on the right in real time.

## Features

- Headers (h1, h2, h3)
- **Bold text** and *italic text*
- Inline \`code snippets\`
- Code blocks with syntax highlighting
- Blockquotes for callouts
- Ordered and unordered lists
- Links to external pages

### Code Example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
console.log(greet("Milo"));
\`\`\`

### Blockquote

> This portfolio is built with Next.js and follows a neo-brutalist design philosophy. Every page uses bold borders, hard shadows, and sharp corners.

### A List of Things

1. First item
2. Second item
3. Third item

### Links

Check out the [Next.js documentation](https://nextjs.org/docs) for more info on building with Next.js.

---

*Built with care by Milo, one page at a time.*
`;

function parseMarkdown(md: string): string {
  let html = "";

  // Split into lines for processing
  const lines = md.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      const code = codeLines.join("\n").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      html += `<div class="code-block-wrapper"><div class="code-block-lang">${lang || "code"}</div><pre class="code-block"><code>${code}</code></pre></div>`;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      html += `<hr class="md-hr" />`;
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Headers
    if (line.startsWith("### ")) {
      html += `<h3 class="md-h3">${inlineFormat(line.slice(4))}</h3>`;
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      html += `<h2 class="md-h2">${inlineFormat(line.slice(3))}</h2>`;
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      html += `<h1 class="md-h1">${inlineFormat(line.slice(2))}</h1>`;
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      html += `<blockquote class="md-blockquote">${inlineFormat(quoteLines.join("<br />"))}</blockquote>`;
      continue;
    }

    // Unordered list
    if (/^[-*] /.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i].trim())) {
        items.push(inlineFormat(lines[i].trim().slice(2)));
        i++;
      }
      html += `<ul class="md-ul">${items.map((item) => `<li class="md-li">${item}</li>`).join("")}</ul>`;
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(inlineFormat(lines[i].trim().replace(/^\d+\.\s/, "")));
        i++;
      }
      html += `<ol class="md-ol">${items.map((item) => `<li class="md-li">${item}</li>`).join("")}</ol>`;
      continue;
    }

    // Regular paragraph
    html += `<p class="md-p">${inlineFormat(line)}</p>`;
    i++;
  }

  return html;
}

function inlineFormat(text: string): string {
  // Escape HTML
  let result = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Inline code (must come before bold/italic to avoid conflicts)
  result = result.replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>');

  // Bold + italic
  result = result.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");

  // Bold
  result = result.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Italic
  result = result.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Links
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a class="md-link" href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  return result;
}

export default function MarkdownPreviewPage() {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => parseMarkdown(markdown), [markdown]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = markdown;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const charCount = markdown.length;
  const wordCount = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  const lineCount = markdown.split("\n").length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PageHeader
        title="Markdown Preview"
        subtitle="Live Editor"
        icon={<FileText className="w-5 h-5" />}
        iconClass="bg-indigo-600 text-white"
        shadowClass="shadow-[0_4px_0_0_#4F46E5]"
      />

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Stats Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-4 px-4 py-2 bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-100">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">
              {wordCount} words
            </span>
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">
              {charCount} chars
            </span>
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">
              {lineCount} lines
            </span>
          </div>
          <NeoButton onClick={handleCopy} variant="secondary" className="py-2 text-xs">
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Markdown
              </>
            )}
          </NeoButton>
        </div>

        {/* Editor + Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Markdown Input */}
          <NeoBlock shadowClass="shadow-[8px_8px_0_0_#4F46E5]" noPadding className="flex flex-col">
            <div className="border-b-4 border-zinc-900 dark:border-zinc-100 px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-50">
                Markdown
              </span>
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Input</span>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="flex-1 min-h-[500px] p-4 md:p-6 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-mono text-sm leading-relaxed resize-none focus:outline-none"
              spellCheck={false}
              placeholder="Type your markdown here..."
            />
          </NeoBlock>

          {/* Preview */}
          <NeoBlock shadowClass="shadow-[8px_8px_0_0_#18181b] dark:shadow-[8px_8px_0_0_#fafafa]" noPadding className="flex flex-col">
            <div className="border-b-4 border-zinc-900 dark:border-zinc-100 px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-50">
                Preview
              </span>
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Rendered</span>
            </div>
            <div
              className="flex-1 min-h-[500px] p-4 md:p-6 prose-neo overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </NeoBlock>
        </div>
      </main>

      {/* Markdown preview styles */}
      <style jsx global>{`
        .prose-neo {
          font-family: "Space Grotesk", sans-serif;
          color: #18181b;
          line-height: 1.7;
        }

        :is(.dark .prose-neo) {
          color: #fafafa;
        }

        .prose-neo .md-h1 {
          font-size: 1.875rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -0.025em;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 4px solid #18181b;
        }

        :is(.dark .prose-neo .md-h1) {
          border-bottom-color: #fafafa;
        }

        .prose-neo .md-h2 {
          font-size: 1.375rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -0.025em;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.375rem;
          border-bottom: 2px solid #27272a;
        }

        :is(.dark .prose-neo .md-h2) {
          border-bottom-color: #d4d4d8;
        }

        .prose-neo .md-h3 {
          font-size: 1.125rem;
          font-weight: 800;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }

        .prose-neo .md-p {
          margin-bottom: 0.75rem;
          font-weight: 500;
        }

        .prose-neo .md-ul,
        .prose-neo .md-ol {
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .prose-neo .md-li {
          margin-bottom: 0.25rem;
          font-weight: 500;
          list-style-type: disc;
        }

        .prose-neo .md-ol .md-li {
          list-style-type: decimal;
        }

        .prose-neo .md-blockquote {
          border-left: 4px solid #3b82f6;
          padding: 0.75rem 1rem;
          margin: 0.75rem 0;
          background: #eff6ff;
          font-style: italic;
          font-weight: 600;
        }

        :is(.dark .prose-neo .md-blockquote) {
          background: rgba(59, 130, 246, 0.15);
        }

        .prose-neo .md-inline-code {
          background: #e4e4e7;
          padding: 0.125rem 0.375rem;
          font-family: monospace;
          font-size: 0.875em;
          border: 1px solid #18181b;
          font-weight: 600;
        }

        :is(.dark .prose-neo .md-inline-code) {
          background: #27272a;
          border-color: #fafafa;
        }

        .prose-neo .code-block-wrapper {
          margin: 0.75rem 0;
          border: 2px solid #18181b;
          overflow: hidden;
        }

        :is(.dark .prose-neo .code-block-wrapper) {
          border-color: #fafafa;
        }

        .prose-neo .code-block-lang {
          padding: 0.375rem 0.75rem;
          background: #27272a;
          color: #a1a1aa;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 2px solid #18181b;
        }

        :is(.dark .prose-neo .code-block-lang) {
          background: #fafafa;
          color: #18181b;
          border-bottom-color: #fafafa;
        }

        .prose-neo .code-block {
          padding: 1rem;
          background: #27272a;
          overflow-x: auto;
          font-family: monospace;
          font-size: 0.875rem;
          line-height: 1.6;
          color: #e4e4e7;
          margin: 0;
        }

        :is(.dark .prose-neo .code-block) {
          background: #09090b;
          color: #d4d4d8;
        }

        .prose-neo .md-link {
          color: #2563eb;
          font-weight: 700;
          text-decoration: underline;
          text-underline-offset: 2px;
          text-decoration-thickness: 2px;
        }

        :is(.dark .prose-neo .md-link) {
          color: #60a5fa;
        }

        .prose-neo .md-link:hover {
          color: #1d4ed8;
        }

        :is(.dark .prose-neo .md-link:hover) {
          color: #93c5fd;
        }

        .prose-neo .md-hr {
          border: none;
          border-top: 4px solid #18181b;
          margin: 1.5rem 0;
        }

        :is(.dark .prose-neo .md-hr) {
          border-top-color: #fafafa;
        }

        .prose-neo strong {
          font-weight: 900;
        }
      `}</style>
    </div>
  );
}
