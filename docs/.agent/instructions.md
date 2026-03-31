# Agent Instructions: Antigravity @ frpboy.in

## Project Context: Rahul OS — The Evolution of Logic
You are building a high-tech, "system-first" portfolio for a Systems Architect. Every interaction should feel like a command or a system module operation.

## 1. Visual Governance (NON-NEGOTIABLE)
- **Dark Mode Only:** All UI components should use #000000 (OLED Black) as the base, with slight slate/zinc depth.
- **Neon Logic:** Use systematic accent colors (Amber/Green/Blue/Purple) to represent the "Level" of the system.
- **Glassmorphism:** Use `backdrop-blur-md` and subtle borders (`border-white/10`) for expanded project windows.
- **Typography:**
  - **Headings:** Bold, clean sans-serif (Inter/Geist).
  - **System Text:** Monospace (JetBrains Mono) for logs, labels, and metadata.
- **Animation Sync:**
  - GSAP for Timeline scroll.
  - Framer Motion for UI/Modal/Layout transitions.
  - Lenis for overall scroll smoothness.

## 2. Component Design Principles
- **Module Windows:** When a project is clicked, it should use Framer Motion's `layoutId` to "expand" from a small dashboard tile to a full-screen or large window. This maintains the "Operating System" feel.
- **System Logs:** Key actions (loading, opening project, switching levels) should trigger a subtle monospace log message at the bottom status bar.
- **No Over-Animation:** Animations must be fast and purposeful. Avoid "Dribbble-style" floating nonsense that slows down the user.

## 3. Implementation Workflow
1. **Schema Check:** Always refer to `/data/projects.ts` before modifying project UI.
2. **Standard Contract:** All project detail views MUST show: Problem, Solution, Impact, and Architecture.
3. **Responsive first:** Ensure that the "System Dashboard" translates well into a vertical stacked layout on mobile.

## 4. Coding Style
- **Next.js 15:** Use `use server` or `use client` directives properly. Prefer Server Components where possible.
- **Iconography:** Use `lucide-react` for clean, consistent system icons.
- **Ref-first:** Use `useRef` for GSAP animations to avoid re-render cycles.
