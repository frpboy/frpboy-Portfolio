"use client";

import { motion } from "framer-motion";
import { Terminal as TerminalIcon, Cpu, Wrench, Palette, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/data/projects";
import { cn } from "@/lib/utils";

interface SystemModuleProps {
  project: Project;
  className?: string;
}

function CategoryIcon({ category }: { category: Project["category"] }) {
  switch (category) {
    case "independent":
      return <TerminalIcon aria-hidden="true" className="h-4 w-4 text-system-blue" />;
    case "client":
      return <Cpu aria-hidden="true" className="h-4 w-4 text-system-purple" />;
    case "tool":
      return <Wrench aria-hidden="true" className="h-4 w-4 text-red-300" />;
    case "creative":
      return <Palette aria-hidden="true" className="h-4 w-4 text-white/70" />;
  }
}

export default function SystemModule({ project, className }: SystemModuleProps) {
  return (
    <motion.article
      layoutId={"module-" + project.id}
      className={cn(
        "group relative flex min-h-52 flex-col justify-between overflow-hidden border border-white/10 bg-black/50 p-4 transition-colors hover:border-system-green/40 hover:bg-system-green/5",
        className
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-2 w-2 border-l border-t border-white/30 group-hover:border-system-green" />
      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-2 w-2 border-r border-t border-white/30 group-hover:border-system-green" />
      <div className="relative space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <CategoryIcon category={project.category} />
            <span className="break-all text-[9px] font-mono text-white/40">MOD_{project.id.toUpperCase().replace(/-/g, "_")}</span>
          </div>
          <span className="shrink-0 text-right text-[9px] font-mono uppercase text-white/45">{project.status}</span>
        </div>
        <div>
          <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-system-green">{project.title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-white/50">{project.subtitle}</p>
        </div>
      </div>

      <div className="relative mt-5 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {project.tech.slice(0, 3).map((technology) => (
            <span key={technology} className="border border-white/10 px-1.5 py-1 text-[9px] font-mono uppercase text-white/40">{technology}</span>
          ))}
          {project.tech.length > 3 && <span className="px-1 py-1 text-[9px] text-white/30">+{project.tech.length - 3}</span>}
        </div>
        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[9px] font-mono uppercase tracking-wider text-white/35">
          <span>{project.category}</span>
          <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-system-green/70" />
        </div>
      </div>
    </motion.article>
  );
}
