# Nora Comply

A RAG chatbot that answers EU AI Act compliance questions for recruitment agencies. Every answer is grounded in verbatim text from the actual regulation — not the LLM's training memory.

## Why RAG instead of just prompting ChatGPT

Sending compliance questions straight to an LLM is a bad idea. The model answers from training weights, which means it can hallucinate article numbers, get dates wrong, and give confident answers that directly contradict the text of the law. For a compliance product, that's not a corner case — it's the core failure mode.

RAG flips this: instead of asking the LLM what the law says, we tell it exactly what the law says and ask it to reason over that. The retrieval pipeline fetches the most relevant chunks from our knowledge base, injects them as context, and the LLM works from there.

```
user question → embed (text-embedding-3-small) → cosine similarity against 27 chunks
→ top 6 most relevant chunks → injected into system prompt → gpt-4o generates answer
→ streams back to browser
```

## Project structure

```
app/
  api/chat/route.ts          # RAG pipeline — embed query, retrieve, stream
  components/
    ChatMessage.tsx          # Message rendering with markdown + source chips
    SuggestedQuestions.tsx   # Starting prompts for new users
    NoraLogo.tsx             # Custom SVG logo + EU flag
  page.tsx                   # Chat UI
  globals.css                # Navy design system
lib/
  knowledge-base.ts          # 27 chunks of verbatim EU AI Act text
  rag-utils.ts               # Cosine similarity, chunk ranking, system prompt
```

## Knowledge base

27 chunks sourced from [Regulation (EU) 2024/1689](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689) via [artificialintelligenceact.eu](https://artificialintelligenceact.eu). Each chunk covers one paragraph or one tightly related set of obligations — this is intentional. A chunk covering half an article retrieves noisily; a paragraph-level chunk retrieves precisely.

Articles covered: 5, 6, 9, 13, 14, 26 (all 12 paragraphs), 27 (all 5 paragraphs), 113, Annex III Point 4(a)/(b), GPAI obligations, Ireland WRC guidance.

The in-memory embedding cache is fine for a prototype. In production this moves to pgvector on Supabase.

## Setup

```bash
git clone <repo>
cd nora-rag
npm install

cp .env.example .env.local
# add your OPENAI_API_KEY to .env.local

npm run dev
```

## Deploying to Vercel

```bash
npm install -g vercel
vercel
vercel env add OPENAI_API_KEY
```

## Environment

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | Used for `text-embedding-3-small` (retrieval) and `gpt-4o` (generation) |

## What's missing for production

- Pre-computed embeddings in pgvector — right now embeddings are computed fresh on cold start
- Cross-encoder re-ranking — cosine similarity gives good recall but a cross-encoder pass improves precision for borderline cases
- Conversation-aware retrieval — follow-up questions don't re-embed prior turns, so context can slip
- EUR-Lex SPARQL integration — when the regulation gets amended, we should detect the diff automatically rather than manually updating chunks
