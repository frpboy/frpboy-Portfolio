import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/lib/data/projects";

const siteUrl = "https://www.frpboy.in";
const openSourceProjects = projects.filter((project) => project.role === "Fork maintainer" || project.role === "Open-source contributor");

export const metadata: Metadata = {
  title: "Open-source work",
  description: "Maintained forks and public upstream contribution references from Rahul Muraleedharan (K4NN4N / FrpBoy). Fork maintenance is distinguished from original authorship and merged upstream work.",
  alternates: { canonical: "/open-source" },
  openGraph: {
    type: "website",
    url: siteUrl + "/open-source",
    title: "Open-source work — Rahul Muraleedharan",
    description: "A transparent record of maintained forks and upstream contribution references.",
  },
};

export default function OpenSourcePage() {
  return (
    <article className="mx-auto w-full max-w-5xl flex-1 px-6 py-16 sm:py-24">
      <nav aria-label="Breadcrumb" className="font-mono text-[10px] uppercase tracking-wider text-white/45">
        <Link href="/" className="transition-colors hover:text-system-green">Portfolio</Link>
        <span aria-hidden="true"> / </span>
        <span className="text-system-green">Open source</span>
      </nav>
      <header className="mt-7 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-system-green">Public work // attribution first</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-6xl">Open source</h1>
        <p className="mt-6 text-base leading-8 text-white/65">
          This page separates work on maintained forks from references to contributions in upstream repositories. A fork is not presented as original authorship, and a pull-request link is not described as merged unless the upstream repository confirms that status.
        </p>
      </header>
      <section aria-label="Maintained forks and upstream contributions" className="mt-12 space-y-4">
        {openSourceProjects.map((project) => (
          <article key={project.id} className="border border-white/10 bg-white/[0.02] p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-3 font-mono text-[9px] uppercase tracking-wider">
              <span className="text-system-green">{project.role}</span>
              <span className="text-white/25">/</span>
              <span className="text-white/45">{project.status}</span>
            </div>
            <h2 className="mt-3 text-xl font-bold text-white"><Link href={"/projects/" + project.id} className="transition-colors hover:text-system-green">{project.title}</Link></h2>
            <p className="mt-2 text-sm leading-7 text-white/60">{project.contribution}</p>
            <div className="mt-4 flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-wider">
              <Link href={"/projects/" + project.id} className="text-system-green underline underline-offset-4">Project details</Link>
              {project.links?.github && <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="text-white/60 underline decoration-white/20 underline-offset-4 hover:text-white">Public repository</a>}
              {project.links?.pullRequest && <a href={project.links.pullRequest} target="_blank" rel="noopener noreferrer" className="text-white/60 underline decoration-white/20 underline-offset-4 hover:text-white">Upstream pull request</a>}
            </div>
          </article>
        ))}
      </section>
    </article>
  );
}
