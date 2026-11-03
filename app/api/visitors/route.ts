import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "sin1";

type StatsRow = {
  total_unique_visitors: number | string;
  total_page_views: number | string;
  unique_visitors_today: number | string;
  page_views_today: number | string;
};

function noStore() {
  return { headers: { "Cache-Control": "no-store, max-age=0" } };
}

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).host === request.nextUrl.host;
  } catch {
    return false;
  }
}

function toCount(value: number | string | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : 0;
}

async function readStats() {
  const sql = getDb();
  const rows = await sql`
    SELECT
      total_unique_visitors,
      total_page_views,
      unique_visitors_today,
      page_views_today
    FROM public.portfolio_visitor_stats
    LIMIT 1
  `;

  const row = (rows as unknown as StatsRow[])[0];
  if (!row) {
    throw new Error("portfolio_visitor_stats view returned no row");
  }

  return {
    totalUniqueVisitors: toCount(row.total_unique_visitors),
    totalPageViews: toCount(row.total_page_views),
    uniqueVisitorsToday: toCount(row.unique_visitors_today),
    pageViewsToday: toCount(row.page_views_today),
  };
}

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Visitor analytics is not configured" },
      { status: 503, ...noStore() },
    );
  }

  try {
    return NextResponse.json(await readStats(), noStore());
  } catch (error) {
    console.error("[visitor-analytics] Failed to read statistics", error);
    return NextResponse.json(
      { error: "Visitor analytics is temporarily unavailable" },
      { status: 503, ...noStore() },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Visitor analytics is not configured" },
      { status: 503, ...noStore() },
    );
  }

  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { error: "Cross-origin requests are not allowed" },
      { status: 403, ...noStore() },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > 2048) {
    return NextResponse.json({ error: "Request body is too large" }, { status: 413, ...noStore() });
  }

  let payload: { visitorId?: unknown; pagePath?: unknown; referrerHost?: unknown };
  try {
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > 2048) {
      return NextResponse.json({ error: "Request body is too large" }, { status: 413, ...noStore() });
    }

    const parsed: unknown = JSON.parse(rawBody);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json({ error: "JSON body must be an object" }, { status: 400, ...noStore() });
    }
    payload = parsed as typeof payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400, ...noStore() });
  }

  const { visitorId, pagePath, referrerHost = null } = payload;

  if (
    typeof visitorId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(visitorId)
  ) {
    return NextResponse.json({ error: "A valid visitor ID is required" }, { status: 400, ...noStore() });
  }

  if (
    typeof pagePath !== "string" ||
    pagePath.length < 1 ||
    pagePath.length > 512 ||
    !pagePath.startsWith("/") ||
    pagePath.startsWith("//") ||
    /[\u0000-\u001f]/.test(pagePath)
  ) {
    return NextResponse.json({ error: "A valid page path is required" }, { status: 400, ...noStore() });
  }

  if (
    referrerHost !== null &&
    (typeof referrerHost !== "string" ||
      referrerHost.length > 255 ||
      /[\u0000-\u001f\s/\\]/.test(referrerHost))
  ) {
    return NextResponse.json({ error: "Invalid referrer host" }, { status: 400, ...noStore() });
  }

  try {
    const sql = getDb();
    await sql`
      SELECT public.record_portfolio_page_view(
        ${visitorId}::uuid,
        ${pagePath},
        ${referrerHost}
      )
    `;

    return NextResponse.json(await readStats(), noStore());
  } catch (error) {
    console.error("[visitor-analytics] Failed to record page view", error);
    return NextResponse.json(
      { error: "Visitor analytics is temporarily unavailable" },
      { status: 503, ...noStore() },
    );
  }
}
