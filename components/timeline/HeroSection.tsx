"use client";

import { useEffect, useRef } from "react";
import { ArrowDownToLine, ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";

const coreStack = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Flutter",
  "C# / .NET",
  "PostgreSQL",
];

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

      <div className="container relative z-10 mx-auto space-y-9 text-center sm:space-y-11">
        <div className="hero-text space-y-5">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex items-center justify-center gap-4 font-mono text-[9px] uppercase tracking-[0.4em] text-white/35 sm:text-[10px] sm:tracking-[0.5em]">
              <span aria-hidden="true" className="h-px w-7 bg-white/15 sm:w-8" />
              Systems built from curiosity
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

        <div className="hero-text flex flex-col items-center justify-center gap-6 pt-2 md:flex-row md:gap-10">
          <p className="max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
            I build full-stack applications and workflow automation that turn recurring,
            error-prone tasks into reliable systems people can use. My approach starts with
            evidence, clear logic, and testing—not guesswork.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#featured-work"
              className="inline-flex min-h-11 items-center gap-3 border border-system-green/50 bg-system-green/[0.06] px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-system-green transition-colors hover:border-system-green hover:bg-system-green/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green"
            >
              Explore featured work <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
            <a
              href="/resume"
              className="inline-flex min-h-11 items-center gap-2 border border-white/15 px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-white/70 transition-colors hover:border-white/35 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green"
            >
              Resume <ArrowDownToLine aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="hero-text mx-auto w-full max-w-4xl border-t border-white/10 pt-5 text-left">
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[9px] uppercase tracking-[0.22em] text-white/35">
            <span className="text-system-green/80">Core stack</span>
            <span aria-hidden="true">/</span>
            <span>Build · Automate · Validate</span>
          </div>
          <ul aria-label="Core technologies" className="flex flex-wrap gap-2">
            {coreStack.map((technology) => (
              <li
                key={technology}
                className="border border-white/10 bg-white/[0.025] px-3 py-2 font-mono text-[10px] text-white/65 transition-colors hover:border-system-green/30 hover:text-white"
              >
                {technology}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div aria-hidden="true" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-white/20 sm:flex">
        <span className="h-7 w-px bg-gradient-to-b from-white/40 to-transparent" />
        <span className="font-mono text-[8px] uppercase tracking-[0.3em]">Scroll to explore</span>
      </div>
    </section>
  );
}
