"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Code2, ExternalLink, FileText, Terminal, X } from "lucide-react";
import type { Project } from "@/lib/data/projects";

interface ProjectWindowProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectWindow({ project, onClose }: ProjectWindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project || !windowRef.current) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.dispatchEvent(new CustomEvent("portfolio:scroll-lock", { detail: { locked: true } }));
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !windowRef.current) return;
      const focusable = Array.from(
        windowRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.getAttribute("aria-hidden") !== "true");

      if (focusable.length === 0) {
        event.preventDefault();
        windowRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      window.dispatchEvent(new CustomEvent("portfolio:scroll-lock", { detail: { locked: false } }));
      previouslyFocused?.focus();
    };
  }, [project, onClose]);

  if (!project) return null;

  const links = [
    project.links?.github
      ? { href: project.links.github, label: "View source", icon: Code2 }
      : null,
    project.links?.live
      ? { href: project.links.live, label: "Live demo", icon: ExternalLink }
      : null,
    project.links?.documentation
      ? { href: project.links.documentation, label: "Documentation", icon: FileText }
      : null,
  ].filter((link): link is { href: string; label: string; icon: typeof Code2 } => link !== null);

  const sections = [
    { title: "Problem", content: project.problem },
    { title: "Solution", content: project.solution },
    { title: "Contribution", content: project.contribution },
    { title: "Impact and evidence", content: project.impact },
    { title: "Architecture", content: project.architecture },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-2 backdrop-blur-sm sm:p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-label="Project details backdrop"
    >
      <motion.div
        ref={windowRef}
        layoutId={"module-" + project.id}
        role="dialog"
        aria-modal="true"
        aria-labelledby={"project-title-" + project.id}
        aria-describedby={"project-description-" + project.id}
        tabIndex={-1}
        initial={{ y: 12, scale: 0.99 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 10, scale: 0.99 }}
        transition={{ duration: 0.2 }}
        className="relative flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden border border-white/20 bg-[#050706] shadow-2xl outline-none"
      >
        <div className="flex min-h-12 items-center justify-between gap-3 border-b border-white/10 bg-white/[0.02] px-4">
          <div className="flex min-w-0 items-center gap-2">
            <Terminal aria-hidden="true" className="h-4 w-4 shrink-0 text-system-green" />
            <span className="truncate text-[10px] font-mono uppercase tracking-widest text-white/55">
              PROJECT_RECORD // {project.id.toUpperCase().replace(/-/g, "_")}
            </span>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-transparent text-white/60 transition-colors hover:border-white/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="grid md:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-9 p-5 sm:p-8">
              <header className="space-y-3">
                <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-system-green/70">{project.category} / {project.status}</div>
                <h2 id={"project-title-" + project.id} className="break-words text-3xl font-black uppercase italic tracking-tighter text-white sm:text-5xl">
                  {project.title}
                </h2>
                <p className="text-xs font-mono uppercase tracking-wider text-white/45">{project.subtitle}</p>
                <p id={"project-description-" + project.id} className="max-w-3xl pt-2 text-base leading-relaxed text-white/70">
                  {project.description}
                </p>
              </header>

              <section className="space-y-3 border-l-2 border-system-green/40 pl-4">
                <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-system-green">Project highlight</h3>
                <p className="text-sm leading-relaxed text-white/70">{project.highlight}</p>
              </section>

              <div className="grid gap-6 sm:grid-cols-2">
                {sections.map((section) => (
                  <section key={section.title} className="space-y-2">
                    <h3 className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/40">{section.title}</h3>
                    <p className="text-sm leading-relaxed text-white/65">{section.content}</p>
                  </section>
                ))}
              </div>
            </div>

            <aside className="space-y-8 border-t border-white/10 bg-white/[0.015] p-5 sm:p-8 md:border-l md:border-t-0">
              <section className="space-y-3">
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/35">Role</h3>
                <p className="text-sm font-semibold text-white/80">{project.role}</p>
              </section>

              <section className="space-y-3">
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/35">Technology</h3>
                {project.tech.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((technology) => (
                      <span key={technology} className="border border-white/10 px-2 py-1 text-[9px] uppercase tracking-wide text-white/60">{technology}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs leading-relaxed text-white/40">Technology details are not published for this entry.</p>
                )}
              </section>

              <section className="space-y-3">
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/35">Available links</h3>
                {links.length > 0 ? (
                  <div className="space-y-2">
                    {links.map(({ href, label, icon: Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-11 items-center justify-between gap-3 border border-white/10 bg-white/[0.025] px-3 py-2 text-xs font-mono text-white/65 transition-colors hover:border-system-green/60 hover:text-system-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green"
                      >
                        <span>{label}</span>
                        <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs leading-relaxed text-white/40">No public source or verified demo is available for this entry.</p>
                )}
              </section>

              <div className="border-t border-white/10 pt-4 text-[9px] font-mono uppercase leading-relaxed tracking-wider text-white/25">
                Public claims are limited to the evidence linked from this entry.
                <ArrowUpRight aria-hidden="true" className="mt-2 h-4 w-4 text-system-green/60" />
              </div>
            </aside>
          </div>
        </div>

        <div className="flex min-h-9 items-center border-t border-white/10 bg-black px-4 text-[9px] font-mono uppercase tracking-widest text-white/30">
          <span>DETAIL_VIEW // {project.id}</span>
          <span className="ml-auto text-system-green/70">ESC TO CLOSE</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
