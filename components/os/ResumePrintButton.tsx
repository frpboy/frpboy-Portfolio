"use client";

import { Printer } from "lucide-react";

export default function ResumePrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-11 items-center gap-2 border border-system-green/40 bg-system-green/[0.06] px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-system-green transition-colors hover:border-system-green hover:bg-system-green/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green"
    >
      <Printer aria-hidden="true" className="h-4 w-4" />
      Print / Save as PDF
    </button>
  );
}
