"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Zap } from "lucide-react";

export default function SparkSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.fromTo(
        ".spark-item",
        { opacity: 0, y: "15vh" },
        {
          opacity: 0.55,
          y: "-20vh",
          duration: 5,
          repeat: -1,
          ease: "none",
          stagger: { amount: 2 },
        }
      );
      gsap.from(".spark-content", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom center",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 35,
        duration: 0.6,
      });
    }, sectionRef);
    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="spark"
      className="noise-bg relative flex min-h-[95svh] w-full items-center justify-center overflow-hidden bg-black px-5 py-24 sm:px-8"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-15">
        {Array.from({ length: 22 }, (_, index) => (
          <span
            key={index}
            className="spark-item absolute top-0 h-24 w-px bg-system-green/60"
            style={{ left: (index * 4.5 + 1) + "%" }}
          />
        ))}
      </div>

      <div className="spark-content relative z-10 mx-auto w-full max-w-6xl space-y-12">
        <div className="max-w-4xl space-y-5">
          <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.35em] text-system-green sm:text-[10px]">
            <Zap aria-hidden="true" size={13} />
            L03 // THE PIVOT
          </div>
          <h2 className="text-5xl font-black uppercase leading-[0.9] tracking-tighter text-white sm:text-7xl md:text-8xl">
            Repetition<br />
            <span className="italic text-system-green">became automation.</span>
          </h2>
          <div aria-hidden="true" className="h-px bg-white/10" />
        </div>

        <div className="grid items-start gap-10 md:grid-cols-[1.25fr_0.75fr] md:gap-16">
          <div className="space-y-5">
            <p className="font-mono text-base leading-relaxed text-system-green/80 sm:text-xl">
              The next step was not just fixing a system. It was designing a repeatable solution.
            </p>
            <p className="text-sm leading-relaxed text-white/50 sm:text-base">
              Working with operational processes made the cost of repeated manual tasks visible.
              Small automations—scripts, data handling, APIs, and workflow rules—became a way to
              remove avoidable repetition and make the same steps easier to run consistently.
            </p>
            <p className="text-sm leading-relaxed text-white/50 sm:text-base">
              That mindset now carries into full-stack development: understand the problem,
              define the data flow, handle failure cases, and make the outcome easy to inspect.
            </p>
          </div>

          <aside className="relative border border-system-green/20 bg-system-green/[0.025] p-6 sm:p-8">
            <div aria-hidden="true" className="absolute -right-4 -top-4 h-20 w-20 bg-system-green/10 blur-3xl" />
            <div className="relative space-y-6">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-system-green/70">Working principles</div>
              {[
                ["Trace the input", "Understand what enters the workflow."],
                ["Make the logic explicit", "Turn assumptions into rules and checks."],
                ["Verify the output", "Confirm the result instead of assuming success."],
              ].map(([title, description]) => (
                <div key={title} className="space-y-2 border-l border-system-green/25 pl-4">
                  <h3 className="text-sm font-semibold text-white/75">{title}</h3>
                  <p className="text-xs leading-relaxed text-white/40">{description}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
