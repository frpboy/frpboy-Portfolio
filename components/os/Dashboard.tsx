"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import ProjectModule from "./ProjectModule";
import ProjectWindow from "./ProjectWindow";
import { projects, type Project, type ProjectCategory } from "@/lib/data/projects";

const categories: { value: ProjectCategory | "all"; label: string }[] = [
  { value: "all", label: "All work" },
  { value: "independent", label: "Independent" },
  { value: "tool", label: "Tools" },
  { value: "enterprise", label: "Enterprise" },
  { value: "client", label: "Client work" },
  { value: "creative", label: "Creative" },
];

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
            A selection of software, automation, and creative builds. Open a record to see the problem,
            approach, contribution, implementation notes, and only the source or demo links that are available.
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

      <div className="space-y-5">
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

      <footer className="border-t border-white/10 pt-5 font-mono text-[9px] uppercase tracking-wider text-white/25">
        Link availability reflects the public evidence reviewed for this registry; an absent link is deliberate.
      </footer>
    </section>
  );
}
