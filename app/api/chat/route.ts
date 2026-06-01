// POST /api/chat
//
// This is the core of the RAG pipeline:
// 1. Receive the user's message
// 2. Embed the query using OpenAI
// 3. Score all knowledge chunks by cosine similarity
// 4. Pass the top 4 chunks as context to the LLM
// 5. Stream the response back to the client

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import OpenAI from "openai";
import { KNOWLEDGE_BASE } from "@/lib/knowledge-base";
import { rankChunksBySimilarity, buildSystemPrompt } from "@/lib/rag-utils";

// We embed all knowledge chunks once per cold start and cache them here.
// In production this would live in a vector database (e.g. pgvector on Supabase).
let embeddedChunksCache: Array<{
  id: string;
  source: string;
  title: string;
  sourceUrl: string;
  content: string;
  embedding: number[];
}> | null = null;

async function getEmbeddedChunks(openaiClient: OpenAI) {
  if (embeddedChunksCache) return embeddedChunksCache;

  const texts = KNOWLEDGE_BASE.map((chunk) => `${chunk.title}. ${chunk.content}`);

  const response = await openaiClient.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
  });

  embeddedChunksCache = KNOWLEDGE_BASE.map((chunk, index) => ({
    id: chunk.id,
    source: chunk.source,
    title: chunk.title,
    sourceUrl: chunk.sourceUrl,
    content: chunk.content,
    embedding: response.data[index].embedding,
  }));

  return embeddedChunksCache;
}

export async function POST(request: Request) {
  const { messages } = await request.json();
  const latestMessage = messages[messages.length - 1].content as string;

  const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Step 1: Embed the user's query
  const queryEmbeddingResponse = await openaiClient.embeddings.create({
    model: "text-embedding-3-small",
    input: latestMessage,
  });
  const queryEmbedding = queryEmbeddingResponse.data[0].embedding;

  // Step 2: Retrieve the most relevant knowledge chunks
  const embeddedChunks = await getEmbeddedChunks(openaiClient);
  const relevantChunks = rankChunksBySimilarity(queryEmbedding, embeddedChunks, 4);

  // Step 3: Build the system prompt with retrieved context injected
  const systemPrompt = buildSystemPrompt(relevantChunks);

  // Step 4: Stream the LLM response
  const result = streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}
