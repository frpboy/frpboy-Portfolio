"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type BootPhase = "powerOn" | "post" | "bootLog" | "initializing" | "ready" | "complete";

type BootLine = {
  label: string;
  detail: string;
};

const SESSION_KEY = "portfolio_os_intro_seen";

// Decorative startup copy mirrors real sections of this portfolio; it is not hardware diagnostics.
const postLines: BootLine[] = [
  { label: "POWER STATE", detail: "ONLINE" },
  { label: "DISPLAY INTERFACE", detail: "READY" },
  { label: "RENDERING ENGINE", detail: "INITIALIZING" },
  { label: "APPLICATION ENVIRONMENT", detail: "DETECTED" },
];

const bootLines = [
  "Initializing Portfolio OS",
  "Loading interface components",
  "Preparing professional timeline",
  "Registering selected project directory",
  "Preparing navigation systems",
  "Initializing visual environment",
  "Application interface ready",
];

type ScheduledTimer = number;

export default function SystemLoader() {
  const [phase, setPhase] = useState<BootPhase>("complete");
  const [visiblePostLines, setVisiblePostLines] = useState(0);
  const [visibleBootLines, setVisibleBootLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const timers = useRef<ScheduledTimer[]>([]);
  const completeRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let decisionFrame = 0;
    const clearTimers = () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current = [];
    };
    const complete = () => {
      if (cancelled || completeRef.current) return;
      completeRef.current = true;
      clearTimers();
      setProgress(100);
      setPhase("complete");
    };
    const schedule = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => {
        timers.current = timers.current.filter((item) => item !== timer);
        if (!cancelled && !completeRef.current) callback();
      }, delay);
      timers.current.push(timer);
    };

    decisionFrame = window.requestAnimationFrame(() => {
      if (cancelled) return;

      // Reduced motion and session policy are decided only on the client.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        complete();
        return;
      }

      try {
        if (window.sessionStorage.getItem(SESSION_KEY)) {
          complete();
          return;
        }
        // Session-scoped: do not replay on refresh or same-tab navigation.
        // Persist before playback to guard against duplicate effects in Strict Mode.
        window.sessionStorage.setItem(SESSION_KEY, "true");
      } catch {
        // Storage may be disabled; allow this page view and still clean up normally.
      }

      setShouldAnimate(true);
      setPhase("powerOn");
      setProgress(4);

      schedule(() => {
        setPhase("post");
        setProgress(16);
        postLines.forEach((_, index) => {
          schedule(() => setVisiblePostLines(index + 1), 95 + index * 115);
        });

        schedule(() => {
          setPhase("bootLog");
          setProgress(34);
          bootLines.forEach((_, index) => {
            schedule(() => {
              setVisibleBootLines(index + 1);
              setProgress(34 + Math.round(((index + 1) / bootLines.length) * 46));
            }, 85 + index * 190);
          });

          schedule(() => {
            setPhase("initializing");
            setProgress(88);
          }, 1_520);

          schedule(() => {
            setPhase("ready");
            setProgress(100);
          }, 2_020);

          schedule(complete, 2_420);
        }, 760);
      }, 420);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(decisionFrame);
      clearTimers();
    };
  }, []);

  const stageLabel: Record<Exclude<BootPhase, "complete">, string> = {
    powerOn: "POWERING DISPLAY",
    post: "SYSTEM IDENTIFICATION / POST",
    bootLog: "BOOT SEQUENCE",
    initializing: "INITIALIZING ENVIRONMENT",
    ready: "SYSTEM READY",
  };

  return (
    <AnimatePresence>
      {phase !== "complete" && (
        <motion.div
          key="portfolio-os-boot"
        role="status"
        aria-live="polite"
        aria-label="Portfolio OS is starting"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.32, ease: "easeOut" } }}
        className="portfolio-boot fixed inset-0 z-[100] flex min-h-[100svh] items-center justify-center overflow-hidden bg-black px-4 py-10 font-mono sm:px-6"
      >
        <div aria-hidden="true" className="portfolio-boot__scanlines pointer-events-none absolute inset-0" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,156,0.055),transparent_68%)]" />

        <div className="relative z-10 w-full max-w-2xl">
          <div className="mb-6 flex items-center justify-between gap-3 border-b border-white/10 pb-3 text-[9px] uppercase tracking-[0.18em] text-white/35 sm:text-[10px] sm:tracking-[0.24em]">
            <span className="truncate">FRPBOY <span className="text-system-green/70">{"//"}</span> PORTFOLIO OS</span>
            <span className="shrink-0">BOOT SEQUENCE 01</span>
          </div>

          <AnimatePresence mode="wait">
            {phase === "powerOn" && (
              <motion.section
                key="power"
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.24 }}
                className="flex min-h-[280px] flex-col items-center justify-center gap-7 py-10 text-center"
              >
                <div className={shouldAnimate ? "portfolio-boot__power relative h-12 w-12 rounded-full border border-system-green/45" : "relative h-12 w-12 rounded-full border border-system-green/45"}>
                  <span className="absolute inset-[7px] rounded-full border border-system-green/25" />
                  <span className="absolute left-1/2 top-[-5px] h-5 w-px -translate-x-1/2 bg-system-green shadow-[0_0_12px_rgba(0,255,156,0.8)]" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-system-green/75">Display online</p>
                  <p className="text-xs text-white/55">FRPBOY / PORTFOLIO OS</p>
                </div>
                <div className="h-px w-28 overflow-hidden bg-white/10">
                  <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.34 }} className="h-full origin-left bg-system-green" />
                </div>
              </motion.section>
            )}

            {phase === "post" && (
              <motion.section
                key="post"
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.22 }}
                className="min-h-[280px] py-4"
              >
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white sm:text-xs">FRPBOY PORTFOLIO SYSTEM</p>
                <p className="mb-5 text-[9px] uppercase tracking-[0.2em] text-white/40 sm:text-[10px]">Custom web environment</p>
                <div className="mb-4 h-px bg-white/10" />
                <div className="space-y-3" aria-hidden="true">
                  {postLines.slice(0, visiblePostLines).map((line) => (
                    <motion.div
                      key={line.label}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3 text-[9px] sm:text-[11px]"
                    >
                      <span className="min-w-0 break-words text-white/60">{line.label}</span>
                      <span className="shrink-0 text-system-green"><span className="mr-2 text-system-green/50">···</span>{line.detail}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {phase === "bootLog" && (
              <motion.section
                key="log"
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.22 }}
                className="min-h-[280px] py-4"
              >
                <div className="mb-5 flex items-center justify-between gap-3 text-[9px] uppercase tracking-[0.18em] text-white/35 sm:text-[10px]">
                  <span>Initialization log</span>
                  <span>{String(visibleBootLines).padStart(2, "0")} / {String(bootLines.length).padStart(2, "0")}</span>
                </div>
                <div className="space-y-3" aria-hidden="true">
                  {bootLines.slice(0, visibleBootLines).map((line) => (
                    <motion.p
                      key={line}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-2 text-[10px] leading-relaxed text-white/65 sm:gap-3 sm:text-xs"
                    >
                      <span className="shrink-0 text-system-green">[ OK ]</span>
                      <span className="min-w-0 break-words">{line}</span>
                    </motion.p>
                  ))}
                  {visibleBootLines < bootLines.length && (
                    <motion.span
                      aria-hidden="true"
                      animate={{ opacity: [0.35, 1, 0.35] }}
                      transition={{ duration: 1.1, repeat: Infinity }}
                      className="mt-1 inline-block h-3 w-1.5 bg-system-green"
                    />
                  )}
                </div>
              </motion.section>
            )}

            {(phase === "initializing" || phase === "ready") && (
              <motion.section
                key="identity"
                initial={{ opacity: 0, y: 9 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.28 }}
                className="flex min-h-[280px] flex-col justify-center py-8"
              >
                <p className="mb-4 text-[9px] uppercase tracking-[0.28em] text-system-green/65 sm:text-[10px]">Personal computing environment</p>
                <h1 className="text-5xl font-black uppercase leading-[0.9] tracking-[-0.07em] text-white sm:text-7xl md:text-8xl">FRPBOY</h1>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.22em] text-system-green sm:text-sm">Portfolio OS</p>
                <p className="mt-4 text-[10px] text-white/45 sm:text-xs">Software <span className="text-white/20">·</span> Systems <span className="text-white/20">·</span> Automation</p>
                <div className="mt-10 flex items-center justify-between gap-3 text-[9px] uppercase tracking-[0.16em] sm:text-[10px]">
                  <span className={phase === "ready" ? "text-system-green" : "text-white/45"}>
                    {phase === "ready" ? "SYSTEM READY / WELCOME" : "INITIALIZING ENVIRONMENT"}
                  </span>
                  <span className="shrink-0 text-white/35">{phase === "ready" ? "100%" : "LOADING"}</span>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          <div className="mt-2 h-px w-full overflow-hidden bg-white/10" aria-hidden="true">
            <motion.div
              className="h-full origin-left bg-system-green shadow-[0_0_9px_rgba(0,255,156,0.45)]"
              animate={{ scaleX: progress / 100 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-[8px] uppercase tracking-[0.17em] text-white/25 sm:text-[9px]">
            <span className="truncate">{stageLabel[phase]}</span>
            <span className="shrink-0">READY WHEN YOU ARE</span>
          </div>
        </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
