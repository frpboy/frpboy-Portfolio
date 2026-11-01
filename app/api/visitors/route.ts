import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COUNTER_URL = "https://counterapi.com/api/www.frpboy.in/view/portfolio-home";
const REQUEST_TIMEOUT_MS = 7_000;

export async function GET(request: NextRequest) {
  const readOnly = request.nextUrl.searchParams.get("readOnly") === "true";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const upstreamUrl = readOnly ? `${COUNTER_URL}?readOnly=true` : COUNTER_URL;
    const upstream = await fetch(upstreamUrl, {
      method: "GET",
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Visitor counter provider returned an error", upstreamStatus: upstream.status },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    const payload: unknown = await upstream.json();
    if (
      typeof payload !== "object" ||
      payload === null ||
      !("value" in payload) ||
      typeof payload.value !== "number" ||
      !Number.isFinite(payload.value)
    ) {
      return NextResponse.json(
        { error: "Visitor counter provider returned an invalid response" },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(
      { value: payload.value },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "Visitor counter provider timed out"
        : "Visitor counter provider is unavailable";

    return NextResponse.json(
      { error: message },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  } finally {
    clearTimeout(timeout);
  }
}
