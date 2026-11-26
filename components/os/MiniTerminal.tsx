"use client";

import { useEffect, useState } from "react";

// Small theme-matched terminal that replaces the robot-pet assistant
// launcher on frpboy.in. It "runs" on a loop: it types a command, prints
// the output, then moves to the next command. Styling follows the site
// theme: near-black surfaces (#050807 / #07110d), system-green accent
// (#00ff9c, via the system-green token) and mono type. Under
// prefers-reduced-motion it shows one static, completed session instead
// of animating. Presentational only: the surrounding <button> in
// PortfolioAssistant owns the click and the accessible label, so this is
// aria-hidden.

const SCRIPT: Array<{ cmd: string; out: string }> = [
  { cmd: "whoami", out: "frpboy // full-stack developer" },
  { cmd: "stack --list", out: "ts · react · python · flutter" },
  { cmd: "status", out: "systems online · ready to build" },
  { cmd: "ask --portfolio", out: "tap to ask about my work" },
];

export default function MiniTerminal() {
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState("");
  const [showOut, setShowOut] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (query.matches) {
      setReduced(true);
      setTyped(SCRIPT[0].cmd);
      setShowOut(true);
    }
  }, []);

  useEffect(() => {
    if (reduced) return;
    const current = SCRIPT[step];
    let timeout: number;

    if (!showOut) {
      if (typed.length < current.cmd.length) {
        timeout = window.setTimeout(() => {
          setTyped(current.cmd.slice(0, typed.length + 1));
        }, 55);
      } else {
        timeout = window.setTimeout(() => setShowOut(true), 350);
      }
    } else {
      timeout = window.setTimeout(() => {
        setStep((value) => (value + 1) % SCRIPT.length);
        setTyped("");
        setShowOut(false);
      }, 1800);
    }

    return () => window.clearTimeout(timeout);
  }, [typed, showOut, step, reduced]);

  const current = SCRIPT[step];

  return (
    <span aria-hidden="true" className="block w-[11.5rem] overflow-hidden text-left font-mono normal-case tracking-normal sm:w-[15rem]">
      {/* title bar */}
      <span className="flex items-center gap-1.5 border-b border-system-green/20 bg-white/[0.03] px-2.5 py-1.5">
        <span className="h-2 w-2 shrink-0 rounded-full bg-system-green/80" />
        <span className="h-2 w-2 shrink-0 rounded-full bg-system-green/40" />
        <span className="h-2 w-2 shrink-0 rounded-full bg-white/25" />
        <span className="ml-1 truncate text-[9px] uppercase tracking-[0.18em] text-white/50">
          frpboy@portfolio:~
        </span>
        <span className="ml-auto flex shrink-0 items-center gap-1 text-[8px] uppercase tracking-[0.18em] text-system-green/80">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-system-green" />
          live
        </span>
      </span>

      {/* session body: one command line + one output line, fixed height */}
      <span className="block bg-[#050807] px-2.5 py-2">
        <span className="block truncate text-[10px] leading-4 text-white/85 sm:text-[11px]">
          <span className="text-system-green">$&nbsp;</span>
          {typed}
          <span className="ml-0.5 inline-block h-3 w-[6px] animate-pulse bg-system-green align-[-2px]" />
        </span>
        <span className="block truncate text-[10px] leading-4 text-system-green/75 sm:text-[11px]">
          {showOut ? <>&gt;&nbsp;{current.out}</> : " "}
        </span>
      </span>
    </span>
  );
}
