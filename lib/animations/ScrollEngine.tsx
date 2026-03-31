"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Register ScrollTrigger early
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollEngineProps {
  children: React.ReactNode;
}

const ScrollEngine: React.FC<ScrollEngineProps> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 1. Initialize Lenis with optimized settings for responsiveness
    const lenis = new Lenis({
      duration: 1.2, // Snappier for productivity
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.4, // Boosted for Windows experience
      touchMultiplier: 1.4,
      infinite: false,
    });

    lenisRef.current = lenis;

    // 2. Connect ScrollTrigger to Lenis update
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // 3. Robust Ticker Sync using requestAnimationFrame directly for isolation
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 4. Connect GSAP ticker as secondary for plugin synchronization
    gsap.ticker.add((time) => {
      // Keep GSAP in sync but let lenis drive the loop
      ScrollTrigger.update();
    });
    
    gsap.ticker.lagSmoothing(0);

    // 5. Force global scroll-behavior to auto
    document.documentElement.style.scrollBehavior = "auto";

    // 6. Dynamic Height Handling (Crucial for NextJS/Responsive)
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    });
    
    resizeObserver.observe(document.body);

    // 7. Refresh on Load & Interaction (Fail-Safe)
    const handleLoad = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    window.addEventListener("load", handleLoad);
    window.addEventListener("resize", handleLoad);
    
    // Initial refresh sequence
    setTimeout(handleLoad, 500);
    setTimeout(handleLoad, 2000); // Fail-safe for late-loading images

    // 8. Cleanup
    return () => {
      lenis.destroy();
      resizeObserver.disconnect();
      window.removeEventListener("load", handleLoad);
      window.removeEventListener("resize", handleLoad);
    };
  }, []);

  return <>{children}</>;
};

export default ScrollEngine;
