"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Code2, ExternalLink } from "lucide-react";
import type { Project } from "@/lib/data/projects";

const statusStyles: Record<Project["status"], string> = {
  "Active development": "text-system-green",
  "Pre-release": "text-system-blue",
  Prototype: "text-amber-300",
  "Live deployment": "text-system-green",
  "Public source available": "text-white/70",
  "Private case study": "text-violet-300",
  "Legacy experience": "text-white/50",
  "Not verified": "text-amber-200/70",
};

interface ProjectModuleProps {
  project: Project;
  onOpen: (project: Project) => void;
}

export default function ProjectModule({ project, onOpen }: ProjectModuleProps) {
  return (
    <motion.article
      layoutId={"module-" + project.id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      className="group relative flex h-full flex-col border border-white/10 bg-black/50 p-5 font-mono transition-colors hover:border-system-green/50 hover:bg-system-green/[0.025] focus-within:border-system-green/50"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,255,156,0.06)_0%,transparent_60%)] opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative z-10 flex items-start justify-between gap-3 text-[10px]">
        <span className="break-all tracking-widest text-system-green/80">
          MOD_{project.id.toUpperCase().replace(/-/g, "_")}
        </span>
        <span className={"shrink-0 text-right font-semibold " + statusStyles[project.status]}>
          {project.status}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onOpen(project)}
        aria-label={"Open project details: " + project.title}
        className="relative z-10 mt-5 flex flex-1 flex-col text-left outline-none"
      >
        <span className="flex items-start gap-2">
          <span className="text-2xl font-black uppercase italic tracking-tight text-white transition-colors group-hover:text-system-green">
            {project.title}
          </span>
          <ArrowUpRight aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-white/30 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-system-green" />
        </span>
        <span className="mt-1 text-[10px] uppercase tracking-widest text-white/40">
          {project.subtitle}
        </span>
        <span className="mt-4 line-clamp-3 font-sans text-sm leading-relaxed text-white/60">
          {project.description}
        </span>

        <span className="mt-5 flex flex-wrap gap-2">
          {project.tech.slice(0, 4).map((technology) => (
            <span key={technology} className="border border-white/10 bg-white/[0.025] px-2 py-1 text-[9px] uppercase tracking-wide text-white/50">
              {technology}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span className="px-1 py-1 text-[9px] text-white/30">+{project.tech.length - 4} more</span>
          )}
        </span>
      </button>

      <div className="relative z-10 mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/10 pt-4 text-[10px] uppercase tracking-wider">
        {project.links?.github && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={"View source for " + project.title + " on GitHub"}
            className="inline-flex min-h-8 items-center gap-2 text-white/55 transition-colors hover:text-system-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green"
          >
            <Code2 aria-hidden="true" size={14} />
            View source
          </a>
        )}
        {project.links?.live && (
          <a
            href={project.links.live}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={"Open live demo for " + project.title}
            className="inline-flex min-h-8 items-center gap-2 text-white/55 transition-colors hover:text-system-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green"
          >
            <ExternalLink aria-hidden="true" size={14} />
            Live demo
          </a>
        )}
        <span className="ml-auto text-[9px] text-white/25">{project.category}</span>
      </div>
    </motion.article>
  );
}
