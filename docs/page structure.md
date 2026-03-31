# Page Structure: Rahul OS Portfolio

## 1. Global Layout (`/app/layout.tsx`)
- **SystemStatusBar:** Sticky top bar with metadata.
- **LenisSmoothScroll:** Wrapper for smooth navigation.
- **SystemLoader (One-time):** The boot animation overlay.
- **GlobalStatusPanel (Floating):** Minimized bottom bar for logs.

## 2. Dashboard View (`/app/page.tsx`)
The root page is an "Operating System" dashboard showing interactive modules.

### 2.1 The Hero (Level 0)
- **Status Badge:** `[ STATUS: ACTIVE ]`.
- **Typing headline:** `Systems Engineer / Vibe Coder`.
- **SystemPrompt:** A blinking terminal cursor ready for scroll interaction.

### 2.2 The Narrative Timeline (The Scroll)
- **Level 1–10 Sections:** 11 full-height (100vh) scrolling sections.
- **Visual Upgrades:** Triggered based on GSAP scroll-markers.
- **Narrative Content:** Derived from `my story.md`.

### 2.3 The Module Grid (Level 11)
A grid of **System Modules** leading to technical deep-dives:
- **Module: Flagship Projects**
  - Sub-modules: Zerpai, Sahakar, Reddit Sniper.
- **Module: Personal Builds**
  - Sub-modules: Specly, Nah That's Fake.
- **Module: Hardware Lab**
  - The skill matrix view.
- **Module: Human Elements**
  - Bio, philosophy, and GitHub contributons.

## 3. Project Detail View (`/app/projects/[slug]/page.tsx`)
- **SystemWindow Overlay:** A high-impact panel that overlays the dashboard.
- **Metadata Sidebar:** Tech stack icons, status, scale.
- **Main Content:** The Problem/Solution/Impact narrative.
- **Interactive Terminal:** Optional terminal window showing code snippets or logs for the project.

## 4. Contact Modal (`/app/contact/page.tsx`)
- **SystemDialog:** Minimal form integrated into the OS UI.
- **Direct Links:** LinkedIn, GitHub, Email as "System Ports".
