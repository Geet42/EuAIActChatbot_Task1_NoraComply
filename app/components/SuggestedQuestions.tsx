"use client";

const SUGGESTED_QUESTIONS = [
  "Is our AI recruitment tool high-risk under the EU AI Act?",
  "What do we need to do before using AI in hiring by August 2026?",
  "Do we need to complete a FRIA before using AI to screen CVs?",
  "What logs do we need to keep and for how long?",
  "How do we inform candidates that AI is being used in their application?",
  "What does human oversight actually mean in a recruitment context?",
];

type Props = {
  onSelect: (question: string) => void;
};

export function SuggestedQuestions({ onSelect }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-3">
        Common questions
      </p>
      <div className="grid grid-cols-1 gap-2">
        {SUGGESTED_QUESTIONS.map((question) => (
          <button
            key={question}
            onClick={() => onSelect(question)}
            className="text-left text-sm text-slate-600 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-colors duration-150"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
