"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Zap } from "lucide-react";

const SparkSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create a background animation that feels like data sparks
      gsap.fromTo(".spark-item", 
        { opacity: 0, y: "100vh" },
        { 
          opacity: 1, 
          y: "-100vh", 
          duration: "random(2, 5)", 
          repeat: -1, 
          ease: "none", 
          stagger: { amount: 2, from: "random" } 
        }
      );

      // Scroll reveal for content
      gsap.from(".spark-content", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom center",
          toggleActions: "play none none reverse",
          scrub: 1.5,
        },
        opacity: 0,
        y: 100,
        scale: 0.95,
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-[140vh] w-full flex items-center justify-center bg-black overflow-hidden noise-bg"
      id="spark"
    >
      {/* Background Matrix/Data Rain (Mock) */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
         {[...Array(30)].map((_, i) => (
           <div 
             key={i} 
             className="spark-item absolute w-px h-32 bg-system-green opacity-20"
             style={{ left: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 3 + 2}s` }}
           />
         ))}
      </div>

      <div className="spark-content relative z-10 container mx-auto px-6 space-y-16">
         <div className="space-y-6 max-w-4xl mx-auto text-left">
            <div className="flex items-center gap-4 text-system-green font-mono text-[9px] tracking-[0.4em] uppercase animate-pulse">
               <span className="h-[1px] w-12 bg-system-green" />
               L03 // THE_SPARK // STRUGGLE_PHASE
            </div>
            
            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] uppercase">
              NOT FROM <span className="text-system-green italic">SILICON VALLEY.</span><br />
              FROM A <span className="text-white/20">SURVIVAL</span> GRIND.
            </h2>
            
            <div className="w-full h-px bg-white/5" />
         </div>

         <div className="grid md:grid-cols-[1.5fr_1fr] gap-12 max-w-5xl mx-auto items-start">
            <div className="space-y-8">
               <p className="text-xl md:text-2xl font-mono text-system-green/80 leading-relaxed terminal-text">
                 "Replacing manual effort with automated code wasn't just a choice. It was a matter of survival."
               </p>
                <div className="space-y-4 text-white/40 leading-relaxed text-sm md:text-base font-light">
                  <p>
                    Life after graduation was a lesson in grit. I took whatever work came my way: <span className="text-white/60">Apprentice Tile Worker</span> in construction, <span className="text-white/60">SIM Promoter</span> for Reliance on the streets, and eventually an <span className="text-white/60">Accountant</span> at Achhoz Light & Glass Zone.
                  </p>
                  <p>
                    I was earning ₹15,000 a month, but I felt trapped. Sitting behind a ledger, I realized I wasn't born to manage accounts—I was born to build systems. I saved every rupee, resigned, and moved to <span className="text-system-green/60 uppercase font-bold tracking-widest">Perinthalmanna</span> to start over.
                  </p>
                </div>
            </div>
            
            <div className="p-8 border border-system-green/20 bg-system-green/[0.02] backdrop-blur-sm relative group overflow-hidden">
               <div className="absolute top-0 right-0 w-20 h-20 bg-system-green/5 blur-3xl" />
               <div className="absolute -top-3 -left-3 bg-system-green text-black font-mono text-[10px] px-2 py-1 font-bold">
                  SURVIVAL_KERNEL_V1
               </div>
               <div className="space-y-6">
                  <div className="space-y-4 border-l border-system-green/20 pl-8">
                     <h4 className="text-system-green/40 font-mono text-[10px] uppercase tracking-[0.3em] font-bold underline decoration-system-green/20 underline-offset-4">Survival_Grind</h4>
                     <ul className="space-y-4 text-sm md:text-base text-white/30 leading-relaxed font-light list-none">
                        <li className="flex items-start gap-4">
                          <span className="text-system-green/40 mt-1">&rarr;</span>
                          <span><span className="text-white/50">Industrial Logic:</span> Apprentice tile worker by day, student by night.</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="text-system-green/40 mt-1">&rarr;</span>
                          <span><span className="text-white/50">Catering Service:</span> Working as a catering boy during student years—a grind known to every middle-class student.</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="text-system-green/40 mt-1">&rarr;</span>
                          <span><span className="text-white/50">Reliance Sales:</span> SIM promoter selling connections on the streets of Thiruvalla.</span>
                        </li>
                     </ul>
                  </div>
                  <div className="space-y-4 border-l border-system-green/20 pl-8">
                     <h4 className="text-system-green/40 font-mono text-[10px] uppercase tracking-[0.3em] font-bold underline decoration-system-green/20 underline-offset-4">Strategic_Move</h4>
                     <p className="text-sm md:text-base text-white/30 leading-relaxed font-light">
                        Sitting behind a ledger at <span className="text-white/50">Achhoz Light & Glass Zone</span>, I realized I wasn't born to manage accounts. 
                        I saved every rupee, resigned, and moved to <span className="text-white/60">Perinthalmanna</span>—a place that would become my second home for 5+ years.
                     </p>
                  </div>
                  <div className="pt-4 text-system-green/20 break-all leading-none opacity-50 select-none font-mono text-[8px]">
                     01010111 01001000 01011001 01001101 01000001 01010010 01000001 01010010 01000001
                  </div>
               </div>
            </div>
         </div>
      </div>
    </section>
  );
};

export default SparkSection;
