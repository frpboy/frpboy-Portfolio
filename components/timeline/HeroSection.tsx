"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
       gsap.from(".hero-text", {
          y: 40,
          opacity: 0,
          duration: 1.5,
          stagger: 0.2,
          ease: "power4.out",
          delay: 2.2 // Wait for SystemLoader
       });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden px-6"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,156,0.03)_0%,transparent_70%)]" />
      
      <div className="container mx-auto space-y-12 relative z-10 text-center">
         <div className="hero-text space-y-4">
            <div className="flex flex-col items-center justify-center gap-2">
               <div className="flex items-center justify-center gap-4 text-white/20 font-mono text-[10px] tracking-[0.5em] uppercase">
                  <span className="h-[1px] w-8 bg-white/10" />
                  SYSTEM_ENTRY_0XC1
                  <span className="h-[1px] w-8 bg-white/10" />
               </div>
               <div className="text-system-green font-mono text-[9px] tracking-[0.3em] uppercase mt-2 glow-green">
                 FULL STACK DEVELOPER & AUTOMATION SPECIALIST
               </div>
            </div>
            
            <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] uppercase flex flex-col">
               <span className="hero-text text-white/20">NOT FROM</span>
               <span className="hero-text text-white">SILICON VALLEY.</span>
            </h1>
         </div>

         <div className="hero-text flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 pt-8">
            <p className="max-w-md text-white/40 text-sm md:text-base leading-relaxed italic">
               "Architecting the future from a tile worker's shadow. 
               Replacing manual chaos with automated control, one system at a time."
            </p>
            
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 border border-white/10 flex items-center justify-center rounded-full">
                  <div className="w-2 h-2 bg-system-green rounded-full animate-pulse" />
               </div>
               <div className="text-left font-mono text-[9px] text-white/30 space-y-1">
                  <div>ACCESSING_KERNEL...</div>
                  <div className="text-system-green">SCROLL_TO_INITIATE_UPGRADE</div>
               </div>
            </div>
         </div>
      </div>
      
      {/* Minimal Bottom Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-20">
         <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
         <span className="font-mono text-[8px] tracking-widest uppercase">SYST_BOOT_V0.1</span>
      </div>
    </section>
  );
};

export default HeroSection;
