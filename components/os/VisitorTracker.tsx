"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const VISITOR_ID_KEY = "frpboy:portfolio:visitor-id";
const TRACKED_PREFIX = "frpboy:portfolio:tracked:";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const trackedInThisRuntime = new Set<string>();
let memoryVisitorId: string | null = null;

function createVisitorId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join("-");
}

function getVisitorId(): string {
  try {
    const stored = window.localStorage.getItem(VISITOR_ID_KEY);
    if (stored && UUID_PATTERN.test(stored)) return stored;

    const created = createVisitorId();
    window.localStorage.setItem(VISITOR_ID_KEY, created);
    return created;
  } catch {
    memoryVisitorId ??= createVisitorId();
    return memoryVisitorId;
  }
}

function getReferrerHost(): string | null {
  if (!document.referrer) return null;
  try {
    return new URL(document.referrer).hostname || null;
  } catch {
    return null;
  }
}

export default function VisitorTracker() {
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    if (
      !pathname.startsWith("/") ||
      pathname.startsWith("/api/") ||
      pathname.startsWith("/_next/")
    ) {
      return;
    }

    const visitorId = getVisitorId();
    const trackingKey = TRACKED_PREFIX + visitorId + ":" + pathname;
    if (trackedInThisRuntime.has(trackingKey)) return;

    try {
      if (window.sessionStorage.getItem(trackingKey) === "1") {
        trackedInThisRuntime.add(trackingKey);
        return;
      }
    } catch {
      // In-memory deduplication protects React Strict Mode if storage is blocked.
    }

    trackedInThisRuntime.add(trackingKey);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8_000);

    void fetch("/api/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      cache: "no-store",
      signal: controller.signal,
      body: JSON.stringify({
        visitorId,
        pagePath: pathname,
        referrerHost: getReferrerHost(),
      }),
    })
      .then(async (response) => {
        const payload: unknown = await response.json().catch(() => null);
        if (!response.ok) throw new Error("Visitor analytics request failed");
        return payload;
      })
      .then((payload) => {
        try {
          window.sessionStorage.setItem(trackingKey, "1");
        } catch {
          // Storage is optional.
        }

        window.dispatchEvent(
          new CustomEvent("frpboy:visitor-count-updated", { detail: payload }),
        );
      })
      .catch(() => {
        trackedInThisRuntime.delete(trackingKey);
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      // Do not abort a page-view event simply because the user navigated away.
    };
  }, [pathname]);

  return null;
}
