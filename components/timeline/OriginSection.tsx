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
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
        },
      });
      timeline.fromTo(
        ".origin-reveal",
        { opacity: 0, x: -20, filter: "blur(5px)" },
        { opacity: 1, x: 0, filter: "blur(0px)", stagger: 0.12 }
      );
      timeline.fromTo(".origin-line", { scaleX: 0 }, { scaleX: 1, duration: 0.7 }, "<");
    }, sectionRef);
    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="origin"
      className="noise-bg relative flex min-h-[90svh] w-full flex-col justify-center overflow-hidden bg-black px-5 py-24 sm:px-8 md:px-16"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl space-y-12">
        <div className="space-y-5">
          <div className="origin-reveal flex items-center gap-4 font-mono text-[9px] uppercase tracking-[0.35em] text-white/35 sm:text-[10px]">
            <span aria-hidden="true" className="h-px w-10 bg-system-blue/50" />
            L01 // THE STARTING POINT
          </div>
          <h2 className="origin-reveal text-5xl font-black uppercase leading-[0.9] tracking-tighter text-white sm:text-7xl md:text-9xl">
            Curiosity<br />
            <span className="text-transparent" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.28)" }}>became method.</span>
          </h2>
          <div aria-hidden="true" className="origin-line h-px origin-left bg-system-blue/35" />
        </div>

        <p className="origin-reveal max-w-4xl text-xl font-light leading-relaxed tracking-tight text-white/55 sm:text-2xl md:text-3xl">
          Before building software, I learned to approach technology by asking a practical question:
          what failed, why did it fail, and how can I prove the fix worked?
        </p>

        <div className="grid gap-10 pt-4 md:grid-cols-2 md:gap-16">
          <article className="origin-reveal space-y-4 border-l border-system-blue/25 pl-5 sm:pl-8">
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-system-blue/70">01 / Observe</h3>
            <p className="text-sm leading-relaxed text-white/50 sm:text-base">
              Technical troubleshooting built a habit of separating symptoms from causes,
              checking assumptions, and following evidence before changing a system.
            </p>
          </article>
          <article className="origin-reveal space-y-4 border-l border-system-blue/25 pl-5 sm:pl-8">
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-system-blue/70">02 / Understand</h3>
            <p className="text-sm leading-relaxed text-white/50 sm:text-base">
              Working across device software, hardware, and practical workflows encouraged a
              systems view: the parts matter, but so do the connections between them.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
