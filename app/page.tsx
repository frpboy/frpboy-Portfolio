import Dashboard from "@/components/os/Dashboard";
import OriginSection from "@/components/timeline/OriginSection";
import SparkSection from "@/components/timeline/SparkSection";
import TransitionShock from "@/components/timeline/TransitionShock";
import LogicSection from "@/components/timeline/LogicSection";
import HeroSection from "@/components/timeline/HeroSection";

const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Rahul Muraleedharan",
  jobTitle: "Full Stack Developer & Automation Specialist",
  url: "https://www.frpboy.in/",
  sameAs: ["https://github.com/frpboy", "https://www.linkedin.com/in/k4nn4n"],
  knowsAbout: [
    "Full-stack development",
    "Android applications",
    "Desktop applications",
    "Python",
    "TypeScript",
    "Workflow automation",
    "APIs and databases",
  ],
};

export default function Home() {
  return (
    <div className="flex w-full flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personStructuredData).replace(/</g, "\\u003c"),
        }}
      />
      <HeroSection />
      <div className="relative">
        <OriginSection />
        <SparkSection />
        <TransitionShock />
        <LogicSection />
      </div>

      <section id="systems" aria-labelledby="projects-heading" className="relative overflow-hidden bg-black/50 py-16 sm:py-24">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-white/15" />
        <div className="container mx-auto px-5 pb-4 text-center sm:px-6">
          <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-system-green sm:text-[10px] sm:tracking-[0.5em]">L11 // SELECTED WORK</p>
        </div>
        <Dashboard />
      </section>

      <footer id="contact" className="footer relative z-10 overflow-hidden border-t border-white/10 bg-black py-20 sm:py-24">
        <div className="container mx-auto space-y-10 px-5 text-center sm:px-6">
          <div className="space-y-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-system-green/70">Open a conversation</p>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white sm:text-5xl">
              Build something<br className="sm:hidden" /> <span className="text-system-green">useful.</span>
            </h2>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/50 sm:text-base">
              For full-stack development, practical automation, or a difficult engineering problem,
              get in touch. Explore the public code, or review my resume and technical background.
            </p>
          </div>

          <nav aria-label="Professional links" className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <a href="mailto:hi@frpboy.in" className="inline-flex min-h-11 items-center border border-system-green/35 px-4 py-3 font-mono text-[10px] uppercase tracking-wide text-system-green transition-colors hover:border-system-green hover:bg-system-green/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green">Email</a>
            <a href="/resume" className="inline-flex min-h-11 items-center border border-white/20 px-4 py-3 font-mono text-[10px] uppercase tracking-wide text-white/75 transition-colors hover:border-white/45 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green">Resume / Save as PDF</a>
            <a href="https://github.com/frpboy" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center border border-white/15 px-4 py-3 font-mono text-[10px] uppercase tracking-wide text-white/65 transition-colors hover:border-system-green/60 hover:text-system-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green">GitHub</a>
            <a href="https://www.linkedin.com/in/k4nn4n" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center border border-white/15 px-4 py-3 font-mono text-[10px] uppercase tracking-wide text-white/65 transition-colors hover:border-system-green/60 hover:text-system-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green">LinkedIn</a>
          </nav>
          <div className="border-t border-white/5 pt-8 font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">
            Rahul Muraleedharan · Full Stack Development · Automation
          </div>
        </div>
      </footer>
    </div>
  );
}
