"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

interface ScrollEngineProps {
  children: ReactNode;
}

export default function ScrollEngine({ children }: ScrollEngineProps) {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1,
      easing: (value) => Math.min(1, 1.001 - Math.pow(2, -10 * value)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      infinite: false,
    });

    let animationFrame = 0;
    let initialRefreshTimer: number | undefined;
    let fallbackRefreshTimer: number | undefined;

    const frame = (time: number) => {
      lenis.raf(time);
      animationFrame = window.requestAnimationFrame(frame);
    };

    const refresh = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    const handleScrollLock = (event: Event) => {
      const detail = (event as CustomEvent<{ locked?: boolean }>).detail;
      if (detail?.locked) lenis.stop();
      else lenis.start();
    };

    lenis.on("scroll", ScrollTrigger.update);
    animationFrame = window.requestAnimationFrame(frame);

    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(refresh)
      : null;
    resizeObserver?.observe(document.body);

    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);
    window.addEventListener("portfolio:scroll-lock", handleScrollLock);

    initialRefreshTimer = window.setTimeout(refresh, 300);
    fallbackRefreshTimer = window.setTimeout(refresh, 1200);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      if (initialRefreshTimer !== undefined) window.clearTimeout(initialRefreshTimer);
      if (fallbackRefreshTimer !== undefined) window.clearTimeout(fallbackRefreshTimer);
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("portfolio:scroll-lock", handleScrollLock);
      resizeObserver?.disconnect();
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
