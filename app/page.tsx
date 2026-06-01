"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import { ChatMessage } from "./components/ChatMessage";
import { SuggestedQuestions } from "./components/SuggestedQuestions";
import { NoraLogo, EUFlag } from "./components/NoraLogo";
import { Send, CheckCircle2, XCircle } from "lucide-react";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } =
    useChat({ api: "/api/chat" });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSuggestedQuestion(question: string) {
    append({ role: "user", content: question });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-grid" style={{ backgroundColor: "var(--navy-950)" }}>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header
        className="flex-shrink-0 flex items-center justify-between px-6 py-3.5 border-b"
        style={{
          backgroundColor: "rgba(10, 22, 40, 0.92)",
          borderColor: "var(--border)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        {/* Logo + wordmark */}
        <div className="flex items-center gap-3">
          <NoraLogo size={36} />
          <div>
            <div className="flex items-baseline gap-1.5">
              <span
                style={{
                  fontFamily: "var(--font-sora), sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#F0F4FF",
                  letterSpacing: "-0.02em",
                }}
              >
                NORA
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sora), sans-serif",
                  fontWeight: 400,
                  fontSize: "1rem",
                  color: "var(--accent)",
                  letterSpacing: "0.08em",
                }}
              >
                COMPLY
              </span>
            </div>
            <p style={{ fontSize: "0.65rem", color: "var(--text-secondary)", marginTop: "1px" }}>
              EU AI Act Intelligence for Recruitment
            </p>
          </div>
        </div>

        {/* Status badge */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            background: "rgba(72,149,239,0.08)",
            border: "1px solid rgba(72,149,239,0.2)",
          }}
        >
          <div
            className="pulse-blue rounded-full"
            style={{ width: 7, height: 7, backgroundColor: "#4ADE80" }}
          />
          <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", fontWeight: 500 }}>
            27 articles indexed
          </span>
          <EUFlag size={16} />
        </div>
      </header>

      {/* ── Main ─────────────────────────────────────────────────────── */}
      <main
        className="flex-1 overflow-y-auto px-4 py-8"
        style={{ maxWidth: "780px", margin: "0 auto", width: "100%" }}
      >
        {!hasMessages ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>

            {/* Hero */}
            <div className="text-center" style={{ paddingTop: "1.5rem" }}>
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5"
                style={{
                  background: "rgba(72,149,239,0.1)",
                  border: "1px solid rgba(72,149,239,0.25)",
                  fontSize: "0.7rem",
                  color: "var(--accent)",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                }}
              >
                <EUFlag size={14} />
                REGULATION (EU) 2024/1689 · OFFICIAL TEXT
              </div>

              <h1
                className="gradient-text"
                style={{
                  fontFamily: "var(--font-sora), sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                  lineHeight: 1.2,
                  marginBottom: "1rem",
                  letterSpacing: "-0.03em",
                }}
              >
                EU AI Act Compliance
                <br />
                <span style={{ fontWeight: 400 }}>for Recruitment Agencies</span>
              </h1>

              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                  maxWidth: "500px",
                  margin: "0 auto",
                }}
              >
                Ask anything about your obligations. Every answer is grounded in
                verbatim legal text retrieved from the official regulation — not guesswork.
              </p>
            </div>

            {/* Article pills */}
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "Article 26 — Deployer Obligations",
                "Article 27 — FRIA",
                "Annex III — High-Risk Classification",
                "Article 5 — Prohibited Practices",
                "2 August 2026 Deadline",
              ].map((label) => (
                <span
                  key={label}
                  style={{
                    fontSize: "0.7rem",
                    background: "rgba(72,149,239,0.07)",
                    color: "var(--accent)",
                    border: "1px solid rgba(72,149,239,0.2)",
                    borderRadius: "999px",
                    padding: "4px 12px",
                    fontWeight: 500,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Comparison panel */}
            <div>
              <p
                style={{
                  fontSize: "0.65rem",
                  color: "var(--text-muted)",
                  textAlign: "center",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: 600,
                  marginBottom: "0.875rem",
                }}
              >
                Why this beats a generic AI
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                {/* Nora Comply column */}
                <div
                  className="glow-blue-sm"
                  style={{
                    background: "linear-gradient(135deg, rgba(72,149,239,0.1) 0%, rgba(15,32,64,0.8) 100%)",
                    border: "1px solid rgba(72,149,239,0.3)",
                    borderRadius: "14px",
                    padding: "1.25rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
                    <NoraLogo size={22} />
                    <span style={{ fontWeight: 700, fontSize: "0.8rem", color: "#F0F4FF" }}>
                      Nora Comply
                    </span>
                  </div>
                  {[
                    "Verbatim legal text from EUR-Lex",
                    "Cites exact Article + paragraph",
                    "Clickable source links to verify",
                    "Never invents deadlines or rules",
                    "Grounded — can't answer off-topic",
                  ].map((t) => (
                    <div
                      key={t}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "7px",
                        marginBottom: "0.5rem",
                        fontSize: "0.75rem",
                        color: "#C8D8F0",
                      }}
                    >
                      <CheckCircle2 size={13} color="#4ADE80" style={{ marginTop: 2, flexShrink: 0 }} />
                      {t}
                    </div>
                  ))}
                </div>

                {/* Generic AI column */}
                <div
                  style={{
                    background: "rgba(10,22,40,0.6)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "14px",
                    padding: "1.25rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    />
                    <span style={{ fontWeight: 600, fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Generic AI (ChatGPT etc.)
                    </span>
                  </div>
                  {[
                    "May paraphrase or misquote law",
                    "No paragraph-level precision",
                    "No verifiable source links",
                    "Can hallucinate enforcement dates",
                    "Answers confidently even when wrong",
                  ].map((t) => (
                    <div
                      key={t}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "7px",
                        marginBottom: "0.5rem",
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      <XCircle size={13} color="#F87171" style={{ marginTop: 2, flexShrink: 0 }} />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggested questions */}
            <SuggestedQuestions onSelect={handleSuggestedQuestion} />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isLoading && (
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0 }}>
                  <NoraLogo size={32} />
                </div>
                <div
                  style={{
                    background: "rgba(15,32,64,0.9)",
                    border: "1px solid rgba(72,149,239,0.2)",
                    borderRadius: "14px",
                    borderBottomLeftRadius: "4px",
                    padding: "14px 16px",
                  }}
                >
                  <div style={{ display: "flex", gap: "5px", alignItems: "center", height: "16px" }}>
                    {[0, 150, 300].map((delay) => (
                      <div
                        key={delay}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: "var(--accent)",
                          animation: `bounce 1.2s ${delay}ms ease-in-out infinite`,
                          opacity: 0.7,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* ── Input bar ────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0"
        style={{
          backgroundColor: "rgba(10, 22, 40, 0.95)",
          borderTop: "1px solid var(--border)",
          backdropFilter: "blur(12px)",
          padding: "1rem",
        }}
      >
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your EU AI Act obligations..."
              rows={1}
              style={{
                flex: 1,
                resize: "none",
                borderRadius: "12px",
                border: "1px solid rgba(72,149,239,0.25)",
                background: "rgba(15,32,64,0.8)",
                color: "var(--text-primary)",
                fontSize: "0.875rem",
                padding: "12px 16px",
                outline: "none",
                lineHeight: 1.5,
                maxHeight: "120px",
                overflowY: "auto",
                fontFamily: "inherit",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(72,149,239,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(72,149,239,0.25)")}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="glow-blue-sm"
              style={{
                flexShrink: 0,
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: isLoading || !input.trim()
                  ? "rgba(72,149,239,0.2)"
                  : "linear-gradient(135deg, #4895EF, #2D6BB5)",
                border: "none",
                cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                opacity: isLoading || !input.trim() ? 0.5 : 1,
              }}
            >
              <Send size={16} color="white" />
            </button>
          </form>
          <p
            style={{
              fontSize: "0.65rem",
              color: "var(--text-muted)",
              textAlign: "center",
              marginTop: "8px",
            }}
          >
            Grounded in Regulation (EU) 2024/1689 — Official Journal of the EU, 12 July 2024 · Not legal advice
          </p>
        </div>
      </div>

      {/* Bounce keyframes for loading dots */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
