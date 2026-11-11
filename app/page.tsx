import Link from "next/link";
import Dashboard from "@/components/os/Dashboard";
import OriginSection from "@/components/timeline/OriginSection";
import LogicSection from "@/components/timeline/LogicSection";
import HeroSection from "@/components/timeline/HeroSection";
import VisitorCounter from "@/components/os/VisitorCounter";
import CalBookingLink from "@/components/os/CalBookingLink";

const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://www.frpboy.in/#person",
  name: "Rahul Muraleedharan",
  alternateName: ["K4NN4N", "FrpBoy"],
  jobTitle: "Full Stack Developer & Automation Specialist",
  description: "Rahul Muraleedharan, also known online as K4NN4N and FrpBoy, is a full-stack developer and automation specialist based in Kerala, India.",
  url: "https://www.frpboy.in/",
  sameAs: ["https://github.com/frpboy", "https://www.linkedin.com/in/rahul-muraleedharan-it/"],
  knowsAbout: [
    "Full-stack development",
    "Android applications",
    "Desktop applications",
    "Python",
    "Google Apps Script",
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
        <LogicSection />
      </div>

      <section id="systems" aria-labelledby="projects-heading" className="relative overflow-visible bg-black/50 py-16 sm:py-24">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-white/15" />
        <div className="container mx-auto px-5 pb-4 text-center sm:px-6">
          <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-system-green sm:text-[10px] sm:tracking-[0.5em]">L11 // SELECTED WORK</p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 font-mono text-[10px] uppercase tracking-wider">
            <Link href="/projects" className="text-white/65 underline decoration-white/20 underline-offset-4 transition-colors hover:text-system-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green">Browse all project pages</Link>
            <Link href="/open-source" className="text-white/65 underline decoration-white/20 underline-offset-4 transition-colors hover:text-system-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green">Open-source work</Link>
          </div>
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
            <a href="mailto:frpboy12@gmail.com" className="inline-flex min-h-11 items-center border border-system-green/35 px-4 py-3 font-mono text-[10px] uppercase tracking-wide text-system-green transition-colors hover:border-system-green hover:bg-system-green/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green">Email</a>
            <a href="/about" className="inline-flex min-h-11 items-center border border-white/20 px-4 py-3 font-mono text-[10px] uppercase tracking-wide text-white/75 transition-colors hover:border-white/45 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green">About Rahul</a>
            <Link href="/projects" className="inline-flex min-h-11 items-center border border-white/20 px-4 py-3 font-mono text-[10px] uppercase tracking-wide text-white/75 transition-colors hover:border-white/45 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green">Projects</Link>
            <Link href="/open-source" className="inline-flex min-h-11 items-center border border-white/20 px-4 py-3 font-mono text-[10px] uppercase tracking-wide text-white/75 transition-colors hover:border-white/45 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green">Open source</Link>
            <a href="/resume" className="inline-flex min-h-11 items-center border border-white/20 px-4 py-3 font-mono text-[10px] uppercase tracking-wide text-white/75 transition-colors hover:border-white/45 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green">RESUME / CV</a>
            <a href="https://github.com/frpboy" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center border border-white/15 px-4 py-3 font-mono text-[10px] uppercase tracking-wide text-white/65 transition-colors hover:border-system-green/60 hover:text-system-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green">GitHub</a>
            <a href="https://www.linkedin.com/in/k4nn4n/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center border border-white/15 px-4 py-3 font-mono text-[10px] uppercase tracking-wide text-white/65 transition-colors hover:border-system-green/60 hover:text-system-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green">LinkedIn</a>
            <CalBookingLink />
          </nav>
          <div className="flex justify-center">
            <VisitorCounter />
          </div>
          <div className="space-y-3 border-t border-white/5 pt-8">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/45">
              Rahul Muraleedharan · K4NN4N · FrpBoy · Full Stack Development · Automation
            </p>
            <p className="text-xs text-white/55">
              A small origin note: “FRPBOY” nods to my device-troubleshooting roots — the reset stuck, the curiosity didn&apos;t.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
