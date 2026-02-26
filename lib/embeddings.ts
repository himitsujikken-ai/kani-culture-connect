// Gemini Embeddingsを使ったRAG検索機能
import { google } from "@ai-sdk/google";
import { embed, embedMany, cosineSimilarity } from "ai";
import { kaniKnowledge, type KnowledgeChunk } from "./kani-knowledge";

// Embedding済みのナレッジを保持するキャッシュ
let embeddingsCache: {
  chunks: KnowledgeChunk[];
  vectors: number[][];
} | null = null;

// Gemini Embedding モデル (gemini-embedding-001 は最新の高性能モデル)
const embeddingModel = google.textEmbeddingModel("gemini-embedding-001");

/**
 * ナレッジベース全体のEmbeddingを生成（初回のみ）
 */
export async function initializeEmbeddings(): Promise<void> {
  if (embeddingsCache) {
    return; // 既にキャッシュ済み
  }

  console.log("Generating embeddings for knowledge base...");

  const texts = kaniKnowledge.map(
    (chunk) => `${chunk.title}: ${chunk.content}`
  );

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: texts,
  });

  embeddingsCache = {
    chunks: kaniKnowledge,
    vectors: embeddings,
  };

  console.log(`Generated ${embeddings.length} embeddings`);
}

/**
 * クエリに関連するナレッジを検索
 * @param query 検索クエリ
 * @param topK 返す結果の数
 * @returns 関連するナレッジチャンク
 */
export async function searchKnowledge(
  query: string,
  topK: number = 3
): Promise<{ chunk: KnowledgeChunk; similarity: number }[]> {
  // 初期化されていなければ初期化
  if (!embeddingsCache) {
    await initializeEmbeddings();
  }

  if (!embeddingsCache) {
    throw new Error("Failed to initialize embeddings");
  }

  // クエリのEmbeddingを生成
  const { embedding: queryEmbedding } = await embed({
    model: embeddingModel,
    value: query,
  });

  // コサイン類似度で検索
  const results = embeddingsCache.chunks
    .map((chunk, index) => ({
      chunk,
      similarity: cosineSimilarity(queryEmbedding, embeddingsCache!.vectors[index]),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);

  return results;
}

/**
 * 検索結果をコンテキスト文字列に変換
 */
export function formatSearchResults(
  results: { chunk: KnowledgeChunk; similarity: number }[]
): string {
  if (results.length === 0) {
    return "";
  }

  const relevantResults = results.filter((r) => r.similarity > 0.3);

  if (relevantResults.length === 0) {
    return "";
  }

  const context = relevantResults
    .map(
      (r) =>
        `【${r.chunk.category}】${r.chunk.title}\n${r.chunk.content}`
    )
    .join("\n\n---\n\n");

  return `\n\n# 関連する可児市の情報\n以下の情報を参考にして回答してください：\n\n${context}`;
}

/**
 * クエリに対してRAG検索を行い、コンテキストを返す
 */
export async function getRelevantContext(query: string): Promise<string> {
  try {
    const results = await searchKnowledge(query, 3);
    return formatSearchResults(results);
  } catch (error) {
    console.error("RAG search error:", error);
    return "";
  }
}
