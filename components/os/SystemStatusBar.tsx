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

export default function SystemStatusBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => setTime(formatTime(new Date()));
    updateTime();
    const timer = window.setInterval(updateTime, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-8 items-center justify-between border-b border-white/5 bg-black/85 px-4 backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-2">
        <Terminal aria-hidden="true" size={14} className="shrink-0 text-system-green" />
        <span className="system-text truncate font-bold uppercase text-white/65">Portfolio OS</span>
        <span className="hidden text-[10px] text-white/30 sm:inline">/ Rahul Muraleedharan</span>
      </div>
      <div className="ml-3 flex items-center gap-3 font-mono text-[10px] text-white/55">
        <span className="hidden uppercase tracking-widest text-white/30 sm:inline">Local time</span>
        <time aria-label="Local time">{time || "--:--"}</time>
      </div>
    </header>
  );
}
