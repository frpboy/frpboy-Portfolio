"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const bootLogEntries = [
  "Opening portfolio interface...",
  "Loading professional timeline...",
  "Preparing project registry...",
  "Portfolio ready.",
];

export default function SystemLoader() {
  const [shouldRender, setShouldRender] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsComplete(true);
      return;
    }

    try {
      if (window.sessionStorage.getItem("portfolio_os_intro_seen")) {
        setIsComplete(true);
        return;
      }
      window.sessionStorage.setItem("portfolio_os_intro_seen", "true");
    } catch {
      // Storage can be disabled. The intro may still run for this page view.
    }
    setShouldRender(true);
  }, []);

  useEffect(() => {
    if (!shouldRender) return;

    let index = 0;
    let completionTimer: number | undefined;
    const logInterval = window.setInterval(() => {
      if (index < bootLogEntries.length) {
        const next = bootLogEntries[index];
        setLogs((previous) => [...previous, next]);
        index += 1;
      } else {
        window.clearInterval(logInterval);
        completionTimer = window.setTimeout(() => setIsComplete(true), 250);
      }
    }, 230);

    return () => {
      window.clearInterval(logInterval);
      if (completionTimer !== undefined) window.clearTimeout(completionTimer);
    };
  }, [shouldRender]);

  if (!shouldRender || isComplete) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="portfolio-intro"
        role="status"
        aria-label="Opening portfolio"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black font-mono"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.22)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.025),rgba(0,0,118,0.03))] bg-[length:100%_3px,4px_100%]" />
        <div className="relative z-10 w-full max-w-lg space-y-2 px-6">
          <div className="mb-6 text-[10px] uppercase tracking-[0.3em] text-system-green/55">Portfolio interface // Intro</div>
          {logs.map((log, index) => (
            <motion.p
              key={log}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs leading-relaxed text-system-green sm:text-sm"
            >
              <span className="mr-3 text-system-green/45">[{String(index + 1).padStart(2, "0")}]</span>{log}
            </motion.p>
          ))}
          <motion.div
            aria-hidden="true"
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="mt-7 h-px w-12 bg-system-green"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
