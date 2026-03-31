"use client";

import React from "react";
import { motion } from "framer-motion";
import { Project } from "@/data/projects";
import { Terminal as TerminalIcon, Cpu, Coins, Lock, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface SystemModuleProps {
  project: Project;
  className?: string;
}

const CategoryIcon = ({ category }: { category: Project["category"] }) => {
  switch (category) {
    case "SYSTEM":
      return <TerminalIcon className="w-4 h-4 text-system-green" />;
    case "AUTOMATION":
      return <Cpu className="w-4 h-4 text-system-blue" />;
    case "FINANCE":
      return <Coins className="w-4 h-4 text-system-purple" />;
    case "SECURITY":
      return <Lock className="w-4 h-4 text-red-500" />;
    case "CREATIVE":
      return <Palette className="w-4 h-4 text-white" />;
  }
};

const SystemModule: React.FC<SystemModuleProps> = ({ project, className }) => {
  return (
    <motion.div
      layoutId={`module-${project.id}`}
      className={cn(
        "group relative h-48 sm:h-64 border border-white/10 bg-black/50 p-4 transition-all hover:border-system-green/40 hover:bg-system-green/5 overflow-hidden",
        className
      )}
    >
      {/* OS Corner Decorators */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-system-green" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-system-green" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover:border-system-green" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-system-green" />

      {/* Grid Scanline Overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <div className="flex flex-col h-full justify-between relative z-10">
        <div className="space-y-2">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CategoryIcon category={project.category} />
              <span className="text-[10px] font-mono text-white/40 group-hover:text-system-green transition-colors">
                MOD_{project.id.toUpperCase().replace(/-/g, "_")}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[9px]">
              <span className={cn(
                "w-1.5 h-1.5 rounded-full animate-pulse",
                project.status === "STABLE" ? "bg-system-green" : 
                project.status === "OPTIMIZING" ? "bg-system-blue" : "bg-orange-500"
              )} />
              <span className="text-white/30 uppercase">{project.status}</span>
            </div>
          </div>

          {/* Title & Tagline */}
          <div>
            <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-system-green transition-colors">
              {project.title}
            </h3>
            <p className="text-xs text-white/50 leading-relaxed max-w-[90%]">
              {project.tagline}
            </p>
          </div>
        </div>

        {/* Footer info: System Load Visualization */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {project.tech.slice(0, 3).map((t) => (
              <span key={t} className="px-1.5 py-0.5 border border-white/10 text-[9px] font-mono text-white/40 uppercase">
                {t}
              </span>
            ))}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between font-mono text-[8px] text-white/40">
              <span>SYSTEM_LOAD</span>
              <span>{project.systemLoad}%</span>
            </div>
            <div className="h-1 bg-white/5 overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 whileInView={{ width: `${project.systemLoad}%` }}
                 transition={{ duration: 1.5, ease: "circOut" }}
                 className={cn(
                   "h-full transition-colors",
                   project.systemLoad > 80 ? "bg-system-green" : 
                   project.systemLoad > 50 ? "bg-system-blue" : "bg-system-purple"
                 )}
               />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SystemModule;
