import Dashboard from "@/components/os/Dashboard";
import OriginSection from "@/components/timeline/OriginSection";
import SparkSection from "@/components/timeline/SparkSection";
import TransitionShock from "@/components/timeline/TransitionShock";
import LogicSection from "@/components/timeline/LogicSection";
import HeroSection from "@/components/timeline/HeroSection";

export default function Home() {
  return (
    <div className="flex-1 w-full flex flex-col">
       {/* 1. System Entry (Hero Hook) */}
       <HeroSection />
       
       {/* 2. Narrative Timeline - Vertical Scroll Experience */}
       <div className="relative">
          <OriginSection />
          <SparkSection />
          <TransitionShock />
          <LogicSection />
       </div>

       {/* 3. Final System Result (The Reward) */}
       <section className="min-h-screen py-24 bg-black/50 relative overflow-hidden" id="systems">
          <div className="absolute top-0 inset-x-0 h-px bg-white/20" />
          <div className="container mx-auto px-6 mb-12 text-center">
             <div className="font-mono text-[10px] tracking-[0.5em] text-system-green uppercase">
                L11 // REWARD_LAYER // SYSTEM_COMPLETED
             </div>
          </div>
          <Dashboard />
       </section>

       {/* 4. Final System Exit / Footer */}
       <footer className="footer relative z-10 py-24 bg-black border-t border-white/5 overflow-hidden">
          <div className="container mx-auto px-6 text-center space-y-12">
             <div className="space-y-4">
                <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
                   INITIATING <span className="text-system-green">CONNECTION</span>?
                </h3>
                <p className="text-white/40 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                   Currently open for architectural partnerships and high-impact engineering challenges. 
                   Reach out across any secure protocol.
                </p>
             </div>

             <div className="flex flex-wrap justify-center gap-6">
                <a href="mailto:hi@frpboy.in" className="group flex items-center gap-2 border border-white/10 px-6 py-3 font-mono text-xs text-white/50 hover:border-system-green hover:text-system-green transition-all uppercase">
                   Email // hi@frpboy.in
                </a>
                <a href="https://github.com/frpboy/" target="_blank" className="group flex items-center gap-2 border border-white/10 px-6 py-3 font-mono text-xs text-white/50 hover:border-system-green hover:text-system-green transition-all uppercase">
                   Github // /frpboy
                </a>
                <a href="https://frpboy.in/" target="_blank" className="group flex items-center gap-2 border border-white/10 px-6 py-3 font-mono text-xs text-white/50 hover:border-system-green hover:text-system-green transition-all uppercase">
                   Web // frpboy.in
                </a>
             </div>

             <div className="pt-24 font-mono text-[10px] text-white/10 uppercase tracking-widest leading-loose">
                SYSTEM_BUILD: 2026_RAHUL_OS_FINAL<br />
                ENCRYPTED_SIGNATURE: fb72a_01c<br />
                STAY_LOGICAL.
             </div>
          </div>
       </footer>
    </div>
  );
}
