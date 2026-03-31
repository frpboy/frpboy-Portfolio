"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const OriginSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create a timeline for the scroll-triggered reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
        }
      });

      tl.fromTo(".glitch-text", 
        { opacity: 0, x: -50, filter: "blur(10px) brightness(2)" },
        { opacity: 1, x: 0, filter: "blur(0px) brightness(1)", stagger: 0.2 }
      );

      tl.fromTo(".origin-line",
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: "power4.out" },
        "<"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-center px-4 md:px-24 overflow-hidden bg-black noise-bg scanline"
      id="origin"
    >
      <div className="relative z-10 space-y-12 max-w-5xl">
        <div className="space-y-4">
          <motion.div 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             className="flex items-center gap-4 text-white/30 font-mono text-[9px] tracking-[0.4em] uppercase animate-flicker"
          >
            <span className="h-[1px] w-12 bg-white/20" />
            L01 // ORIGIN_CORE // 2007
          </motion.div>
          <h2 className="text-6xl md:text-9xl font-black text-white/90 tracking-tighter leading-[0.85] uppercase origin-text">
            THE SEED OF <br />
            <span className="text-transparent stroke-white/20 stroke-1" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.2)" }}>CURIOSITY</span>
          </h2>
        </div>

        <p className="text-2xl md:text-3xl text-white/40 font-light leading-tight max-w-3xl italic tracking-tight">
          My journey didn't start in a high-tech lab; it started in <span className="text-primary-blue/60">Thymaravumkara,</span> a small village in <span className="text-white/60">Thiruvalla, Pathanamthitta (Hometown).</span>
          Intellectual curiosity was the only leverage I had in a modest-resource environment.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-12">
           <div className="space-y-4 border-l border-primary-blue/20 pl-8">
              <h4 className="text-primary-blue/40 font-mono text-[10px] uppercase tracking-[0.3em] font-bold underline decoration-primary-blue/20 underline-offset-4">Initial_Encounter</h4>
              <p className="text-sm md:text-base text-white/30 leading-relaxed font-light">
                 At 11, I saw a computer for the first time. I didn't see a machine; I saw a mystery. 
                 Devouring newspapers like <span className="text-white/50">Padippura (Malayala Manorama)</span> and sneaking into textbooks years ahead of my grade, I became obsessed with how logic was packed into a single box.
              </p>
           </div>
           <div className="space-y-4 border-l border-primary-blue/20 pl-8">
              <h4 className="text-primary-blue/40 font-mono text-[10px] uppercase tracking-[0.3em] font-bold underline decoration-primary-blue/20 underline-offset-4">Computer_Genie</h4>
              <p className="text-sm md:text-base text-white/30 leading-relaxed font-light">
                 By 9th standard, I had emerged as the "Computer Genie". Toggling between <span className="text-white/50">Windows and Ubuntu (IT@School OS)</span>, 
                 I was the Secretary of the IT Club, obsessively troubleshooting systems before I even owned one.
              </p>
           </div>
        </div>

        <div className="pt-8 opacity-20 hover:opacity-50 transition-opacity">
          <p className="text-[10px] font-mono text-white/50 tracking-widest uppercase">
            [ ARCHIVE_ENTRY_V1 ] :: VHSE Office Secretaryship // B.Com Computer Applications (SN College)
          </p>
        </div>
      </div>
    </section>
  );
};

export default OriginSection;
