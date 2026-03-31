"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

const LOG_MESSAGES = [
  "INITIALIZING_NARRATIVE_KERNEL...",
  "DECOMPRESSING_STORY_DATA_V2.0",
  "L0_ORIGIN: SUCCESS",
  "L0_ORIGIN: SUCCESS // THIRUVALLA_KERN",
  "L3_STRUGGLE: ANALYZING_GRIT...",
  "WARNING: SYSTEM_OVERLOAD_AT_2022",
  "I_QUIT: MANDATORY_REBOOT_TRIGGERED",
  "ACTIVE_HUB: PERINTHALMANNA_VERIFIED",
  "CORE_LOAD: CATERING_WORK_GRIND",
  "INSTALLING_ARCHITECT_CORE_9.0.1",
  "SUCCESS: ZERPAI_ERP_LOADED",
  "MONITORING_USER_SCROLL_PATTERN",
  "OPTIMIZING_GLOW_VECTORS...",
  "READY_FOR_CORE_CONNECTION",
  "SYSTEM_STABLE: 99.999%",
  "CHECKING_GIGABIT_LATENCY...",
  "LOG: NEW_ARCHITECTURE_DEPLOYED",
];

const SystemActivityLog = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const addLog = () => {
      const randomMsg = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
      const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const fullMsg = `[${timestamp}] ${randomMsg}`;
      
      setLogs(prev => [...prev.slice(-4), fullMsg]); // Keep last 5 logs
    };

    const interval = setInterval(addLog, 4000);
    addLog(); // Initial log

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
     if (containerRef.current) {
        gsap.fromTo(containerRef.current.lastChild as HTMLElement, 
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.5 }
        );
     }
  }, [logs]);

  return (
    <div 
      className="fixed bottom-12 left-6 z-[60] w-64 pointer-events-none hidden md:block"
      ref={containerRef}
    >
      <div className="space-y-1">
        {logs.map((log, i) => (
          <div 
            key={i} 
            className="font-mono text-[9px] text-system-green/40 whitespace-nowrap overflow-hidden transition-opacity duration-500"
            style={{ opacity: (i + 1) / logs.length }}
          >
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemActivityLog;
