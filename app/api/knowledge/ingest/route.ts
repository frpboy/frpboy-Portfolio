import { randomUUID, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { upsertKnowledgeDocuments } from "@/lib/server/pinecone";
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
  // Strip Bearer prefix cleanly using single backslash for whitespace in regex literal
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!configured || !supplied) return false;

  const expectedBuffer = Buffer.from(configured);
  const suppliedBuffer = Buffer.from(supplied);
  return (
    expectedBuffer.length === suppliedBuffer.length &&
    timingSafeEqual(expectedBuffer, suppliedBuffer)
  );
}

function chunkText(input: string): string[] {
  const normalized = input.replace(/\r\n/g, "\n").replace(/[\t ]+/g, " ").trim();
  const chunks: string[] = [];
  const targetSize = 1_100;
  const overlap = 160;
  const maxChunks = 100;
  let start = 0;

  while (start < normalized.length) {
    if (chunks.length >= maxChunks) {
      throw new Error(`Knowledge source exceeds the ${maxChunks}-chunk ingestion limit.`);
    }

    let end = Math.min(start + targetSize, normalized.length);
    if (end < normalized.length) {
      const boundary = normalized.lastIndexOf("\\n", end);
      if (boundary > start + 650) end = boundary;
    }

    const chunk = normalized.slice(start, end).trim();
    if (chunk.length >= 40) chunks.push(chunk);
    if (end >= normalized.length) break;
    start = Math.max(end - overlap, start + 1);
  }

  return chunks;
}

function validateSourceUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    if (parsed.username || parsed.password) return false;
    if (parsed.protocol === "https:") return Boolean(parsed.hostname);
    return parsed.protocol === "manual:" && Boolean(parsed.hostname);
  } catch {
    return false;
  }
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
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > 100_000) {
      return NextResponse.json({ error: "Request body is too large" }, { status: 413 });
    }
    const parsed: unknown = JSON.parse(rawBody);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json({ error: "JSON body must be an object" }, { status: 400 });
    }
    body = parsed as IngestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const sourceUrl = typeof body.sourceUrl === "string" ? body.sourceUrl.trim() : "";
  const sourceType =
    typeof body.sourceType === "string" ? body.sourceType.trim().slice(0, 80) : "portfolio";
  const text = typeof body.text === "string" ? body.text.trim() : "";

  if (!title || title.length > 180) {
    return NextResponse.json({ error: "Title must contain 1–180 characters" }, { status: 400 });
  }
  if (!sourceUrl || sourceUrl.length > 1_000 || !validateSourceUrl(sourceUrl)) {
    return NextResponse.json(
      { error: "sourceUrl must be a valid HTTPS URL or manual:// identifier" },
      { status: 400 },
    );
  }
  if (!text || text.length > 80_000) {
    return NextResponse.json({ error: "Text must contain 1–80,000 characters" }, { status: 400 });
  }

  let chunks: string[];
  try {
    chunks = chunkText(text);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Knowledge source is too large" },
      { status: 413 },
    );
  }

  if (chunks.length === 0) {
    return NextResponse.json({ error: "No useful text chunks were found" }, { status: 400 });
  }

  const sql = getDb();
  const sourceVersion = randomUUID();
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
        status = CASE
          WHEN public.portfolio_knowledge_sources.source_version IS NULL THEN 'processing'
          ELSE 'ready'
        END,
        error_message = NULL,
        updated_at = NOW()
      RETURNING source_id::text AS source_id
    `;

    const sourceRow = (sourceRows as unknown as Array<{ source_id: string }>)[0];
    if (!sourceRow?.source_id) throw new Error("Knowledge source insert returned no ID");
    const resolvedSourceId = String(sourceRow.source_id);
    sourceId = resolvedSourceId;

    // Each ingest run uses a unique archive key and vector namespace ID. The
    // prior ready source version remains active until the replacement is ready.
    const storageKey = await storeKnowledgeSource(resolvedSourceId, sourceVersion, text);

    const documents = chunks.map((content, index) => ({
      _id: `${resolvedSourceId}-${sourceVersion}-${index}`,
      title,
      chunk_text: content,
      sourceId: resolvedSourceId,
      sourceVersion,
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
        source_version = ${sourceVersion}::uuid,
        storage_key = ${storageKey},
        last_indexed_at = NOW(),
        updated_at = NOW(),
        error_message = NULL
      WHERE source_id = ${sourceId}::uuid
    `;

    return NextResponse.json({
      success: true,
      sourceId,
      sourceVersion,
      chunkCount: chunks.length,
    });
  } catch (error) {
    if (sourceId) {
      await sql`
        UPDATE public.portfolio_knowledge_sources
        SET
          status = CASE WHEN source_version IS NULL THEN 'failed' ELSE 'ready' END,
          error_message = ${error instanceof Error ? error.message.slice(0, 500) : "Unknown error"},
          updated_at = NOW()
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
