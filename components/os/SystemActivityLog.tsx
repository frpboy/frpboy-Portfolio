const ACTIVITY_TRACE = [
  "NARRATIVE: HARDWARE_DIAGNOSTICS",
  "WORKFLOW: REPEATED_TASK_IDENTIFIED",
  "APPROACH: AUTOMATION_AND_VALIDATION",
  "REGISTRY: PUBLIC_LINKS_LABELLED",
  "MODE: DECORATIVE_ACTIVITY_TRACE",
];

export default function SystemActivityLog() {
  return (
    <aside
      aria-hidden="true"
      className="pointer-events-none fixed bottom-10 left-5 z-30 hidden w-64 border-l border-system-green/20 pl-3 font-mono text-[8px] leading-relaxed text-white/25 md:block"
    >
      <div className="mb-2 text-[8px] uppercase tracking-[0.25em] text-system-green/50">Activity trace / illustrative</div>
      {ACTIVITY_TRACE.map((entry) => (
        <div key={entry} className="truncate">{">"} {entry}</div>
      ))}
    </aside>
  );
}
