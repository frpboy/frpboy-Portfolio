"use client";

import { useEffect, useState } from "react";

const COUNTER_URL = "https://counterapi.com/api/www.frpboy.in/view/portfolio-home";
// Client-side session deduplication is a convenience, not an anti-abuse boundary.
// The hosted public counter is approximate and can be manipulated by direct API requests.
const SESSION_KEY = "frpboy-portfolio-visit-counted";

export default function VisitorCounter() {
  const [visitors, setVisitors] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    async function loadCount() {
      const alreadyCounted = window.sessionStorage.getItem(SESSION_KEY) === "1";

      // Mark the session before requesting so React Strict Mode cannot double-count it.
      if (!alreadyCounted) {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      }

      try {
        const response = await fetch(
          alreadyCounted ? `${COUNTER_URL}?readOnly=true` : COUNTER_URL,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error(`Visitor counter returned ${response.status}`);
        }

        const data: { value?: number } = await response.json();

        if (typeof data.value === "number" && active) {
          setVisitors(data.value);
        }
      } catch {
        if (!alreadyCounted) {
          window.sessionStorage.removeItem(SESSION_KEY);
        }
      }
    }

    loadCount();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div
      className="inline-flex min-h-10 items-center justify-center gap-3 border border-system-green/20 bg-system-green/[0.04] px-4 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/55"
      aria-label={visitors === null ? "Visitor count loading" : `${visitors.toLocaleString()} visits`}
    >
      <span className="flex items-center gap-2 text-system-green/80">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-system-green shadow-[0_0_8px_var(--system-green)]" />
        Visitors
      </span>
      <span aria-live="polite" aria-atomic="true" className="min-w-[3ch] text-sm font-bold tabular-nums text-system-green">
        {visitors === null ? "—" : visitors.toLocaleString()}
      </span>
    </div>
  );
}
