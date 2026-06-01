"use client";

import type { Message } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExternalLink, ShieldCheck } from "lucide-react";

type Props = {
  message: Message;
};

// Extracts the "Sources:" section from the end of an AI message and returns
// { body: text before sources, sources: array of {label, url} }
function parseSources(content: string): {
  body: string;
  sources: Array<{ label: string; url: string }>;
} {
  const sourcesMatch = content.match(/\n+Sources:\n([\s\S]+)$/i);
  if (!sourcesMatch) return { body: content, sources: [] };

  const body = content.slice(0, content.length - sourcesMatch[0].length);
  const sourceLines = sourcesMatch[1].trim().split("\n");
  const sources: Array<{ label: string; url: string }> = [];

  for (const line of sourceLines) {
    const match = line.match(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/);
    if (match) sources.push({ label: match[1], url: match[2] });
  }

  return { body, sources };
}

export function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex gap-3 justify-end">
        <div className="max-w-[75%] rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed bg-indigo-600 text-white">
          {message.content}
        </div>
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold">
          You
        </div>
      </div>
    );
  }

  const { body, sources } = parseSources(message.content);

  return (
    <div className="flex gap-3 justify-start">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
        N
      </div>

      <div className="max-w-[80%] space-y-2">
        {/* Main answer bubble */}
        <div className="rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed bg-white border border-slate-200 text-slate-800 shadow-sm">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Clickable links that open in a new tab
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 underline hover:text-indigo-800 inline-flex items-center gap-0.5"
                >
                  {children}
                  <ExternalLink className="w-3 h-3 inline" />
                </a>
              ),
              // Bold
              strong: ({ children }) => (
                <strong className="font-semibold text-slate-900">{children}</strong>
              ),
              // Headers inside answer
              h1: ({ children }) => (
                <h1 className="text-base font-semibold text-slate-900 mt-3 mb-1">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-sm font-semibold text-slate-900 mt-3 mb-1">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-sm font-semibold text-slate-700 mt-2 mb-1">{children}</h3>
              ),
              // Ordered and unordered lists
              ul: ({ children }) => (
                <ul className="list-disc list-outside pl-5 space-y-1 my-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-outside pl-5 space-y-1 my-2">{children}</ol>
              ),
              li: ({ children }) => <li className="text-slate-700">{children}</li>,
              // Paragraphs with spacing
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              // Inline code (article citations)
              code: ({ children }) => (
                <code className="bg-slate-100 text-indigo-700 rounded px-1 py-0.5 text-xs font-mono">
                  {children}
                </code>
              ),
              // Block quotes for verbatim legal text
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-indigo-300 pl-3 my-2 text-slate-600 italic bg-indigo-50 py-1 rounded-r">
                  {children}
                </blockquote>
              ),
              // Horizontal rules (separators)
              hr: () => <hr className="border-slate-200 my-3" />,
            }}
          >
            {body}
          </ReactMarkdown>
        </div>

        {/* Sources strip — only shown when the model returned source links */}
        {sources.length > 0 && (
          <div className="space-y-1">
            {/* Accuracy badge */}
            <div className="flex items-center gap-1.5 text-xs text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="font-medium">Grounded in official EU AI Act text</span>
              <span className="text-slate-400">· Regulation (EU) 2024/1689</span>
            </div>

            {/* Clickable source chips */}
            <div className="flex flex-wrap gap-1.5">
              {sources.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-2.5 py-1 hover:bg-indigo-100 transition-colors"
                >
                  <ExternalLink className="w-2.5 h-2.5" />
                  {s.label.length > 55 ? s.label.slice(0, 52) + "…" : s.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
