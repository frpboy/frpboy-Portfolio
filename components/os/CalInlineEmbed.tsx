"use client";

import { useEffect, useRef } from "react";

type CalFn = ((...args: unknown[]) => void) & { loaded?: boolean; ns?: Record<string, unknown>; q?: unknown[] };

declare global {
  interface Window {
    Cal?: CalFn;
  }
}

const EMBED_SRC = "https://app.cal.com/embed/embed.js";

function loadCal(): CalFn {
  if (window.Cal) return window.Cal;
  // Official Cal.com embed loader: queues calls until embed.js is ready.
  const queue: unknown[] = [];
  const cal = ((...args: unknown[]) => {
    queue.push(args);
  }) as CalFn;
  cal.q = queue;
  cal.ns = {};
  cal.loaded = true;
  window.Cal = cal;
  const script = document.createElement("script");
  script.src = EMBED_SRC;
  script.async = true;
  document.head.appendChild(script);
  return cal;
}

export default function CalInlineEmbed({ calLink }: { calLink: string }) {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const cal = loadCal();
    cal("init", { origin: "https://app.cal.com" });
    cal("inline", {
      elementOrSelector: "#portfolio-cal-inline",
      calLink,
      layout: "month_view",
      config: { theme: "dark" },
    });
    cal("ui", {
      theme: "dark",
      hideEventTypeDetails: false,
      layout: "month_view",
      cssVarsPerTheme: {
        dark: { "cal-brand": "#00ff9c", "cal-bg": "#000000", "cal-bg-emphasis": "#0a0f0c" },
        light: { "cal-brand": "#00ff9c" },
      },
    });
  }, [calLink]);

  return <div id="portfolio-cal-inline" className="mt-6 min-h-[560px] w-full overflow-auto border border-white/10 bg-black" />;
}
