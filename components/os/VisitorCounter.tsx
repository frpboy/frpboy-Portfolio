"use client";

import { useEffect, useState } from "react";

type VisitorStats = {
  totalUniqueVisitors?: unknown;
};

function readVisitorCount(payload: unknown): number | null {
  if (!payload || typeof payload !== "object" || !("totalUniqueVisitors" in payload)) {
    return null;
  }

  const value = Number((payload as VisitorStats).totalUniqueVisitors);
  return Number.isSafeInteger(value) && value >= 0 ? value : null;
}

export default function VisitorCounter() {
  const [visitors, setVisitors] = useState<number | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let requestVersion = 0;
    let active = true;

    const applyPayload = (payload: unknown) => {
      const count = readVisitorCount(payload);
      if (count === null) return;

      requestVersion += 1;
      setVisitors(count);
      setStatus("ready");
    };

    const handleTrackedVisit = (event: Event) => {
      applyPayload((event as CustomEvent<unknown>).detail);
    };

    window.addEventListener("frpboy:visitor-count-updated", handleTrackedVisit);

    const thisRequest = ++requestVersion;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8_000);

    setStatus("loading");

    void fetch("/api/visitors", {
      method: "GET",
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload: unknown = await response.json().catch(() => null);
        if (!response.ok) throw new Error("Visitor analytics is unavailable");
        return payload;
      })
      .then((payload) => {
        const count = readVisitorCount(payload);
        if (!active || thisRequest !== requestVersion) return;
        if (count === null) throw new Error("Visitor analytics returned an invalid count");
        setVisitors(count);
        setStatus("ready");
      })
      .catch(() => {
        if (active && thisRequest === requestVersion) setStatus("error");
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      active = false;
      window.removeEventListener("frpboy:visitor-count-updated", handleTrackedVisit);
      window.clearTimeout(timeout);
    };
  }, [retryKey]);

  return (
    <div
      className="inline-flex min-h-10 items-center justify-center gap-3 border border-system-green/20 bg-system-green/[0.04] px-4 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/55"
      aria-label={
        status === "ready"
          ? `${visitors?.toLocaleString()} unique visitors`
          : status === "error"
            ? "Visitor count temporarily unavailable"
            : "Visitor count loading"
      }
    >
      <span className="flex items-center gap-2 text-system-green/80">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-system-green shadow-[0_0_8px_var(--system-green)]"
        />
        Visitors
      </span>

      {status === "ready" ? (
        <span
          aria-live="polite"
          aria-atomic="true"
          className="min-w-[3ch] text-sm font-bold tabular-nums text-system-green"
        >
          {visitors?.toLocaleString()}
        </span>
      ) : status === "error" ? (
        <button
          type="button"
          onClick={() => setRetryKey((value) => value + 1)}
          className="text-system-green underline decoration-system-green/40 underline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-system-green"
          aria-label="Retry loading visitor count"
        >
          RETRY
        </button>
      ) : (
        <span className="min-w-[3ch] text-sm font-bold tabular-nums text-system-green" aria-live="polite">
          …
        </span>
      )}
    </div>
  );
}
