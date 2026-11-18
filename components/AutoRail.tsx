"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

const SPEED = 26;
const DWELL = 900;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: (matches: boolean) => void) {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => {};
  }

  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  if (typeof media.addEventListener !== "function") {
    return () => {};
  }

  const handleChange = () => onChange(media.matches);
  media.addEventListener("change", handleChange);
  return () => media.removeEventListener("change", handleChange);
}

function getReducedMotionSnapshot() {
  return typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getServerReducedMotionSnapshot() {
  return false;
}

export default function AutoRail({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({ pos: 0, dir: 1, last: 0, dwell: 0, holds: 0, visible: false, paused: false, raf: 0 });
  const manuallyPausedRef = useRef(false);

  const kick = useCallback(() => {
    const s = state.current;
    const el = ref.current;
    if (!el) return;
    const running = () => !s.paused && s.holds === 0 && s.visible && !document.hidden && el.scrollW¶»§q«^