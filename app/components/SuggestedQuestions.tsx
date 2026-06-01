"use client";

import { ArrowRight } from "lucide-react";

const SUGGESTED_QUESTIONS = [
  "Is our AI recruitment tool high-risk under the EU AI Act?",
  "What do we need to do before using AI in hiring by August 2026?",
  "Do we need to complete a FRIA before using AI to screen CVs?",
  "What logs do we need to keep and for how long?",
  "How do we inform candidates that AI is being used in their application?",
  "What does human oversight actually mean in a recruitment context?",
];

type Props = { onSelect: (question: string) => void };

export function SuggestedQuestions({ onSelect }: Props) {
  return (
    <div>
      <p
        style={{
          fontSize: "0.65rem",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontWeight: 600,
          marginBottom: "0.875rem",
          textAlign: "center",
        }}
      >
        Common questions
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.5rem" }}>
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            style={{
              textAlign: "left",
              background: "rgba(15,32,64,0.6)",
              border: "1px solid rgba(72,149,239,0.15)",
              borderRadius: "12px",
              padding: "12px 16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              transition: "all 0.15s ease",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = "rgba(72,149,239,0.1)";
              el.style.borderColor = "rgba(72,149,239,0.4)";
              el.style.transform = "translateX(3px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = "rgba(15,32,64,0.6)";
              el.style.borderColor = "rgba(72,149,239,0.15)";
              el.style.transform = "translateX(0)";
            }}
          >
            <span style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
              {q}
            </span>
            <ArrowRight size={14} color="var(--accent)" style={{ flexShrink: 0, opacity: 0.6 }} />
          </button>
        ))}
      </div>
    </div>
  );
}
