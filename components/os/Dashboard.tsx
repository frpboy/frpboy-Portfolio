"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Code2, GitPullRequest, Globe, Search, SlidersHorizontal } from "lucide-react";
import ProjectModule from "./ProjectModule";
import ProjectWindow from "./ProjectWindow";
import { projects, type Project, type ProjectCategory } from "@/lib/data/projects";

const categories: { value: ProjectCategory | "all"; label: string }[] = [
  { value: "all", label: "All Work" },
  { value: "independent", label: "Independent" },
  { value: "tool", label: "Tools" },
  { value: "enterprise", label: "Enterprise" },
  { value: "client", label: "Client Work" },
  { value: "creative", label: "Creative" },
];

const featuredProjectIds = [
  "ashique-digital",
  "adblocker-test-lab",
  "nah-thats-fake",
  "react-upstream",
];

const featuredProjects = featuredProjectIds
  .map((id) => projects.find((project) => project.id === id))
  .filter((project): project is Project => project !== undefined);

export default function Dashboard() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProjectCategory | "all">("all");

  const openProject = useCallback((project: Project) => setActiveProject(project), []);
  const closeProject = useCallback(() => setActiveProject(null), []);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesCategory = category === "all" || project.category === category;
      const haystack = [
        project.title,
        project.subtitle,
        project.description,
        project.status,
        project.role,
        categories.find((item) => item.value === project.category)?.label ?? project.category,
        project.problem,
        project.solution,
        project.contribution,
        project.impact,
        project.architecture,
        project.highlight,
        ...project.tech,
      ].join(" ").toLowerCase();
      return matchesCategory && (!query || haystack.includes(query));
    });
  }, [category, search]);

  return (
    <section className="relative mx-auto w-full max-w-7xl space-y-10 px-4 py-8 sm:px-6 md:px-8">
      <AnimatePresence>
        {activeProject && (
          <ProjectWindow project={activeProject} onClose={closeProject} />
        )}
      </AnimatePresence>

      <header className="mt-6 flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-system-green" />
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-system-green/80">
              L11 // PROJECT_REGISTRY
            </span>
          </div>
          <h2 id="projects-heading" className="text-3xl font-black uppercase italic tracking-tighter text-white sm:text-5xl">
            Selected <span className="text-white/35">work.</span>
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-white/50 sm:text-base">
            Start with a few representative projects, then explore the full archive.
            Each record explains the problem, my contribution, implementation decisions,
            and the public source, demo, or review links available for inspection.
          </p>
        </div>
        <div className="border-l border-white/15 pl-4 font-mono text-[10px] uppercase tracking-widest text-white/45">
          <div>Registry entries</div>
          <div className="mt-2 text-2xl font-bold text-system-green">
            {filteredProjects.length.toString().padStart(2, "0")}
            <span className="text-sm text-white/35"> / {projects.length.toString().padStart(2, "0")}</span>
          </div>
          <div className="mt-1 text-[9px] text-white/30">Matching current filters</div>
        </div>
      </header>

      <section id="featured-work" aria-labelledby="featured-heading" className="scroll-mt-16 space-y-5">
        <div className="flex flex-col gap-2 border-l-2 border-system-green/50 pl-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-system-green/75">Start here / 04 selected records</p>
            <h3 id="featured-heading" className="mt-2 text-2xl font-black uppercase italic tracking-tight text-white sm:text-3xl">
              Featured <span className="text-white/35">projects.</span>
            </h3>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-white/40">
            A focused first look at live delivery, browser tooling, AI-assisted workflows, and upstream engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <article
              key={project.id}
              className="group flex min-w-0 flex-col border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-system-green/35 hover:bg-system-green/[0.025] sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-system-green/70">
                  Featured / {String(index + 1).padStart(2, "0")}
                </span>
                <span className="max-w-[58%] text-right font-mono text-[9px] uppercase leading-relaxed text-white/35">
                  {project.status}
                </span>
              </div>

              <div className="mt-5 flex items-start gap-3">
                <div aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 text-system-green">
                  {project.links?.pullRequest ? <GitPullRequest className="h-4 w-4" /> : project.links?.live ? <Globe className="h-4 w-4" /> : <Code2 className="h-4 w-4" />}
                </div>
                <div className="min-w-0">
                  <h4 className="break-words text-xl font-black uppercase tracking-tight text-white sm:text-2xl">
                    {project.title}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-white/40">{project.subtitle}</p>
                </div>
              </div>

              <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-white/60">
                {project.description}
              </p>

              <ul aria-label={project.title + " technology stack"} className="mt-5 flex flex-wrap gap-2">
                {project.tech.slice(0, 4).map((technology) => (
                  <li key={technology} className="border border-white/10 px-2 py-1 font-mono text-[9px] text-white/45">
                    {technology}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
                <button
                  type="button"
                  onClick={() => openProject(project)}
                  aria-haspopup="dialog"
                  className="inline-flex min-h-10 items-center gap-2 border border-system-green/35 bg-system-green/[0.05] px-3 py-2 font-mono text-[9px] uppercase tracking-wider text-system-green transition-colors hover:border-system-green hover:bg-system-green/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green"
                >
                  Project details <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
                {project.links?.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center gap-2 border border-white/10 px-3 py-2 font-mono text-[9px] uppercase tracking-wider text-white/60 transition-colors hover:border-white/30 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green"
                  >
                    {project.links.liveLabel ?? "Live demo"} <Globe aria-hidden="true" className="h-3.5 w-3.5" />
                  </a>
                )}
                {project.links?.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center gap-2 border border-white/10 px-3 py-2 font-mono text-[9px] uppercase tracking-wider text-white/60 transition-colors hover:border-white/30 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green"
                  >
                    Source <Code2 aria-hidden="true" className="h-3.5 w-3.5" />
                  </a>
                )}
                {project.links?.pullRequest && (
                  <a
                    href={project.links.pullRequest}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center gap-2 border border-white/10 px-3 py-2 font-mono text-[9px] uppercase tracking-wider text-white/60 transition-colors hover:border-white/30 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green"
                  >
                    Upstream PR <GitPullRequest aria-hidden="true" className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <div id="project-registry" className="scroll-mt-16 space-y-5 border-t border-white/10 pt-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/35">Full directory</p>
            <h3 className="mt-1 text-xl font-black uppercase tracking-tight text-white">Explore all projects</h3>
          </div>
          <p className="text-xs text-white/35">Search by project, technology, or status.</p>
        </div>

        <label className="flex max-w-2xl items-center gap-3 border border-white/10 bg-white/[0.025] px-4 py-3 text-white/60 focus-within:border-system-green/50">
          <Search aria-hidden="true" size={16} className="shrink-0 text-system-green/70" />
          <span className="sr-only">Search project registry</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects, technology, or status…"
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
          />
        </label>

        <div role="group" aria-label="Filter projects by category" className="flex flex-wrap items-center gap-2">
          <span className="mr-1 inline-flex items-center gap-2 pr-2 font-mono text-[9px] uppercase tracking-widest text-white/30">
            <SlidersHorizontal aria-hidden="true" size={13} />
            Filter
          </span>
          {categories.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={category === item.value}
              onClick={() => setCategory(item.value)}
              className={
                "min-h-9 border px-3 py-2 font-mono text-[10px] uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green " +
                (category === item.value
                  ? "border-system-green/60 bg-system-green/10 text-system-green"
                  : "border-white/10 text-white/45 hover:border-white/30 hover:text-white/80")
              }
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 pb-10 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              transition={{ duration: 0.2, delay: Math.min(index * 0.015, 0.12) }}
              className="min-w-0"
            >
              <ProjectModule project={project} onOpen={openProject} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-white/15 px-6 py-14 text-center">
          <p className="font-mono text-sm uppercase tracking-wider text-white/65">No matching project records</p>
          <p className="mt-2 text-sm text-white/35">Try a different search term or clear the category filter.</p>
          <button
            type="button"
            onClick={() => { setSearch(""); setCategory("all"); }}
            className="mt-5 border border-white/15 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-system-green hover:border-system-green/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green"
          >
            Reset filters
          </button>
        </div>
      )}

      <footer className="border-t border-white/10 pt-5 text-sm leading-relaxed text-white/40">
        Some client work is private. Public source code, live demonstrations, and upstream pull requests are linked wherever they are available.
      </footer>
    </section>
  );
}
