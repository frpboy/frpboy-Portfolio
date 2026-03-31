"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const TransitionShock = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      // Create a pinned narrative pause
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: true,
      });

      // Animate the shock effect
      gsap.fromTo(
        containerRef.current,
        { backgroundColor: "#000" },
        {
          backgroundColor: "#fff",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 40%",
            end: "top 10%",
            scrub: true,
          }
        }
      );

      gsap.fromTo(
        textRef.current,
        { scale: 0.8, opacity: 0, filter: "blur(20px)" },
        {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 30%",
            end: "top top",
            scrub: true,
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative h-screen w-full flex items-center justify-center overflow-hidden z-20"
    >
      <div ref={textRef} className="container mx-auto px-6 text-center space-y-8">
        <div className="font-mono text-[10px] tracking-[0.5em] text-black/40 uppercase mb-4 animate-pulse">
          MAJOR_SYSTEM_REWRITE_DETECTED // 12.08.2025
        </div>
        <h2 className="text-6xl md:text-9xl font-black text-black tracking-[ -0.05em] leading-none uppercase">
          I RESIGNED.<br />
          <span className="text-black/20 italic">TO ARCHITECT.</span>
        </h2>
        <p className="max-w-2xl mx-auto font-mono text-[11px] text-black/60 leading-relaxed uppercase tracking-wider">
          On August 12, 2025, the manual repair loop ended. The architecture of the future required 100% CPU allocation.
          Switching from hardware maintenance at SISCO to full-system software engineering.
        </p>
        
        <div className="pt-12 text-black/10 font-mono text-[80px] leading-none select-none pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap">
          SYSTEM_EVOLUTION_IN_PROGRESS
        </div>
      </div>
    </div>
  );
};

export default TransitionShock;
