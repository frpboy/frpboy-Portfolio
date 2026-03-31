"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project, projects } from "@/lib/data/projects";
import ProjectModule from "./ProjectModule";
import ProjectWindow from "./ProjectWindow";

const Dashboard: React.FC = () => {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  return (
    <section className="container mx-auto p-4 md:p-8 space-y-12 relative min-h-screen">
      <AnimatePresence>
        {activeProject && (
          <ProjectWindow 
            project={activeProject} 
            onClose={() => setActiveProject(null)} 
          />
        )}
      </AnimatePresence>

      {/* Header Info - Premium OS Style */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 mt-20">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="relative">
                <div className="w-3 h-3 bg-system-green rounded-full animate-ping absolute" />
                <div className="w-3 h-3 bg-system-green rounded-full relative" />
             </div>
             <h1 className="text-3xl font-black tracking-[0.2em] sm:text-4xl text-white italic uppercase">
               REWARD_LAYER // V2.0
             </h1>
          </div>
          <p className="max-w-[700px] text-white/40 text-sm leading-relaxed sm:text-base font-mono uppercase tracking-wider">
            Accessing centralized registry. consolidating enterprise architectures, 
            independent automations, and creative systems into a single kernel stack.
          </p>
        </div>
        
        <div className="mt-8 md:mt-0 flex flex-col md:items-end gap-3 text-[11px] font-mono text-white/20 uppercase tracking-[0.3em]">
           <div className="flex items-center gap-2">
              <span className="text-white/10">ACTIVE_MODULES</span>
              <span className="text-system-green font-bold">[{projects.length}]</span>
           </div>
           <div className="flex items-center gap-2">
              <span className="text-white/10">SYSTEM_INTEGRITY</span>
              <span className="text-blue-400 font-bold">OPTIMIZED</span>
           </div>
           <div className="flex items-center gap-2 text-[9px] border border-white/5 px-2 py-1 bg-white/[0.02]">
              <span>VER_HASH: 0x82DC1AAF8E03436F98DE4FCA014B48EF</span>
           </div>
        </div>
      </div>

      {/* Grid Layout - Upgraded to ProjectModule */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {/* Biography Module - High Priority */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 border border-white/10 bg-white/[0.02] p-8 backdrop-blur-3xl relative overflow-hidden"
        >
           <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-white/10">CORE_BIOMETRICS_V2</div>
           <div className="space-y-6 md:border-r border-white/5 pr-8">
              <h3 className="text-xl font-black text-white italic tracking-widest uppercase">SYSTM_PHILOSOPHY</h3>
              <p className="text-xs text-white/40 font-mono leading-relaxed uppercase tracking-wider">
                I am an ambivert who talks to servers more than people. I trust logs, evidence, and stack traces over "gut feelings." Atheist. Anti-pseudoscience. Evidence-based architect.
              </p>
           </div>
           <div className="space-y-6 md:col-span-2 pl-2">
              <h3 className="text-xl font-black text-white italic tracking-widest uppercase text-system-green">PRESENT_STATUS</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed">
                Currently serving as a <span className="text-white font-bold">Developer / Systems Engineer</span> at <span className="text-white">Zabnix Private Limited</span>. Building internal enterprise controllers by day, and architecting independent digital solutions by night. Replacing manual chaos with automated control, one system at a time.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                 <div className="px-3 py-1 border border-white/10 bg-white/5 font-mono text-[9px] text-white/40 uppercase">Location: Perinthalmanna (Second Home)</div>
                 <div className="px-3 py-1 border border-white/10 bg-white/5 font-mono text-[9px] text-white/40 uppercase">Uptime: 18+ Years Logic Study</div>
                 <div className="px-3 py-1 border border-white/10 bg-white/5 font-mono text-[9px] text-white/40 uppercase">Status: Architecting...</div>
              </div>
           </div>
        </motion.div>

        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            onClick={() => setActiveProject(project)}
            className="cursor-pointer"
          >
             <ProjectModule project={project} />
          </motion.div>
        ))}
        
        {/* Placeholder for future expansion */}
        <div 
          className="group relative border border-white/5 bg-black/40 p-10 border-dashed flex flex-col items-center justify-center gap-6 transition-all hover:border-system-green/30 hover:bg-system-green/[0.01]"
        >
           <div className="text-white/10 group-hover:text-system-green/40 transition-colors transform group-hover:scale-110 duration-500">
              <svg 
                width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5"
              >
                <path d="M12 5V19M5 12H19" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
           </div>
           <div className="text-center space-y-1">
              <span className="block text-[10px] font-mono text-white/20 uppercase tracking-[0.4em] group-hover:text-white/40 transition-colors">ALLOCATE_NEW_MODULE</span>
              <span className="block text-[8px] font-mono text-white/5 uppercase tracking-widest italic group-hover:text-white/10">Wating for next system shock...</span>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
