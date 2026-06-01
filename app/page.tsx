"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import { ChatMessage } from "./components/ChatMessage";
import { SuggestedQuestions } from "./components/SuggestedQuestions";
import { Send, Scale, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, append } =
    useChat({ api: "/api/chat" });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to the latest message whenever messages update
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
          <Scale className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-slate-900">Nora Comply</h1>
          <p className="text-xs text-slate-400">EU AI Act compliance assistant for recruitment agencies</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-400">Knowledge base active</span>
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl mx-auto w-full">
        {!hasMessages ? (
          <div className="space-y-8">
            {/* Welcome */}
            <div className="text-center space-y-2 pt-8">
              <h2 className="text-2xl font-semibold text-slate-800">
                EU AI Act Compliance Assistant
              </h2>
              <p className="text-slate-500 max-w-lg mx-auto text-sm leading-relaxed">
                Ask me anything about your obligations under the EU AI Act as a recruitment agency using AI tools.
                I answer from the official regulation text — no guesswork.
              </p>
            </div>

            {/* Source pills */}
            <div className="flex flex-wrap gap-2 justify-center">
              {["Article 26", "Article 27", "Annex III", "GDPR overlap", "August 2026 deadline"].map(
                (label) => (
                  <span
                    key={label}
                    className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-3 py-1"
                  >
                    {label}
                  </span>
                )
              )}
            </div>

            {/* Accuracy comparison */}
            <div className="max-w-2xl mx-auto w-full">
              <p className="text-xs text-slate-400 text-center mb-3 uppercase tracking-wide font-medium">Why this beats a generic AI</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-semibold text-slate-800">Nora Comply</span>
                  </div>
                  {[
                    "Verbatim legal text from EUR-Lex",
                    "Cites exact Article + paragraph",
                    "Clickable source links to verify",
                    "Never invents deadlines or rules",
                    "Grounded: can't answer off-topic",
                  ].map((t) => (
                    <div key={t} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {t}
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-slate-300" />
                    <span className="text-xs font-semibold text-slate-500">Generic AI (ChatGPT etc.)</span>
                  </div>
                  {[
                    "May paraphrase or misquote law",
                    "Cites articles without paragraph precision",
                    "No verifiable sources",
                    "Can hallucinate enforcement dates",
                    "Answers confidently even when wrong",
                  ].map((t) => (
                    <div key={t} className="flex items-start gap-2 text-xs text-slate-400">
                      <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggested questions */}
            <div className="max-w-xl mx-auto">
              <SuggestedQuestions onSelect={handleSuggestedQuestion} />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  N
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center h-4">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input bar */}
      <div className="bg-white border-t border-slate-200 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your EU AI Act obligations..."
              rows={1}
              className="flex-1 resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent max-h-32 overflow-y-auto"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-150"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
          <p className="text-xs text-slate-400 mt-2 text-center">
            Answers are grounded in Regulation (EU) 2024/1689. Not legal advice.
          </p>
        </div>
      </div>
    </div>
  );
}
