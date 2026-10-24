"use client";

import { useEffect, useState } from "react";

const ACTIVITY_TRACE = [
  "NARRATIVE: HARDWARE_DIAGNOSTICS",
  "WORKFLOW: REPEATED_TASK_IDENTIFIED",
  "APPROACH: AUTOMATION_AND_VALIDATION",
  "REGISTRY: PUBLIC_LINKS_LABELLED",
  "MODE: DECORATIVE_ACTIVITY_TRACE",
];

export default function SystemActivityLog() {
  const [heroActive, setHeroActive] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero-section");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroActive(Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.8));
      },
      { threshold: [0, 0.8, 1] },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <aside
      aria-hidden="true"
      className={
        "pointer-events-none fixed bottom-10 left-5 z-30 hidden w-64 border-l border-system-green/20 pl-3 font-mono text-[8px] leading-relaxed text-white/25 transition-opacity duration-300 motion-reduce:transition-none md:block " +
        (heroActive ? "opacity-100" : "opacity-0")
      }
    >
      <div className="mb-2 text-[8px] uppercase tracking-[0.25em] text-system-green/70">Activity trace / illustrative</div>
      {ACTIVITY_TRACE.map((entry) => (
        <div key={entry} className="truncate">{">"} {entry}</div>
      ))}
    </aside>
  );
}
