import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/lib/data/projects";

const siteUrl = "https://www.frpboy.in";

export const metadata: Metadata = {
  title: "Projects — Rahul Muraleedharan",
  description: "Explore selected web, Android, desktop, automation, and open-source projects by Rahul Muraleedharan (K4NN4N / FrpBoy).",
  alternates: { canonical: "/projects" },
  openGraph: {
    type: "website",
    url: siteUrl + "/projects",
    title: "Projects — Rahul Muraleedharan",
    description: "A curated, evidence-led catalogue of software projects and open-source work by Rahul Muraleedharan.",
  },
};

export default function ProjectsPage() {
  return (
    <article className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 sm:py-24">
      <nav aria-label="Breadcrumb" className="font-mono text-[10px] uppercase tracking-wider text-white/45">
        <Link className="transition-colors hover:text-system-green" href="/">Portfolio</Link>
        <span aria-hidden="true"> / </span>
        <span className="text-system-green">Projects</span>
      </nav>
      <header className="mt-7 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-system-green">Selected work // project registry</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-6xl">Projects</h1>
        <p className="mt-6 text-base leading-8 text-white/65">
          A curated catalogue of applications, developer tools, prototypes, and public contributions. Each page explains the problem, implementation approach, current status, and the evidence available in its public source or live destination.
        </p>
      </header>
      <section aria-label="Project catalogue" className="mt-12 grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <article key={project.id} className="flex h-full flex-col border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-system-green/30 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-system-green">{project.category}</p>
              <span className="font-mono text-[9px] uppercase tracking-wider text-white/40">{project.status}</span>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-white">
              <Link href={`/projects/${project.id}`} className="transition-colors hover:text-system-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green">{project.title}</Link>
            </h2>
            <p className="mt-2 text-sm font-medium text-white/55">{project.subtitle}</p>
            <p className="mt-4 flex-1 text-sm leading-7 text-white/65">{project.description}</p>
            <ul aria-label={project.title + " technology stack"} className="mt-5 flex flex-wrap gap-2">
              {project.tech.map((technology) => (
                <li key={technology} className="border border-white/10 px-2 py-1 font-mono text-[9px] text-white/50">{technology}</li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-wider">
              <Link href={`/projects/${project.id}`} className="text-system-green underline underline-offset-4">Project details</Link>
              {project.links?.github && <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="text-white/60 underline decoration-white/20 underline-offset-4 hover:text-white">Source</a>}
              {project.links?.live && <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="text-white/60 underline decoration-white/20 underline-offset-4 hover:text-white">{project.links.liveLabel || "Live website"}</a>}
            </div>
          </article>
        ))}
      </section>
      <p className="mt-12 border-t border-white/10 pt-6 text-xs leading-6 text-white/40">
        The catalogue is intentionally selective. Fork-based work is labelled as maintenance, and prototype or prerelease status is shown where production readiness has not been established. Private project source and confidential implementation details are not published here.
      </p>
    </article>
  );
}
