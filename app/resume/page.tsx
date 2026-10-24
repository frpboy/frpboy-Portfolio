import type { Metadata } from "next";
import Link from "next/link";
import ResumePrintButton from "@/components/os/ResumePrintButton";

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume of Rahul Muraleedharan, Full Stack Developer and Automation Specialist.",
  alternates: { canonical: "/resume" },
};

const skillGroups = [
  {
    title: "Web and full-stack",
    skills: "TypeScript, JavaScript, React, Next.js, Node.js, responsive interfaces",
  },
  {
    title: "Automation and backend",
    skills: "Python, workflow automation, API integration, GitHub Actions, shell scripting",
  },
  {
    title: "Applications and systems",
    skills: "Flutter, Dart, C#, .NET, WinUI 3, browser extensions",
  },
  {
    title: "Data and engineering",
    skills: "PostgreSQL, SQLite, Supabase, data modelling, troubleshooting, testing, Git",
  },
];

const projects = [
  {
    title: "Scrobblix",
    detail: "A Windows listening companion focused on local history, playback detection, transparent submission status, and a retry queue.",
    stack: "C# · .NET 10 · WinUI 3 · TypeScript WebExtension · SQLite",
    links: [{ label: "Source", href: "https://github.com/frpboy/Scrobblix" }],
  },
  {
    title: "Nah That's Fake",
    detail: "A Telegram bot and Mini App that brings image-analysis and suspicious-link signals into one workflow, while communicating the limits of external detection services.",
    stack: "Node.js · TypeScript · Telegram Mini App · Supabase",
    links: [{ label: "Source", href: "https://github.com/frpboy/NahThatsFake" }],
  },
  {
    title: "AdBlocker Test Lab",
    detail: "A browser-facing diagnostics lab exploring blocked requests, tracking protection, cosmetic filtering, and the difference between observations and inferred causes.",
    stack: "JavaScript · React · TypeScript · Browser APIs",
    links: [
      { label: "Live demo", href: "https://lab.frpboy.in/" },
      { label: "Source", href: "https://github.com/frpboy/adblocker-test-lab" },
    ],
  },
  {
    title: "Ashique Digital",
    detail: "A public client-facing website focused on clear service positioning, responsive presentation, and straightforward enquiry paths.",
    stack: "Next.js · TypeScript · Tailwind CSS · Framer Motion · Sanity",
    links: [
      { label: "Live website", href: "https://www.ashique.digital/" },
      { label: "Source", href: "https://github.com/frpboy/ashique-digital" },
    ],
  },
  {
    title: "React upstream contribution",
    detail: "Upstream engineering work maintained in a public fork, with code changes and review context available through the linked pull request.",
    stack: "React · JavaScript · TypeScript · Jest",
    links: [
      { label: "Fork", href: "https://github.com/frpboy/react" },
      { label: "Pull request", href: "https://github.com/react/react/pull/37974" },
    ],
  },
];

export default function ResumePage() {
  return (
    <div className="resume-route min-h-[calc(100svh-2rem)] bg-[#050807] px-4 py-8 text-white sm:px-8 sm:py-12">
      <div className="resume-print-root mx-auto max-w-4xl border border-white/10 bg-black p-5 sm:p-9 lg:p-12">
        <div className="resume-no-print mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
          <Link href="/" className="font-mono text-[10px] uppercase tracking-wider text-white/50 transition-colors hover:text-system-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green">
            ← Back to Portfolio OS
          </Link>
          <ResumePrintButton />
        </div>

        <header className="resume-section border-b-2 border-system-green/70 pb-6">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-system-green sm:text-[10px]">Resume / Engineering profile</p>
          <h1 className="mt-3 text-4xl font-black uppercase leading-none tracking-tight text-white sm:text-5xl">Rahul Muraleedharan</h1>
          <p className="mt-3 max-w-2xl text-base font-semibold text-white/75 sm:text-lg">
            Full Stack Developer &amp; Automation Specialist
          </p>
          <p className="mt-4 text-xs leading-relaxed text-white/45">
            Kerala, India · <a className="underline decoration-white/20 underline-offset-4 hover:text-system-green" href="mailto:hi@frpboy.in">hi@frpboy.in</a>
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs">
            <a className="text-system-green underline decoration-system-green/30 underline-offset-4" href="https://www.frpboy.in/" target="_blank" rel="noopener noreferrer">Portfolio</a>
            <a className="text-system-green underline decoration-system-green/30 underline-offset-4" href="https://github.com/frpboy" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="text-system-green underline decoration-system-green/30 underline-offset-4" href="https://www.linkedin.com/in/k4nn4n" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </header>

        <section className="resume-section mt-7">
          <h2 className="resume-heading text-xs font-bold uppercase tracking-[0.18em] text-system-green">Professional summary</h2>
          <p className="resume-muted mt-3 text-sm leading-relaxed text-white/70">
            Results-driven developer with a practical background in hardware troubleshooting and a focus on full-stack software, application development, and workflow automation. Builds systems that replace repetitive manual work with clearer, more consistent processes. Values evidence-led debugging, understandable architecture, and validating changes before calling them complete.
          </p>
        </section>

        <section className="resume-section mt-7">
          <h2 className="resume-heading text-xs font-bold uppercase tracking-[0.18em] text-system-green">Technical strengths</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {skillGroups.map((group) => (
              <div key={group.title} className="resume-card border border-white/10 bg-white/[0.025] p-3">
                <h3 className="font-semibold text-white/85">{group.title}</h3>
                <p className="resume-muted mt-1 text-xs leading-relaxed text-white/55">{group.skills}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="resume-section mt-7">
          <div className="flex items-end justify-between gap-3">
            <h2 className="resume-heading text-xs font-bold uppercase tracking-[0.18em] text-system-green">Selected projects</h2>
            <span className="font-mono text-[9px] uppercase tracking-wider text-white/30">Public work</span>
          </div>
          <div className="mt-3 space-y-4">
            {projects.map((project) => (
              <article key={project.title} className="resume-project resume-section border-l border-white/15 pl-3">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-bold text-white">{project.title}</h3>
                  <p className="resume-muted text-[10px] text-white/45">{project.stack}</p>
                </div>
                <p className="resume-muted mt-1 text-xs leading-relaxed text-white/65">{project.detail}</p>
                <div className="resume-no-print mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px]">
                  {project.links.map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="text-system-green underline decoration-system-green/30 underline-offset-2">
                      {link.label}
                    </a>
                  ))}
                </div>
                <p className="resume-print-links mt-1 hidden text-[9px] text-white/40">
                  {project.links.map((link) => link.href).join(" · ")}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="resume-section mt-7 border-t border-white/10 pt-5">
          <h2 className="resume-heading text-xs font-bold uppercase tracking-[0.18em] text-system-green">Engineering approach</h2>
          <p className="resume-muted mt-2 text-xs leading-relaxed text-white/60">
            Start with reproducible evidence. Make system behavior and failure states visible. Prefer maintainable changes over clever shortcuts. Validate outcomes, document limits, and leave a clear handoff.
          </p>
        </section>

        <footer className="resume-no-print mt-8 border-t border-white/10 pt-4 text-[10px] leading-relaxed text-white/30">
          This web resume is designed for printing. Choose “Save as PDF” in your browser's print dialog to create a PDF copy.
        </footer>
      </div>
    </div>
  );
}
