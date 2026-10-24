"use client";

import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const navigation = [
  { href: "#approach", number: "01", label: "Approach" },
  { href: "#project-registry", number: "02", label: "Registry" },
  { href: "#contact", number: "03", label: "Contact" },
];

export default function SystemStatusBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => setTime(formatTime(new Date()));
    let timer = 0;

    const scheduleNextMinute = () => {
      const now = new Date();
      const millisecondsPastMinute = now.getSeconds() * 1_000 + now.getMilliseconds();
      const millisecondsUntilNextMinute = 60_000 - millisecondsPastMinute;

      timer = window.setTimeout(() => {
        updateTime();
        scheduleNextMinute();
      }, millisecondsUntilNextMinute);
    };

    updateTime();
    scheduleNextMinute();
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 grid h-11 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 border-b border-white/10 bg-black/95 px-2 backdrop-blur-md sm:gap-4 sm:px-4">
      <a
        href="#top"
        className="flex min-w-0 items-center gap-1.5 text-white/80 transition-colors hover:text-system-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green sm:gap-2"
        aria-label="Portfolio OS home"
      >
        <Terminal aria-hidden="true" size={14} className="shrink-0 text-system-green" />
        <span className="truncate font-mono text-[9px] font-bold uppercase tracking-wide sm:text-[10px]">Portfolio OS</span>
        <span className="hidden text-[10px] text-white/50 lg:inline">/ Rahul Muraleedharan</span>
      </a>

      <nav aria-label="Quick navigation" className="flex min-w-0 items-center justify-center gap-0.5 sm:gap-2">
        {navigation.map((item) => (
          <a
            key={item.href}
            href={item.href}
            aria-label={item.number + " " + item.label}
            className="inline-flex min-h-8 shrink-0 items-center justify-center gap-1 px-1.5 font-mono text-[8px] uppercase tracking-wide text-white/75 transition-colors hover:bg-white/[0.06] hover:text-system-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green sm:gap-1.5 sm:px-2 sm:text-[9px] md:px-2.5 md:text-[10px]"
          >
            <span className="text-system-green/90">{item.number}</span>
            <span className="hidden sm:inline">{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="flex items-center justify-end gap-1.5 font-mono text-[9px] text-white/70 sm:gap-2 sm:text-[10px]">
        <span className="hidden uppercase tracking-widest text-white/55 md:inline">Local time</span>
        <time aria-label="Local time">{time || "--:--"}</time>
      </div>
    </header>
  );
}
