"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SystemLoader() {
  const [shouldRender, setShouldRender] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Check if user has already bolted in this session
    const hasBooted = sessionStorage.getItem("rahul_os_booted");
    if (hasBooted) {
      setIsComplete(true);
      setShouldRender(false);
    } else {
      setShouldRender(true);
      sessionStorage.setItem("rahul_os_booted", "true");
    }
  }, []);

  if (!shouldRender && isComplete) return null;
  if (!shouldRender) return null;
  
  const bootLogEntries = [
    "Initializing Rahul OS v15.0...",
    "Loading Kernel 0.0.1-origin...",
    "Mounting systems/evolution...",
    "Checking hardware/soul...",
    "Verifying Logic & Trace...",
    "System Ready."
  ];

  useEffect(() => {
    let index = 0;
    const logInterval = setInterval(() => {
      if (index < bootLogEntries.length) {
        setLogs(prev => [...prev, bootLogEntries[index]]);
        index++;
      } else {
        clearInterval(logInterval);
        setTimeout(() => setIsComplete(true), 800);
      }
    }, 450);

    return () => clearInterval(logInterval);
  }, []);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black font-mono overflow-hidden"
        >
          {/* Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%]" />
          
          <div className="relative z-10 w-full max-w-lg px-8">
            <div className="space-y-2">
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-system-green/50 text-xs">[{i}]</span>
                  <span className="text-system-green text-sm tracking-tight">{log}</span>
                </motion.div>
              ))}
              
              {logs.length < bootLogEntries.length && (
                <div className="flex items-center gap-3">
                  <span className="text-system-green/50 text-xs">[*]</span>
                  <span className="w-2 h-4 bg-system-green animate-pulse" />
                </div>
              )}
            </div>
            
            <div className="mt-12 h-1 w-full bg-white/5 overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: "100%" }}
                 transition={{ duration: bootLogEntries.length * 0.45, ease: "linear" }}
                 className="h-full bg-system-green shadow-[0_0_10px_#00FF9C]"
               />
            </div>
          </div>

          {/* Glitch Overlay Layers */}
          <motion.div 
            animate={{ opacity: [0, 0.05, 0] }}
            transition={{ repeat: Infinity, duration: 0.2 }}
            className="absolute inset-0 bg-red-500/20 mix-blend-screen pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
