"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.from(".hero-text", {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.25,
      });
    }, containerRef);
    return () => context.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[90svh] w-full flex-col items-center justify-center overflow-hidden bg-black px-5 py-24 sm:px-6"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,156,0.055)_0%,transparent_70%)]" />

      <div className="container relative z-10 mx-auto space-y-10 text-center sm:space-y-12">
        <div className="hero-text space-y-5">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex items-center justify-center gap-4 font-mono text-[9px] uppercase tracking-[0.4em] text-white/35 sm:text-[10px] sm:tracking-[0.5em]">
              <span aria-hidden="true" className="h-px w-7 bg-white/15 sm:w-8" />
              SYSTEMS BUILT FROM CURIOSITY
              <span aria-hidden="true" className="h-px w-7 bg-white/15 sm:w-8" />
            </div>
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.22em] text-system-green sm:text-[10px] sm:tracking-[0.3em]">
              Full Stack Developer &amp; Automation Specialist
            </p>
          </div>

          <h1 className="flex flex-col text-5xl font-black uppercase leading-[0.9] tracking-tighter text-white sm:text-7xl md:text-9xl">
            <span className="hero-text text-white/30">From finding</span>
            <span className="hero-text">the fault.</span>
            <span className="hero-text italic text-system-green">To building</span>
            <span className="hero-text">the system.</span>
          </h1>
        </div>

        <div className="hero-text flex flex-col items-center justify-center gap-7 pt-2 md:flex-row md:gap-12">
          <p className="max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
            A practical engineer with roots in hardware diagnostics and a focus on software,
            APIs, and automation—turning recurring problems into systems people can use.
          </p>
          <a
            href="#systems"
            className="inline-flex min-h-11 items-center gap-3 border border-system-green/35 px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-system-green transition-colors hover:border-system-green hover:bg-system-green/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green"
          >
            Explore selected work <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      <div aria-hidden="true" className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-white/20">
        <span className="h-10 w-px bg-gradient-to-b from-white/40 to-transparent" />
        <span className="font-mono text-[8px] uppercase tracking-[0.3em]">Scroll to explore</span>
      </div>
    </section>
  );
}
