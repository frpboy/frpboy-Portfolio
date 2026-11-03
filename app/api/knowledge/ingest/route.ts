import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { deleteKnowledgeSource, upsertKnowledgeDocuments } from "@/lib/server/pinecone";
import { storeKnowledgeSource } from "@/lib/server/neon-object-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "sin1";

type IngestBody = {
  title?: unknown;
  sourceUrl?: unknown;
  sourceType?: unknown;
  text?: unknown;
};

function authorized(request: NextRequest): boolean {
  const configured = process.env.KNOWLEDGE_INGEST_TOKEN;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!configured || !supplied) return false;

  const expectedBuffer = Buffer.from(configured);
  const suppliedBuffer = Buffer.from(supplied);
  return (
    expectedBuffer.length === suppliedBuffer.length &&
    timingSafeEqual(expectedBuffer, suppliedBuffer)
  );
}

function chunkText(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").replace(/[\t ]+/g, " ").trim();
  const chunks: string[] = [];
  const targetSize = 1_100;
  const overlap = 160;
  let start = 0;

  while (start < normalized.length && chunks.length < 100) {
    let end = Math.min(start + targetSize, normalized.length);
    if (end < normalized.length) {
      const boundary = normalized.lastIndexOf("\n", end);
      if (boundary > start + 650) end = boundary;
    }

    const chunk = normalized.slice(start, end).trim();
    if (chunk.length >= 40) chunks.push(chunk);
    if (end >= normalized.length) break;
    start = Math.max(end - overlap, start + 1);
  }

  return chunks;
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const required = [
    process.env.DATABASE_URL,
    process.env.PINECONE_API_KEY,
    process.env.PINECONE_INDEX_HOST,
    process.env.AWS_ACCESS_KEY_ID,
    process.env.AWS_SECRET_ACCESS_KEY,
    process.env.AWS_ENDPOINT_URL_S3,
    process.env.AWS_REGION,
    process.env.NEON_OBJECT_STORAGE_BUCKET,
  ];
  if (required.some((value) => !value)) {
    return NextResponse.json(
      { error: "Knowledge ingestion is not fully configured" },
      { status: 503 },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > 100_000) {
    return NextResponse.json({ error: "Request body is too large" }, { status: 413 });
  }

  let body: IngestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const sourceUrl = typeof body.sourceUrl === "string" ? body.sourceUrl.trim() : "";
  const sourceType = typeof body.sourceType === "string" ? body.sourceType.trim() : "portfolio";
  const text = typeof body.text === "string" ? body.text.trim() : "";

  if (!title || title.length > 180) {
    return NextResponse.json({ error: "Title must contain 1–180 characters" }, { status: 400 });
  }
  if (
    !sourceUrl ||
    sourceUrl.length > 1_000 ||
    (!sourceUrl.startsWith("https://") && !sourceUrl.startsWith("manual://"))
  ) {
    return NextResponse.json(
      { error: "sourceUrl must be an HTTPS URL or a manual:// identifier" },
      { status: 400 },
    );
  }
  if (!text || text.length > 80_000) {
    return NextResponse.json({ error: "Text must contain 1–80,000 characters" }, { status: 400 });
  }

  const chunks = chunkText(text);
  if (chunks.length === 0) {
    return NextResponse.json({ error: "No useful text chunks were found" }, { status: 400 });
  }

  const sql = getDb();
  let sourceId: string | null = null;

  try {
    const sourceRows = await sql`
      INSERT INTO public.portfolio_knowledge_sources (
        title, source_url, source_type, status, chunk_count, updated_at
      )
      VALUES (${title}, ${sourceUrl}, ${sourceType}, 'processing', 0, NOW())
      ON CONFLICT (source_url)
      DO UPDATE SET
        title = EXCLUDED.title,
        source_type = EXCLUDED.source_type,
        status = 'processing',
        updated_at = NOW()
      RETURNING source_id::text AS source_id
    `;

    const sourceRow = (sourceRows as unknown as Array<{ source_id: string }>)[0];
    if (!sourceRow?.source_id) throw new Error('Knowledge source insert returned no ID');
    sourceId = String(sourceRow.source_id);

    // Keep the original source in a private, branch-aware Neon bucket so it can
    // be re-chunked/re-indexed even if the vector index is replaced later.
    const storageKey = await storeKnowledgeSource(sourceId, text);

    // Re-indexing a source replaces its previous vectors rather than doubling them.
    await deleteKnowledgeSource(sourceId);

    const documents = chunks.map((content, index) => ({
      _id: `${sourceId}-${index}`,
      title,
      chunk_text: content,
      sourceId: sourceId as string,
      sourceUrl,
      sourceType,
      chunkIndex: index,
    }));

    // Pinecone's integrated llama-text-embed-v2 model embeds chunk_text.
    await upsertKnowledgeDocuments(documents);

    await sql`
      UPDATE public.portfolio_knowledge_sources
      SET
        status = 'ready',
        chunk_count = ${chunks.length},
        storage_key = ${storageKey},
        last_indexed_at = NOW(),
        updated_at = NOW(),
        error_message = NULL
      WHERE source_id = ${sourceId}::uuid
    `;

    return NextResponse.json({
      success: true,
      sourceId,
      chunkCount: chunks.length,
    });
  } catch (error) {
    if (sourceId) {
      await sql`
        UPDATE public.portfolio_knowledge_sources
        SET status = 'failed', error_message = ${error instanceof Error ? error.message.slice(0, 500) : "Unknown error"}, updated_at = NOW()
        WHERE source_id = ${sourceId}::uuid
      `.catch(() => undefined);
    }

    console.error("[knowledge-ingest] Failed to index source", error);
    return NextResponse.json(
      { error: "Knowledge source could not be indexed" },
      { status: 502 },
    );
  }
}
