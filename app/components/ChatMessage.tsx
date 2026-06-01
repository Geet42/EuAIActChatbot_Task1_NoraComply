"use client";

import type { Message } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { NoraLogo, EUFlag } from "./NoraLogo";

type Props = { message: Message };

function parseSources(content: string): {
  body: string;
  sources: Array<{ label: string; url: string }>;
} {
  const match = content.match(/\n+Sources:\n([\s\S]+)$/i);
  if (!match) return { body: content, sources: [] };

  const body = content.slice(0, content.length - match[0].length);
  const sources: Array<{ label: string; url: string }> = [];
  for (const line of match[1].trim().split("\n")) {
    const m = line.match(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/);
    if (m) sources.push({ label: m[1], url: m[2] });
  }
  return { body, sources };
}

export function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
        <div
          style={{
            maxWidth: "72%",
            background: "linear-gradient(135deg, #2D6BB5, #1D3557)",
            border: "1px solid rgba(72,149,239,0.3)",
            borderRadius: "16px",
            borderBottomRightRadius: "4px",
            padding: "12px 16px",
            fontSize: "0.875rem",
            color: "#F0F4FF",
            lineHeight: 1.6,
          }}
        >
          {message.content}
        </div>
        <div
          style={{
            flexShrink: 0,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(72,149,239,0.15)",
            border: "1px solid rgba(72,149,239,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.65rem",
            fontWeight: 700,
            color: "var(--accent)",
          }}
        >
          YOU
        </div>
      </div>
    );
  }

  const { body, sources } = parseSources(message.content);

  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
      {/* Avatar */}
      <div style={{ flexShrink: 0, marginTop: 2 }}>
        <NoraLogo size={32} />
      </div>

      <div style={{ maxWidth: "82%", display: "flex", flexDirection: "column", gap: "8px" }}>
        {/* Answer bubble */}
        <div
          style={{
            background: "rgba(12,26,50,0.95)",
            border: "1px solid rgba(72,149,239,0.2)",
            borderRadius: "16px",
            borderBottomLeftRadius: "4px",
            padding: "14px 18px",
            fontSize: "0.85rem",
            lineHeight: 1.7,
            color: "#C8D8F0",
          }}
        >
          <div className="prose-navy">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#60A5FA", textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: "3px" }}
                  >
                    {children}
                    <ExternalLink size={11} style={{ display: "inline", flexShrink: 0 }} />
                  </a>
                ),
                strong: ({ children }) => (
                  <strong style={{ color: "#BFDBFE", fontWeight: 600 }}>{children}</strong>
                ),
                h2: ({ children }) => (
                  <h2 style={{ color: "#BFDBFE", fontWeight: 600, fontSize: "0.9rem", marginTop: "0.75rem", marginBottom: "0.25rem" }}>{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 style={{ color: "#93C5FD", fontWeight: 600, fontSize: "0.85rem", marginTop: "0.5rem", marginBottom: "0.2rem" }}>{children}</h3>
                ),
                ul: ({ children }) => <ul style={{ listStyleType: "disc", paddingLeft: "1.25rem", margin: "0.4rem 0" }}>{children}</ul>,
                ol: ({ children }) => <ol style={{ listStyleType: "decimal", paddingLeft: "1.25rem", margin: "0.4rem 0" }}>{children}</ol>,
                li: ({ children }) => <li style={{ marginBottom: "0.2rem", color: "#C8D8F0" }}>{children}</li>,
                p: ({ children }) => <p style={{ marginBottom: "0.55rem" }}>{children}</p>,
                code: ({ children }) => (
                  <code style={{ background: "rgba(72,149,239,0.12)", color: "#93C5FD", borderRadius: "4px", padding: "1px 5px", fontSize: "0.8em", fontFamily: "monospace" }}>
                    {children}
                  </code>
                ),
                blockquote: ({ children }) => (
                  <blockquote style={{ borderLeft: "3px solid rgba(72,149,239,0.5)", paddingLeft: "0.875rem", color: "#8BA3C4", fontStyle: "italic", margin: "0.5rem 0", background: "rgba(72,149,239,0.05)", borderRadius: "0 6px 6px 0", paddingTop: "0.25rem", paddingBottom: "0.25rem" }}>
                    {children}
                  </blockquote>
                ),
                hr: () => <hr style={{ borderColor: "rgba(72,149,239,0.15)", margin: "0.75rem 0" }} />,
                table: ({ children }) => (
                  <div style={{ overflowX: "auto", margin: "0.5rem 0" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8em" }}>{children}</table>
                  </div>
                ),
                th: ({ children }) => <th style={{ background: "rgba(72,149,239,0.15)", color: "#BFDBFE", padding: "6px 10px", textAlign: "left", fontWeight: 600 }}>{children}</th>,
                td: ({ children }) => <td style={{ padding: "5px 10px", borderTop: "1px solid rgba(72,149,239,0.1)", color: "#C8D8F0" }}>{children}</td>,
              }}
            >
              {body}
            </ReactMarkdown>
          </div>
        </div>

        {/* Sources strip */}
        {sources.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {/* Accuracy badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <ShieldCheck size={13} color="#4ADE80" />
              <span style={{ fontSize: "0.7rem", color: "#4ADE80", fontWeight: 500 }}>
                Grounded in official EU AI Act text
              </span>
              <EUFlag size={14} />
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>· Regulation (EU) 2024/1689</span>
            </div>

            {/* Source chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {sources.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "0.7rem",
                    background: "rgba(72,149,239,0.08)",
                    color: "#60A5FA",
                    border: "1px solid rgba(72,149,239,0.2)",
                    borderRadius: "999px",
                    padding: "3px 10px",
                    textDecoration: "none",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.background = "rgba(72,149,239,0.18)";
                    el.style.borderColor = "rgba(72,149,239,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.background = "rgba(72,149,239,0.08)";
                    el.style.borderColor = "rgba(72,149,239,0.2)";
                  }}
                >
                  <ExternalLink size={10} />
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
