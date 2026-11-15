"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

const SPEED = 26;
const DWELL = 900;

export default function AutoRail({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const state = useRef({ pos: 0, dir: 1, last: 0, dwell: 0, holds: 0, visible: false, paused: false, raf: 0 });

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      state.current.paused = true;
      setPaused(true);
    }
  }, []);

  const kick = useCallback(() => {
    const s = state.current;
    const el = ref.current;
    if (!el) return;
    const running = () => !s.paused && s.holds === 0 && s.visible && !document.hidden && el.scrollWidth - el.clientWidth > 2;
    const frame = (t: number) => {
      s.raf = 0;
      if (!running()) {
        s.last = 0;
        return;
      }
      if (!s.last) s.last = t;
      const dt = Math.min(t - s.last, 64);
      s.last = t;
      if (t >= s.dwell) {
        if (Math.abs(el.scrollLeft - s.pos) > 2) s.pos = el.scrollLeft;
        s.pos += (s.dir * SPEED * dt) / 1000;
        const max = el.scrollWidth - el.clientWidth;
        if (s.pos >= max) {
          s.pos = max;
          s.dir = -1;
          s.dwell = t + DWELL;
        } else if (s.pos <= 0) {
          s.pos = 0;
          s.dir = 1;
          s.dwell = t + DWELL;
        }
        el.scrollLeft = s.pos;
      }
      s.raf = requestAnimationFrame(frame);
    };
    if (!s.raf && running()) {
      s.last = 0;
      s.raf = requestAnimationFrame(frame);
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const s = state.current;
    const sync = () => {
      s.pos = el.scrollLeft;
    };
    const hold = () => {
      s.holds = 1;
    };
    const release = () => {
      if (s.holds) {
        s.holds = 0;
        sync();
        kick();
      }
    };
    const enter = (e: Event) => {
      if ((e as PointerEvent).pointerType === "mouse") s.holds = Math.max(s.holds, 1);
    };
    const leave = (e: Event) => {
      if ((e as PointerEvent).pointerType !== "mouse") return;
      s.holds = 0;
      sync();
      kick();
    };
    const focusIn = (e: Event) => {
      try {
        if ((e.target as HTMLElement).matches(":focus-visible")) s.holds = Math.max(s.holds, 1);
      } catch {}
    };
    const focusOut = () => {
      s.holds = 0;
      sync();
      kick();
    };
    const vis = () => {
      s.last = 0;
      kick();
    };
    el.addEventListener("pointerdown", hold);
    el.addEventListener("touchstart", hold, { passive: true });
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    window.addEventListener("touchend", release, { passive: true });
    window.addEventListener("touchcancel", release, { passive: true });
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("focusin", focusIn);
    el.addEventListener("focusout", focusOut);
    el.addEventListener("wheel", sync, { passive: true });
    document.addEventListener("visibilitychange", vis);
    const io = new IntersectionObserver(
      (entries) => {
        s.visible = entries[0].isIntersecting;
        s.last = 0;
        sync();
        kick();
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(s.raf);
      s.raf = 0;
      el.removeEventListener("pointerdown", hold);
      el.removeEventListener("touchstart", hold);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("touchend", release);
      window.removeEventListener("touchcancel", release);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("focusin", focusIn);
      el.removeEventListener("focusout", focusOut);
      el.removeEventListener("wheel", sync);
      document.removeEventListener("visibilitychange", vis);
    };
  }, [kick]);

  return (
    <>
      <div ref={ref} role="group" aria-label={label} className={className}>
        {children}
      </div>
      <button
        type="button"
        aria-pressed={paused}
        onClick={() => {
          state.current.paused = !state.current.paused;
          setPaused(state.current.paused);
          state.current.pos = ref.current?.scrollLeft ?? 0;
          kick();
        }}
        className="mt-1 rounded-full border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/55 hover:border-white/40 hover:text-white focus-visible:border-white/40"
      >
        {paused ? "Play auto-scroll" : "Pause auto-scroll"}
      </button>
    </>
  );
}
