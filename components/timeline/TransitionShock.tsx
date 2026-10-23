"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function TransitionShock() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!containerRef.current || !textRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=75%",
        pin: true,
        scrub: true,
      });
      gsap.fromTo(
        containerRef.current,
        { backgroundColor: "#000000" },
        {
          backgroundColor: "#f5f5f5",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 45%",
            end: "top 5%",
            scrub: true,
          },
        }
      );
      gsap.fromTo(
        textRef.current,
        { scale: 0.96, opacity: 0.4, filter: "blur(8px)" },
        {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 35%",
            end: "top top",
            scrub: true,
          },
        }
      );
    }, containerRef);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      aria-labelledby="transition-title"
      className="relative flex min-h-[85svh] w-full items-center justify-center overflow-hidden bg-black px-5 py-24 sm:px-8"
    >
      <div ref={textRef} className="mx-auto w-full max-w-6xl space-y-8 text-center">
        <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-white/45 sm:text-[10px]">
          A change in approach
        </p>
        <h2 id="transition-title" className="text-5xl font-black uppercase leading-[0.92] tracking-tighter text-white sm:text-7xl md:text-9xl">
          From diagnosis.<br />
          <span className="italic text-white/25">To delivery.</span>
        </h2>
        <p className="mx-auto max-w-2xl font-mono text-xs uppercase leading-relaxed tracking-wide text-white/60 sm:text-sm">
          Troubleshooting taught me how to isolate a fault. Software engineering added the next
          challenge: build a solution that can be repeated, inspected, and maintained.
        </p>
        <div aria-hidden="true" className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[clamp(1.5rem,7vw,5rem)] font-mono font-bold uppercase tracking-tighter text-white/[0.06]">
          BUILD / TEST / IMPROVE
        </div>
      </div>
    </section>
  );
}
