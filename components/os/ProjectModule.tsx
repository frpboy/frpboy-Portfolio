"use client";

import { Project } from '@/lib/data/projects';
import { Cpu, ExternalLink, Code, Code2, Layers, ShieldCheck, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProjectModule({ project }: { project: Project }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative border border-white/10 bg-black/40 p-5 font-mono transition-all hover:border-system-green/50 hover:bg-system-green/[0.02]"
    >
      {/* Glow Effect Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,255,156,0.05)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Top Bar - System Info */}
      <div className="mb-6 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-2 text-system-green/80">
          <Cpu size={12} className="group-hover:animate-spin" />
          <span className="tracking-widest">MOD_{project.id.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-2">
          {project.stats.status === 'STABLE' && (
            <div className="flex items-center gap-1.5 text-blue-400">
               <ShieldCheck size={12} />
               <span className="font-bold">STABLE</span>
            </div>
          )}
          {project.stats.status === 'OPTIMIZING' && (
            <div className="flex items-center gap-1.5 text-yellow-400">
               <Activity size={12} className="animate-pulse" />
               <span className="font-bold">OPTIMIZING</span>
            </div>
          )}
        </div>
      </div>

      {/* Project Meta */}
      <div className="space-y-4 relative z-10">
        <div className="space-y-1">
          <h3 className="text-2xl font-black tracking-tighter text-white group-hover:text-system-green transition-colors uppercase italic">
            {project.title}
          </h3>
          <p className="text-[10px] text-white/40 uppercase tracking-widest">{project.subtitle}</p>
        </div>

        <p className="text-sm text-white/60 leading-relaxed font-light line-clamp-2">
          {project.description}
        </p>

        {/* Tech Stack Horizontal Scroll */}
        <div className="flex flex-wrap gap-2 pt-2">
          {project.tech.map(t => (
            <span key={t} className="border border-white/5 bg-white/[0.03] px-2 py-0.5 text-[9px] text-white/50 uppercase tracking-tighter">
              {t}
            </span>
          ))}
        </div>

        {/* System Load Section */}
        <div className="space-y-2 pt-4">
          <div className="flex justify-between text-[9px] text-white/20 uppercase tracking-[0.2em]">
            <span>System_Throughput</span>
            <span>{project.stats.load}%</span>
          </div>
          <div className="h-[2px] w-full bg-white/5 relative overflow-hidden">
            <motion.div 
               initial={{ width: 0 }}
               whileInView={{ width: `${project.stats.load}%` }}
               transition={{ duration: 1.5, ease: "circOut" }}
               className="h-full bg-system-green shadow-[0_0_10px_#00FF9C]" 
            />
          </div>
        </div>

        {/* Highlight Banner */}
        <div className="p-3 border-l-2 border-system-green/30 bg-system-green/[0.03] text-[10px] text-white/80 leading-snug">
           <span className="text-system-green font-bold">HIGHLIGHT:</span> {project.highlight}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4">
           {project.links?.github && (
             <a href={project.links.github} target="_blank" className="text-white/30 hover:text-white transition-colors">
               <Code size={16} />
             </a>
           )}
           {project.links?.live && (
             <a href={project.links.live} target="_blank" className="text-white/30 hover:text-white transition-colors">
               <ExternalLink size={16} />
             </a>
           )}
           <div className="ml-auto font-mono text-[9px] text-white/10 uppercase">
              ARCH_ID // {project.category.toUpperCase()}
           </div>
        </div>
      </div>
    </motion.div>
  );
}
