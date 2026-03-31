"use client";

import React, { useState, useEffect } from 'react';
import { Terminal, Wifi, Battery, Monitor } from 'lucide-react';
import { clsx } from 'clsx';

export default function SystemStatusBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-8 px-4 flex items-center justify-between border-b border-white/5 bg-black/80 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 group cursor-pointer">
          <Terminal size={14} className="text-system-green group-hover:animate-pulse" />
          <span className="system-text uppercase font-bold text-white/50 group-hover:text-white transition-colors">
            Rahul OS <span className="hidden sm:inline">v15.0</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 opacity-50">
          <span className="w-1.5 h-1.5 rounded-full bg-system-green animate-pulse" />
          <span className="system-text text-[10px]">Kernel: Healthy</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-3 text-white/40">
           <Monitor size={12} className="hover:text-white cursor-help" />
           <Wifi size={12} className="hover:text-white cursor-none" />
           <Battery size={12} className="hover:text-white cursor-none" />
        </div>
        <div className="system-text text-white/80 font-medium">
          {formattedTime}
        </div>
      </div>
    </header>
  );
}
