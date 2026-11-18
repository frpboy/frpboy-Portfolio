import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { generateGoogleAiAnswer, isGoogleAiConfigured } from "@/lib/server/google-ai";
import { generatePortfolioAnswer } from "@/lib/server/neon-ai-gateway";
import { searchKnowledge } from "@/lib/server/pinecone";
import { REVIEWED_PUBLIC_SOURCE_VERSIONS } from "@/lib/server/reviewed-sources";
import {
  BLOCKED_QUESTION_REPLY,
  FALLBACK_REPLY,
  buildGroundedContext,
  createContextBoundary,
  isReviewedMatch,
  looksCompromised,
  screenQuestion,
} from "@/lib/server/prompt-injection-guard";
import { getSocialReply } from "@/lib/server/social-replies";

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

// Retrieval serves only exact public source identities and versions that have
// been independently reviewed (V6 chunk-level clearance, 2026-11-18). A public
// Git URL alone is not a content grant. No index/database deletion and no
// automatic trust of existing indexed chunks.
const reviewedPublicSourceVersions: ReadonlyMap<string, string> =
  REVIEWED_PUBLIC_SOURCE_VERSIONS;

// Indexed knowledge vectors carry either the ingestion pipeline's UUID source
// identity or a reviewed content identity (src-<16 hex> from repo|path).
const SOURCE_ID_PATTERN =
  /^([0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|src-[0-9a-f]{16})$/i;

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Cross-origin requests are not allowed" }, { status: 403 });
  }

  const required = [
    process.env.DATABASE_URL,
    process.env.PINECONE_API_KEY,
    process.env.PINECONE_INDEX_HOST,
  ];
  // Provider: the Google AI (Gemini) API Truebite uses, or the Neon AI
  // Gateway. Gemini is preferred when its key is configured; until one is,
  // the existing Neon gateway path is unchanged.
  const hasProvider =
    isGoogleAiConfigured() ||
    (Boolean(process.env.NEON_AI_GATEWAY_TOKEN) && Boolean(process.env.NEON_AI_GATEWAY_BASE_URL));
  if (required.some((value) => !value) || !process.env.PORTFOLIO_RATE_LIMIT_SECRET || !hasProvider) {
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

  // Casual social input (greetings, thanks, quick acknowledgements) is not
  // an unsupported factual query. It gets a short canned welcome instead of
  // the "sources do not cover that" fallback. The reply is fully static
  // (visitor text is never echoed), and the check runs before rate
  // limiting, retrieval, and provider calls, so social chatter costs
  // nothing. Whole-message matching means a real question that starts with
  // "hi" still goes through normal grounded retrieval.
  const socialReply = getSocialReply(question);
  if (socialReply) {
    return NextResponse.json(
      { answer: socialReply, sources: [] },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  }

  if (reviewedPublicSourceVersions.size === 0) {
    return NextResponse.json(
      { error: "The portfolio assistant's public sources are being reviewed. Please use the project registry or contact Rahul directly." },
      { status: 503, headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  }

  // Screen the question before any database, retrieval, or model call.
  // Blocked questions get a fixed reply, so injection probing costs nothing.
  const screening = screenQuestion(question);
  if (!screening.allowed) {
    console.warn(`[portfolio-assistant] Blocked question (${screening.patternId})`);
    return NextResponse.json(
      { answer: BLOCKED_QUESTION_REPLY, sources: [] },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
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
            typeof sourceId === "string" && SOURCE_ID_PATTERN.test(sourceId),
          ),
      ),
    );

    // Only answer from the active, successfully indexed version of each
    // source. Old or partially uploaded Pinecone documents are ignored.
    const activeVersions = new Map<string, string>();
    await Promise.all(candidateSourceIds.map(async (sourceId) => {
      const rows = sourceId.startsWith("src-")
        ? await sql`
            SELECT source_version
            FROM public.portfolio_assistant_source_registry
            WHERE source_id = ${sourceId}
              AND status = 'ready'
            LIMIT 1
          `
        : await sql`
            SELECT source_version::text AS source_version
            FROM public.portfolio_knowledge_sources
            WHERE source_id = ${sourceId}::uuid
              AND status = 'ready'
              AND source_version IS NOT NULL
            LIMIT 1
          `;
      const row = (rows as unknown as Array<{ source_version: string }>)[0];
      if (row?.source_version) activeVersions.set(sourceId, row.source_version);
    }));

    // Independent of model behavior: only chunks whose source AND exact
    // version are both the active registry version and an explicitly
    // reviewed public version may reach the provider.
    const relevant = matches
      .filter((match) => isReviewedMatch(match, activeVersions, reviewedPublicSourceVersions))
      .map((match) => ({
        score: match._score ?? 0,
        title: String(match.title ?? "Portfolio source"),
        sourceUrl: String(match.sourceUrl ?? ""),
        content: String(match.chunk_text ?? ""),
      }))
      .filter((match) => match.content.length > 0);

    // Relevance floor: without one, unrelated queries still put the top-k
    // retrieval noise into the model context and cited those chunks as
    // sources even when the answer correctly said nothing was found.
    // Floor measured 2026-11-18 against live scores: nonsense/unknown terms
    // top out at 0.19; genuine questions start at 0.33. KNOWLEDGE_MIN_SCORE
    // overrides without a redeploy.
    const MIN_MATCH_SCORE =
      Number.parseFloat(process.env.KNOWLEDGE_MIN_SCORE ?? "") || 0.24;
    const groundedMatches = relevant.filter((match) => match.score >= MIN_MATCH_SCORE);

    // Nothing relevant indexed: answer directly without a provider call, so
    // no unrelated chunks are cited and no facts can be invented.
    if (groundedMatches.length === 0) {
      return NextResponse.json(
        {
          answer:
            "The portfolio's public sources do not cover that. Try asking about Rahul's published projects, skills, or experience.",
          sources: [],
        },
        { headers: { "Cache-Control": "no-store, max-age=0" } },
      );
    }

    // Isolate retrieved text behind a per-request random boundary and
    // neutralize marker-like content inside the chunks.
    const boundary = createContextBoundary();
    const context = buildGroundedContext(groundedMatches, boundary);

    const generate = () =>
      isGoogleAiConfigured()
        ? generateGoogleAiAnswer(question, context, boundary)
        : generatePortfolioAnswer(question, context, boundary);

    // One retry absorbs transient provider rate limits and timeouts (the
    // free Gemini tier enforces per-minute bursts) instead of surfacing a
    // bare 503 for a momentary failure. Permanent failures (auth/config 4xx
    // other than 429) are never retried. Worst-case added time is bounded:
    // 15s timeout + 0.8s backoff + 15s retry, inside the function budget.
    let rawAnswer: string;
    try {
      rawAnswer = await generate();
    } catch (firstError) {
      const status = (firstError as { status?: number } | null)?.status;
      const retryable = typeof status !== "number" || status === 429 || status >= 500;
      if (!retryable) throw firstError;
      console.warn("[portfolio-assistant] Provider attempt failed, retrying once", firstError);
      await new Promise((resolve) => setTimeout(resolve, 800));
      rawAnswer = await generate();
    }

    // Fail closed if the model echoes the scaffolding or the raw context.
    const answer = looksCompromised(rawAnswer, boundary, context) ? FALLBACK_REPLY : rawAnswer;
    const sources = Array.from(
      new Map(
        groundedMatches
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
