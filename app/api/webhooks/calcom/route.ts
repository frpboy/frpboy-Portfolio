import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "sin1";

function isValidSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.CALCOM_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(signature);

  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL || !process.env.CALCOM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Cal.com webhook is not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, "utf8") > 256_000) {
    return NextResponse.json({ error: "Webhook payload is too large" }, { status: 413 });
  }

  if (!isValidSignature(rawBody, request.headers.get("x-cal-signature-256"))) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
  }

  let body: {
    triggerEvent?: unknown;
    payload?: { uid?: unknown; bookingId?: unknown };
  };

  try {
    const parsed: unknown = JSON.parse(rawBody);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json({ error: "Webhook JSON must be an object" }, { status: 400 });
    }
    body = parsed as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid webhook JSON" }, { status: 400 });
  }

  const eventType =
    typeof body.triggerEvent === "string" ? body.triggerEvent.slice(0, 100) : "UNKNOWN";
  const bookingUid =
    typeof body.payload?.uid === "string"
      ? body.payload.uid
      : typeof body.payload?.bookingId === "string" || typeof body.payload?.bookingId === "number"
        ? String(body.payload.bookingId)
        : null;

  if (!bookingUid) {
    return NextResponse.json({ error: "Webhook payload has no booking identifier" }, { status: 400 });
  }

  try {
    const eventId = createHash("sha256").update(rawBody).digest("hex");
    const sql = getDb();

    await sql`
      INSERT INTO public.portfolio_booking_events (
        event_id,
        booking_uid,
        event_type,
        booking_payload
      )
      VALUES (
        ${eventId},
        ${bookingUid},
        ${eventType},
        ${JSON.stringify(body)}
      )
      ON CONFLICT (event_id) DO NOTHING
    `;

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[calcom-webhook] Failed to persist booking event", error);
    return NextResponse.json({ error: "Unable to store booking event" }, { status: 503 });
  }
}
