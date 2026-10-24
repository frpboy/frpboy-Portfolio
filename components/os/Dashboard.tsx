"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Code2, ExternalLink, GitPullRequest, Search, SlidersHorizontal } from "lucide-react";
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

// Keep the first rows focused on verifiable delivery and substantial engineering,
// while preserving every project in the searchable archive.
const registryPriority = [
  "ashique-digital",
  "henna-by-chippy",
  "reddit-sniper",
  "threadly",
  "portfolio-os",
  "lean-ctx",
  "react-upstream",
  "neat-browser",
  "nah-thats-fake",
  "adblocker-test-lab",
  "scrobblix",
];

const featuredGroups = [
  {
    id: "enterprise-workflows",
    eyebrow: "01 / Enterprise architecture",
    title: "Reporting & workflow systems",
    summary: "Redacted case studies across business operations, healthcare reporting, and procurement. The focus is structured records, role-aware workflows, approvals, auditability, and reporting—not confidential client details or unverified outcome metrics.",
    projectIds: [
      "business-operations-workflow-case-study",
      "healthcare-reporting-workflow-case-study",
      "procurement-workflow-case-study",
    ],
    tags: ["PostgreSQL", "JSONB", "REST API", "RBAC", "Approval workflows", "Audit logging"],
  },
  {
    id: "systems-ai",
    eyebrow: "02 / Open-source systems",
    title: "Runtime & rendering internals",
    summary: "A substantial Rust-based context-tooling fork alongside an explicitly pending React Fizz contribution. Attribution and upstream review state stay visible.",
    projectIds: ["lean-ctx", "react-upstream"],
    tags: ["Rust", "Shell", "MCP", "GitHub Actions", "React Fizz", "Jest"],
  },
  {
    id: "product-automation",
    eyebrow: "03 / Products & automation",
    title: "Signals into useful workflows",
    summary: "A Telegram-based image and suspicious-link checking workflow paired with a conversation-monitoring service that routes matching Reddit signals into notifications.",
    projectIds: ["nah-thats-fake", "reddit-sniper"],
    tags: ["Node.js", "TypeScript", "Telegram Mini App", "Supabase", "Redis", "RSS"],
  },
  {
    id: "commercial-delivery",
    eyebrow: "04 / Commercial delivery",
    title: "Polished web experiences",
    summary: "Two client-facing websites that combine clear service presentation with real enquiry or ordering paths, CMS-backed content, and AI-assisted support where documented.",
    projectIds: ["ashique-digital", "henna-by-chippy"],
    tags: ["Next.js", "TypeScript", "Sanity CMS", "Gemini AI", "Pinecone", "Tailwind CSS"],
  },
];

export default function Dashboard() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProjectCategory | "all">("all");

  const openProject = useCallback((project: Project) => setActiveProject(project), []);
  const closeProject = useCallback(() => setActiveProject(null), []);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    const originalOrder = new Map(projects.map((project, index) => [project.id, index]));
    return projects
      .filter((project) => {
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
      })
      .sort((a, b) => {
        const priorityA = registryPriority.indexOf(a.id);
        const priorityB = registryPriority.indexOf(b.id);
        const rankA = priorityA < 0 ? registryPriority.length : priorityA;
        const rankB = priorityB < 0 ? registryPriority.length : priorityB;
        return rankA - rankB || (originalOrder.get(a.id) ?? 0) - (originalOrder.get(b.id) ?? 0);
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
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-system-green/90">
              L11 // PROJECT_REGISTRY
            </span>
          </div>
          <h2 id="projects-heading" className="text-3xl font-black uppercase italic tracking-tighter text-white sm:text-5xl">
            Selected <span className="text-white/45">work.</span>
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
            Explore the strongest evidence first, then search the complete project archive.
            Each record explains the problem, my contribution, implementation decisions,
            and the public source, demo, or review links available for inspection.
          </p>
        </div>
        <div className="border-l border-white/20 pl-4 font-mono text-[10px] uppercase tracking-widest text-white/65">
          <div>Registry entries</div>
          <div className="mt-2 text-2xl font-bold text-system-green">
            {filteredProjects.length.toString().padStart(2, "0")}
            <span className="text-sm text-white/55"> / {projects.length.toString().padStart(2, "0")}</span>
          </div>
          <div className="mt-1 text-[9px] text-white/55">Matching current filters</div>
        </div>
      </header>

      <section id="featured-work" aria-labelledby="featured-heading" className="scroll-mt-16 space-y-5">
        <div className="flex flex-col gap-2 border-l-2 border-system-green/60 pl-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-system-green/90">Four paths into the work</p>
            <h3 id="featured-heading" className="mt-2 text-2xl font-black uppercase italic tracking-tight text-white sm:text-3xl">
              Featured <span className="text-white/45">projects.</span>
            </h3>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-white/60">
            Enterprise workflows, systems-level work, product automation, and commercial delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {featuredGroups.map((group) => {
            const groupProjects = group.projectIds
              .map((id) => projects.find((project) => project.id === id))
              .filter((project): project is Project => project !== undefined);

            return (
              <article
                key={group.id}
                className="group flex min-w-0 flex-col border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-system-green/35 hover:bg-system-green/[0.025] sm:p-6"
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-system-green/90">{group.eyebrow}</p>
                <h4 className="mt-3 text-xl font-black uppercase tracking-tight text-white sm:text-2xl">{group.title}</h4>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{group.summary}</p>

                <ul aria-label={group.title + " technology and architecture focus"} className="mt-4 flex flex-wrap gap-2">
                  {group.tags.map((tag) => (
                    <li key={tag} className="border border-white/15 bg-white/[0.025] px-2 py-1 font-mono text-[9px] text-white/75">
                      {tag}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 space-y-3 border-t border-white/10 pt-4">
                  {groupProjects.map((project) => (
                    <div key={project.id} className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="break-words text-sm font-semibold text-white/90">{project.title}</p>
                        <p className="mt-0.5 text-[10px] text-white/60">{project.status}</p>
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-wide">
                        <button
                          type="button"
                          onClick={() => openProject(project)}
                          aria-haspopup="dialog"
                          className="inline-flex min-h-8 items-center gap-1 text-system-green transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green"
                        >
                          Details <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
                        </button>
                        {project.links?.live && (
                          <a
                            href={project.links.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-8 items-center gap-1 text-white/70 transition-colors hover:text-system-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green"
                          >
                            <ExternalLink aria-hidden="true" className="h-3 w-3" />
                            Demo
                          </a>
                        )}
                        {project.links?.github && (
                          <a
                            href={project.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-8 items-center gap-1 text-white/70 transition-colors hover:text-system-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green"
                          >
                            <Code2 aria-hidden="true" className="h-3 w-3" />
                            Source
                          </a>
                        )}
                        {project.links?.pullRequest && (
                          <a
                            href={project.links.pullRequest}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-8 items-center gap-1 text-white/70 transition-colors hover:text-system-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green"
                          >
                            <GitPullRequest aria-hidden="true" className="h-3 w-3" />
                            PR
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div id="project-registry" className="scroll-mt-16 space-y-5 border-t border-white/10 pt-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/60">Full directory</p>
            <h3 className="mt-1 text-xl font-black uppercase tracking-tight text-white">Explore all projects</h3>
          </div>
          <p className="text-xs text-white/60">Search by project, technology, or status.</p>
        </div>

        <label className="flex max-w-2xl items-center gap-3 border border-white/15 bg-white/[0.025] px-4 py-3 text-white/80 focus-within:border-system-green/60">
          <Search aria-hidden="true" size={16} className="shrink-0 text-system-green" />
          <span className="sr-only">Search project registry</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects, technology, or status…"
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/50"
          />
        </label>

        <div role="group" aria-label="Filter projects by category" className="flex flex-wrap items-center gap-2">
          <span className="mr-1 inline-flex items-center gap-2 pr-2 font-mono text-[9px] uppercase tracking-widest text-white/60">
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
                  : "border-white/15 text-white/70 hover:border-white/35 hover:text-white")
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
        <div className="border border-dashed border-white/20 px-6 py-14 text-center">
          <p className="font-mono text-sm uppercase tracking-wider text-white/80">No matching project records</p>
          <p className="mt-2 text-sm text-white/65">Try a different search term or clear the category filter.</p>
          <button
            type="button"
            onClick={() => { setSearch(""); setCategory("all"); }}
            className="mt-5 min-h-10 border border-white/20 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-system-green hover:border-system-green/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green"
          >
            Reset filters
          </button>
        </div>
      )}

      <footer className="border-t border-white/10 pt-5 text-sm leading-relaxed text-white/65">
        Some client work is private. Public source code, live demonstrations, and upstream pull requests are linked wherever they are available.
      </footer>
    </section>
  );
}
