# Nora Comply — EU AI Act RAG Chatbot

A RAG (Retrieval-Augmented Generation) pipeline that lets recruitment agencies ask compliance questions about the EU AI Act and get answers grounded in the actual regulation text.

## How the RAG pipeline works

Standard ChatGPT wrappers send the user's question directly to an LLM and hope the model's training data covers it. This is inadequate for compliance use cases where the answer must be traceable to a specific article.

RAG fixes this:

```
User question
     ↓
Embed the question (text-embedding-3-small)
     ↓
Score all knowledge chunks by cosine similarity to the query
     ↓
Take the top 4 most relevant chunks
     ↓
Inject those chunks into the LLM's system prompt as context
     ↓
LLM answers from the provided context, not from memory
     ↓
Streamed response back to the user
```

This means every answer is grounded in real regulation text. The LLM cannot hallucinate articles that don't exist because it's working from the retrieved context, not its training weights.

## Project structure

```
├── app/
│   ├── api/chat/route.ts       # The RAG pipeline — embed, retrieve, stream
│   ├── components/
│   │   ├── ChatMessage.tsx     # Renders user and assistant messages
│   │   └── SuggestedQuestions.tsx  # Starting prompts for new users
│   ├── page.tsx                # Single-screen chat UI
│   └── layout.tsx
├── lib/
│   ├── knowledge-base.ts       # EU AI Act content, chunked by article/concept
│   └── rag-utils.ts            # Cosine similarity, chunk ranking, system prompt builder
```

## Knowledge base

The knowledge base (`lib/knowledge-base.ts`) contains chunked content from:
- Annex III (high-risk AI classification, recruitment use case)
- Article 26 (deployer obligations)
- Article 27 (FRIA requirements)
- EU AI Act overview and enforcement timeline

Each chunk is focused on one concept. Smaller, focused chunks retrieve better than large multi-topic blocks.

In production this would move to pgvector on Supabase with embeddings pre-computed and stored. The current implementation embeds all chunks on cold start and caches them in memory — fine for a prototype, not for scale.

## Setup

```bash
# Clone and install
git clone <your-repo>
cd nora-rag
npm install

# Configure environment
cp .env.example .env.local
# Add your OPENAI_API_KEY to .env.local

# Run locally
npm run dev
```

## Deployment (Vercel)

```bash
npm install -g vercel
vercel

# Set environment variable in Vercel dashboard or via CLI:
vercel env add OPENAI_API_KEY
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | Used for text-embedding-3-small (retrieval) and gpt-4o-mini (generation) |

## What makes this more than a ChatGPT wrapper

1. **Specific retrieval**: The system retrieves from a curated knowledge base of real EU AI Act text. The LLM cannot fabricate article numbers or deadlines.

2. **Source transparency**: Every retrieved chunk includes its article source. The system prompt instructs the model to cite sources in its answers.

3. **Domain focus**: The knowledge base is scoped to what recruitment agencies need. A general LLM would give vague answers across the full Act.

4. **Compliance-ready accuracy**: For a product like Nora Comply, accuracy is not optional. RAG over verified source material is the only defensible approach.

## Next steps (production)

- Move embeddings to pgvector (Supabase) — pre-compute once, query at runtime
- Add more granular chunks (individual paragraphs rather than full article summaries)
- Implement re-ranking step (cross-encoder) after initial retrieval for higher precision
- Add source citations as footnotes in the UI
- Connect to live EUR-Lex SPARQL for automatic knowledge base updates when the regulation changes
