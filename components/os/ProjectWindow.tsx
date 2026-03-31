"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/lib/data/projects";
import { X, ChevronRight, Terminal as TerminalIcon, ExternalLink, Terminal, Code } from "lucide-react";

interface ProjectWindowProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectWindow: React.FC<ProjectWindowProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm">
        <motion.div
           layoutId={`module-${project.id}`}
           className="relative w-full max-w-5xl h-[80vh] bg-black border border-white/20 shadow-2xl flex flex-col overflow-hidden"
        >
           {/* Top Bar (Draggable handle aesthetic) */}
           <div className="h-10 border-b border-white/10 flex items-center justify-between px-4 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                 <Terminal className="w-4 h-4 text-system-green" />
                 <span className="text-[10px] font-mono text-white/50 tracking-widest uppercase">
                    SYSTEM_DEPLOY // {project.id.toUpperCase()}
                 </span>
              </div>
              <button 
                onClick={onClose}
                className="group p-1 border border-transparent hover:border-white/10 transition-colors"
                aria-label="Close window"
              >
                 <X className="w-4 h-4 text-white/50 group-hover:text-white" />
              </button>
           </div>

           {/* Content Area */}
           <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="grid md:grid-cols-[1fr_300px] h-full">
                 {/* Main Content */}
                 <div className="p-8 space-y-12">
                    <div className="space-y-4">
                       <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic">
                          {project.title}
                       </h2>
                       <p className="text-sm font-mono text-system-green/60 uppercase tracking-widest">
                          {project.subtitle}
                       </p>
                       <p className="text-lg text-white/60 font-light leading-relaxed max-w-2xl pt-4">
                          {project.description}
                       </p>
                    </div>

                    <div className="space-y-6">
                       <h3 className="text-xs font-bold text-system-green font-mono uppercase tracking-[0.2em]">
                          Architectural_Highlight
                       </h3>
                       <div className="p-6 border border-white/5 bg-white/[0.02] flex items-start gap-4">
                          <ChevronRight className="w-4 h-4 text-system-green mt-1 shrink-0" />
                          <p className="text-white/60 font-light italic">
                             {project.highlight}
                          </p>
                       </div>
                    </div>
                 </div>

                 {/* Sidebar Specs */}
                 <div className="border-l border-white/10 bg-white/[0.01] p-8 space-y-8">
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                          Execution_Role
                       </h4>
                       <div className="text-sm text-white/80 font-mono font-bold uppercase tracking-tighter">
                          {project.role}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                          Tech_Stack
                       </h4>
                       <div className="flex flex-wrap gap-2">
                          {project.tech.map((t) => (
                             <span key={t} className="px-2 py-1 border border-white/10 text-[9px] font-mono text-white/50 uppercase">
                                {t}
                             </span>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                          System_Metrics
                       </h4>
                       <div className="space-y-4">
                          <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${project.stats.status === 'STABLE' ? 'bg-blue-400' : 'bg-system-green animate-pulse'}`} />
                             <span className="text-xs font-bold text-white uppercase">{project.stats.status}</span>
                          </div>
                          
                          <div className="space-y-1">
                             <div className="flex justify-between text-[8px] text-white/20 uppercase tracking-widest">
                                <span>Throughput</span>
                                <span>{project.stats.load}%</span>
                             </div>
                             <div className="h-1 w-full bg-white/5">
                                <motion.div 
                                   initial={{ width: 0 }}
                                   animate={{ width: `${project.stats.load}%` }}
                                   className="h-full bg-system-green/50"
                                />
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="pt-12 space-y-3">
                       {project.links?.github && (
                          <a 
                            className="w-full flex items-center justify-between p-3 border border-white/10 bg-white/5 hover:border-system-green hover:bg-system-green/10 transition-all group" 
                            href={project.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                             <span className="text-xs font-mono text-white/50 group-hover:text-white uppercase">Access_Repo</span>
                             <Code className="w-4 h-4 text-white/30 group-hover:text-system-green" />
                          </a>
                       )}
                       {project.links?.live && (
                          <a 
                            className="w-full flex items-center justify-between p-3 border border-white/10 bg-white/5 hover:border-system-green hover:bg-system-green/10 transition-all group" 
                            href={project.links.live}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                             <span className="text-xs font-mono text-white/50 group-hover:text-white uppercase">Live_Demo</span>
                             <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-system-green" />
                          </a>
                       )}
                    </div>
                 </div>
              </div>
           </div>
           
           {/* Terminal Output Layer (Aesthetic touch) */}
           <div className="h-10 border-t border-white/5 bg-black px-4 flex items-center">
              <div className="flex items-center gap-4 text-[9px] font-mono text-white/20 uppercase">
                 <span>PID: {Math.floor(Math.random() * 8999) + 1000}</span>
                 <span>STATE: ACTIVE</span>
                 <span className="text-system-green">SIG_PROXIMITY_LOCK: 01A</span>
              </div>
           </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectWindow;
