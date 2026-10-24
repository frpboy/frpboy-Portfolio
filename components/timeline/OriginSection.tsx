"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function OriginSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.from(".origin-reveal", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 16,
        stagger: 0.1,
        duration: 0.55,
      });
    }, sectionRef);
    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="origin"
      aria-labelledby="origin-heading"
      className="noise-bg relative flex w-full flex-col justify-center overflow-hidden bg-black px-5 py-16 sm:px-8 md:px-16 md:py-20"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-8 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <div className="space-y-4">
          <div className="origin-reveal flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.28em] text-white/65">
            <span aria-hidden="true" className="h-px w-10 bg-system-blue/60" />
            L01 // THE STARTING POINT
          </div>
          <h2 id="origin-heading" className="origin-reveal text-3xl font-black leading-[0.98] tracking-tight text-white sm:text-5xl md:text-6xl">
            Curiosity<br />
            <span className="text-transparent" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.45)" }}>became method.</span>
          </h2>
        </div>

        <div className="origin-reveal space-y-4">
          <p className="max-w-3xl text-lg font-light leading-relaxed text-white/70 sm:text-xl md:text-2xl">
            Hardware troubleshooting taught me to isolate causes and prove a fix. Software engineering
            extended that discipline into applications, APIs, and repeatable workflows that can be tested
            and maintained.
          </p>
          <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-system-green/90 sm:text-xs">
            Device diagnostics <span className="text-white/35">→</span> workflow automation <span className="text-white/35">→</span> full-stack systems
          </p>
        </div>
      </div>
    </section>
  );
}
