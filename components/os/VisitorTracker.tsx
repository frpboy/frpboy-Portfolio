"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const VISITOR_ID_KEY = "frpboy:portfolio:visitor-id";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (
      !pathname.startsWith("/") ||
      pathname.startsWith("/api/") ||
      pathname.startsWith("/_next/")
    ) {
      return;
    }

    // Survives React Strict Mode's effect replay but allows A -> B -> A
    // navigation to count the second visit to A as another page view.
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    const visitorId = getVisitorId();
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8_000);

    void fetch("/api/visitors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
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
        window.dispatchEvent(
          new CustomEvent("frpboy:visitor-count-updated", { detail: payload }),
        );
      })
      .catch(() => {
        // Analytics must never block the portfolio. A later navigation retries.
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      // A page-view event represents a navigation that has already happened.
      // Do not abort it when the user immediately navigates again.
    };
  }, [pathname]);

  return null;
}
