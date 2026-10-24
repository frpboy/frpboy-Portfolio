"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { CircuitBoard, Workflow, Blocks } from "lucide-react";

const pillars = [
  {
    icon: CircuitBoard,
    title: "Diagnose",
    label: "Hardware and troubleshooting",
    description: "Trace a symptom, isolate likely causes, test assumptions, and verify the fix instead of treating the first explanation as fact.",
  },
  {
    icon: Workflow,
    title: "Automate",
    label: "APIs, pipelines & workflow logic",
    description: "Connect APIs, data stores, validation rules, and business workflows into repeatable systems that are easier to inspect and maintain.",
  },
  {
    icon: Blocks,
    title: "Engineer",
    label: "Full-stack applications",
    description: "Connect interfaces, APIs, data models, and operational needs into software that is maintainable and easier to inspect.",
  },
];

export default function LogicSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.from(".logic-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
        y: 28,
        opacity: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: "power2.out",
      });
    }, sectionRef);
    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="approach"
      className="scroll-mt-14 relative flex min-h-[78svh] w-full flex-col items-center justify-center overflow-hidden bg-black px-5 py-20 sm:px-8"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.035]">
        <div className="absolute inset-x-0 top-1/4 h-px bg-white" />
        <div className="absolute inset-x-0 top-2/4 h-px bg-white" />
        <div className="absolute inset-x-0 top-3/4 h-px bg-white" />
        <div className="absolute inset-y-0 left-1/4 w-px bg-white" />
        <div className="absolute inset-y-0 left-2/4 w-px bg-white" />
        <div className="absolute inset-y-0 left-3/4 w-px bg-white" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl space-y-16">
        <header className="space-y-6 text-center">
          <div className="flex items-center justify-center gap-4 font-mono text-[9px] uppercase tracking-[0.3em] text-white/70 sm:gap-6 sm:text-[10px] sm:tracking-[0.5em]">
            <span aria-hidden="true" className="h-px w-8 bg-white/25 sm:w-12" />
            L06-L08 // THE ENGINEERING APPROACH
            <span aria-hidden="true" className="h-px w-8 bg-white/25 sm:w-12" />
          </div>
          <h2 className="text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl md:text-6xl">
            Hardware roots.<br />
            <span className="italic text-white/45">Software systems.</span>
          </h2>
          <p className="mx-auto max-w-3xl pt-2 text-sm leading-relaxed tracking-wide text-white/75 sm:text-base">
            The tools changed, but the method stayed consistent: understand the system,
            make the logic explicit, then test the result.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, label, description }) => (
            <article
              key={title}
              className="logic-card group border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-system-green/35 hover:bg-white/[0.035] sm:p-8"
            >
              <div className="mb-7 flex h-12 w-12 items-center justify-center border border-white/10 text-system-green transition-colors group-hover:border-system-green/40 group-hover:bg-system-green/10">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/75">{label}</p>
              <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">{title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-white/70">{description}</p>
            </article>
          ))}
        </div>

        <div className="border border-white/10 bg-white/[0.025] p-5 sm:p-7">
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              ["Evidence", "Start with observations, logs, and reproducible symptoms."],
              ["Maintainability", "Prefer explicit rules and understandable changes over clever shortcuts."],
              ["Follow-through", "Validate the change, record the limits, and leave a clear handoff."],
            ].map(([title, description]) => (
              <div key={title} className="space-y-2">
                <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-system-green/80">{title}</h3>
                <p className="text-sm leading-relaxed text-white/70">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
