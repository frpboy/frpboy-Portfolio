# Skill: UI Governance & Standards — Rahul OS

This skill defines the visual rules and UI components for the Rahul OS Portfolio to ensure consistency and a "high-end system" feel across all development phases.

## 1. Global Visual System
- **OLED First:** Base background (#000000). Surface colors: #0D0D0E, #111112.
- **Accents:**
  - **Terminal Green:** #00FF9C (Primary level text/logs).
  - **Cyber Blue:** #00D1FF (Systems/Architecture).
  - **Phantom Purple:** #BD00FF (Final Level/Architect).
- **Glass Effects:** `bg-white/5 backdrop-blur-xl border-white/10`.

## 2. Interaction Levels (Entropy)
The visual state changes based on the user's progress:
- **Level 0-2 (The Seed):** Heavy CRT noise, glitch effects, monospace overflow.
- **Level 3-6 (The Foundation):** High-contrast grid layouts, sharp borders, boxy components.
- **Level 7-10 (The Architect):** Soft shadows, glassmorphism, fluid animations.

## 3. Core Component Library
### 3.1 `SystemStatusBar`
- Sticky top bar.
- Shows: `Rahul OS`, `Vibe Intensity`, `Kernel Status`, `Location`.

### 3.2 `ModuleCard`
- Dashboard tile (1x1 or 2x1 grid).
- Shows: Icon + Title + Meta (Status).
- Hover: 1px subtle glow + expand layout.
- Click: Triggers `SystemWindow`.

### 3.3 `SystemWindow`
- The immersive project or section view.
- Expanded from a `ModuleCard`.
- **Content Hierarchy:**
  - Title & Tagline (H1).
  - Problem/Context (P).
  - Solution/Architecture (Grid).
  - Live Demo/GitHub CTA (Actions).

## 4. Animation Standards (GSAP + Framer Motion)
- **Entering:** `Power3.out` (0.8s) for level transitions.
- **Micro-Interactions (Click/Hover):** `Spring` (stiffness: 400, damping: 30) for physical UI feel.
- **Scroll Sync:** Non-scrubbed "Triggered" animations for better performance.

## 5. Performance Guidelines
- **No Large Image Assets:** Use SVG, CSS patterns (Dot Matrix), or Lottie where possible.
- **Code Splitting:** Dynamic imports for heavy 3D or animation components (`next/dynamic`).
- **Preloading:** Use `priority` for Hero/Initial boot assets.
