"use client";

import { useEffect, useState } from "react";

const COUNTER_URL = "https://counterapi.com/api/www.frpboy.in/view/portfolio-home";
const SESSION_KEY = "frpboy-portfolio-visit-counted";

// This is deliberately a lightweight, public counter. Session deduplication is
// only a convenience; it is not an authentication or anti-abuse boundary.
let countedInThisRuntime = false;

type CounterResponse = {
  value?: number;
};

async function requestCount(readOnly: boolean): Promise<number> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8_000);

  try {
    const url = readOnly ? `${COUNTER_URL}?readOnly=true` : COUNTER_URL;
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Counter service returned HTTP ${response.status}`);
    }

    const data = (await response.json()) as CounterResponse;
    if (typeof data.value !== "number" || !Number.isFinite(data.value)) {
      throw new Error("Counter service returned an unexpected response");
    }

    return data.value;
  } finally {
    window.clearTimeout(timeout);
  }
}

function hasCountedThisSession(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    // Some privacy modes can deny storage access. Keep a runtime fallback so
    // React Strict Mode's repeated effect does not immediately double-count.
    return countedInThisRuntime;
  }
}

function markCountedThisSession(): void {
  countedInThisRuntime = true;
  try {
    window.sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // The counter still works when browser storage is unavailable.
  }
}

export default function VisitorCounter() {
  const [visits, setVisits] = useState<number | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadCount() {
      setStatus("loading");
      const alreadyCounted = hasCountedThisSession();

      // Mark before the request to avoid duplicate increments in Strict Mode.
      if (!alreadyCounted) markCountedThisSession();

      try {
        // If this session has already been counted, only read the current total.
        // If incrementing fails, fall back to a read-only request: the increment
        // may have succeeded even if its response was lost.
        let value: number;
        try {
          value = await requestCount(alreadyCounted);
        } catch (error) {
          if (alreadyCounted) throw error;
          value = await requestCount(true);
        }

        if (active) {
          setVisits(value);
          setStatus("ready");
        }
      } catch {
        if (active) setStatus("error");
      }
    }

    void loadCount();

    return () => {
      active = false;
    };
  }, [retryKey]);

  return (
    <div
      className="inline-flex min-h-10 items-center justify-center gap-3 border border-system-green/20 bg-system-green/[0.04] px-4 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/55"
      aria-label={
        status === "ready"
          ? `${visits?.toLocaleString()} visits`
          : status === "error"
            ? "Visit count temporarily unavailable"
            : "Visit count loading"
      }
    >
      <span className="flex items-center gap-2 text-system-green/80">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-system-green shadow-[0_0_8px_var(--system-green)]"
        />
        Visits
      </span>

      {status === "ready" ? (
        <span
          aria-live="polite"
          aria-atomic="true"
          className="min-w-[3ch] text-sm font-bold tabular-nums text-system-green"
        >
          {visits?.toLocaleString()}
        </span>
      ) : status === "error" ? (
        <button
          type="button"
          onClick={() => setRetryKey((value) => value + 1)}
          className="text-system-green underline decoration-system-green/40 underline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-system-green"
          aria-label="Retry loading visit count"
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
