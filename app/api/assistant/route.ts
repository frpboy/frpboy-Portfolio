import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { generatePortfolioAnswer } from "@/lib/server/neon-ai-gateway";
import { searchKnowledge } from "@/lib/server/pinecone";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "sin1";

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.nextUrl.host;
  } catch {
    return false;
  }
}

function getRateLimitKey(request: NextRequest): string {
  const pepper = process.env.PORTFOLIO_RATE_LIMIT_SECRET;
  if (!pepper) throw new Error("PORTFOLIO_RATE_LIMIT_SECRET is not configured");

  const forwardedFor = request.headers.get("x-forwarded-for");
  // Vercel sets x-real-ip at the edge; prefer it over the client-supplied
  // first value in x-forwarded-for to make the limiter harder to bypass.
  const clientAddress =
    request.headers.get("x-real-ip") ||
    forwardedFor?.split(",").at(-1)?.trim() ||
    "unknown";

  // Raw IP addresses are never stored; only a keyed hash is persisted.
  return createHash("sha256").update(pepper).update(":").update(clientAddress).digest("hex");
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Cross-origin requests are not allowed" }, { status: 403 });
  }

  const required = [
    process.env.DATABASE_URL,
    process.env.NEON_AI_GATEWAY_TOKEN,
    process.env.NEON_AI_GATEWAY_BASE_URL,
    process.env.PINECONE_API_KEY,
    process.env.PINECONE_INDEX_HOST,
  ];
  if (required.some((value) => !value) || !process.env.PORTFOLIO_RATE_LIMIT_SECRET) {
    return NextResponse.json(
      { error: "The portfolio assistant is being configured" },
      { status: 503 },
    );
  }

  let body: { question?: unknown };
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json({ error: "JSON body must be an object" }, { status: 400 });
    }
    body = parsed as { question?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (!question || question.length > 1_200) {
    return NextResponse.json(
      { error: "Question must contain 1–1,200 characters" },
      { status: 400 },
    );
  }

  try {
    const sql = getDb();
    const rateKey = getRateLimitKey(request);
    const rateRows = await sql`
      SELECT public.consume_portfolio_ai_rate_limit(${rateKey}, 12) AS allowed
    `;
    const rateRow = (rateRows as unknown as Array<{ allowed?: boolean }>)[0];
    const allowed = Boolean(rateRow?.allowed);

    if (!allowed) {
      return NextResponse.json(
        { error: "You have reached the assistant's hourly limit. Please try again later." },
        { status: 429, headers: { "Retry-After": "3600" } },
      );
    }

    // Pinecone's integrated embedding model embeds this query using the
    // same model and dimension as the indexed chunk_text field.
    const matches = await searchKnowledge(question);

    const candidateSourceIds = Array.from(
      new Set(
        matches
          .map((match) => match.sourceId)
          .filter((sourceId): sourceId is string =>
            typeof sourceId === "string" &&
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sourceId),
          ),
      ),
    );

    // Only answer from the active, successfully indexed version of each
    // source. Old or partially uploaded Pinecone documents are ignored.
    // Batch fetch candidate source versions in a single roundtrip to eliminate
    // N+1 HTTP queries to serverless Neon Postgres.
    const activeVersions = new Map<string, string>();
    if (candidateSourceIds.length > 0) {
      const rows = await sql`
        SELECT source_id::text AS source_id, source_version::text AS source_version
        FROM public.portfolio_knowledge_sources
        WHERE source_id = ANY(${candidateSourceIds}::uuid[])
          AND status = 'ready'
          AND source_version IS NOT NULL
      `;
      for (const row of rows as unknown as Array<{ source_id: string; source_version: string }>) {
        if (row.source_id && row.source_version) {
          activeVersions.set(row.source_id, row.source_version);
        }
      }
    }

    const relevant = matches
      .filter((match) =>
        typeof match.sourceId === "string" &&
        typeof match.sourceVersion === "string" &&
        activeVersions.get(match.sourceId) === match.sourceVersion,
      )
      .map((match) => ({
        score: match._score ?? 0,
        title: String(match.title ?? "Portfolio source"),
        sourceUrl: String(match.sourceUrl ?? ""),
        content: String(match.chunk_text ?? ""),
      }))
      .filter((match) => match.content.length > 0);

    const context = relevant
      .map(
        (item, index) =>
          `[Source ${index + 1}: ${item.title}]\n${item.content}\nSource: ${item.sourceUrl}`,
      )
      .join("\n\n---\n\n");

    const answer = await generatePortfolioAnswer(question, context);
    const sources = Array.from(
      new Map(
        relevant
          .filter((item) => item.sourceUrl.startsWith("https://"))
          .map((item) => [item.sourceUrl, { title: item.title, url: item.sourceUrl }]),
      ).values(),
    ).slice(0, 4);

    return NextResponse.json({ answer, sources }, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("[portfolio-assistant] Request failed", error);
    return NextResponse.json(
      { error: "The assistant is temporarily unavailable" },
      { status: 503 },
    );
  }
}
