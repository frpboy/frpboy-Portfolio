"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Table, LayoutGrid, Package } from "lucide-react";

const LogicSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Horizontal scrolling effect for grid items
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        }
      });

      tl.from(".logic-card", {
        y: 100,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out",
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-[160vh] w-full flex flex-col items-center justify-center bg-black overflow-hidden py-32 px-6"
      id="logic"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {/* Background Architectural Patterns (Subtle) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
         <div className="absolute inset-x-0 h-px top-1/4 bg-white" />
         <div className="absolute inset-x-0 h-px top-2/4 bg-white" />
         <div className="absolute inset-x-0 h-px top-3/4 bg-white" />
         <div className="absolute inset-y-0 w-px left-1/4 bg-white" />
         <div className="absolute inset-y-0 w-px left-2/4 bg-white" />
         <div className="absolute inset-y-0 w-px left-3/4 bg-white" />
      </div>

      <div className="container mx-auto space-y-32 max-w-6xl relative z-10">
        {/* Header Text */}
        <div className="space-y-6 text-center">
            <div className="flex items-center justify-center gap-6">
               <span className="w-12 h-[1px] bg-white/40" />
               <span className="text-white/60 font-mono text-[10px] tracking-[0.6em] uppercase">
                 L06-L08 // LOGIC_PIVOT // EVOLUTION
               </span>
               <span className="w-12 h-[1px] bg-white/40" />
            </div>
            
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-white leading-[0.85] uppercase architect-text">
              HARDWARE SOUL.<br />
              <span className="text-white/20 italic">SOFTWARE BRAIN.</span>
            </h2>
            <p className="text-sm md:text-lg text-white/40 max-w-2xl mx-auto font-light leading-relaxed uppercase tracking-tighter pt-8">
              Traveling 2,000km to Jagdalpur (Mobile Guru) and back to Perinthalmanna (SISCO Faculty). 
              Teaching 100s of students the silicon-logic and flashing hardware, only to realize my final form as a <span className="text-white">Systems Architect</span>.
            </p>
        </div>

        {/* Feature Grid - Narrative Pillars */}
         <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Package, title: "Hardware Guts", desc: "2019 – 2021: Mastered smartphone architecture, flashing ROMs, and IMEI logic in Chhattisgarh. Understanding the bridge between silicon and shell." },
              { icon: LayoutGrid, title: "The First Pivot", desc: "2022: Solved repetitive school tasks with a Python+Tesseract OCR tool. Realized that building a system helps thousands, while fixing a phone helps one." },
              { icon: Table, title: "Systems Dev", desc: "Present: Core Developer at Zabnix and VayuKshara. Orchestrating enterprise ERPs and AI agents. Replacing manual chaos with automated control." }
            ].map((item, i) => (
              <div 
                key={i} 
                className="logic-card group p-10 border border-white/5 bg-white/[0.02] backdrop-blur-2xl hover:border-white/20 transition-all hover:bg-white/[0.04]"
              >
                 <div className="p-4 w-fit border border-white/10 text-white mb-8 group-hover:bg-white group-hover:text-black transition-all glow-white">
                    <item.icon className="w-6 h-6" />
                 </div>
                 <h3 className="text-2xl font-black text-white mb-4 tracking-tighter uppercase">{item.title}</h3>
                 <p className="text-white/40 text-[11px] leading-relaxed font-mono uppercase tracking-wider">{item.desc}</p>
              </div>
            ))}
         </div>

        {/* Footer info: Statistical Matrix */}
        <div className="p-1 border border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="border border-white/5 bg-black p-8 font-mono text-[10px] text-white/40 uppercase tracking-tighter">
              <div className="flex flex-wrap items-center justify-between gap-12">
                 <div className="space-y-2">
                    <div className="text-white/20">SYSTEM_RELIABILITY</div>
                    <div className="text-xs text-white font-bold glow-white tracking-widest">STABLE_SINCE_2007</div>
                 </div>
                 <div className="space-y-2">
                    <div className="text-white/20">TRANSITION_STATUS</div>
                    <div className="text-xs text-white font-bold glow-white tracking-widest uppercase">HARDWARE &rarr; SOFTWARE COMPLETE</div>
                 </div>
                 <div className="space-y-2">
                    <div className="text-white/20">CURRENT_CORE</div>
                    <div className="text-xs text-white font-bold glow-white tracking-widest uppercase">SYSTMES_ARCHITECT</div>
                 </div>
                 <div className="space-y-2">
                    <div className="text-white/20">ENCRYPTION_HASH</div>
                    <div className="text-xs text-white font-bold glow-white tracking-widest uppercase">ZABNIX_0XC21</div>
                 </div>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogicSection;
