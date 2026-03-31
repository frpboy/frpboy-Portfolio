# Technology Stack: Rahul OS Portfolio

## 1. Core Framework & Language
- **Next.js 15 (App Router):** Leveraging React 19 features, Server Components for performance, and seamless Vercel deployment.
- **TypeScript:** Ensuring strict typing for system data and component props to minimize runtime errors.

## 2. UI & Styling
- **Tailwind CSS:** For utility-first rapid styling and efficient theme management (Dark mode).
- **shadcn/ui:** For accessible, high-quality primitive components (Modals, Buttons, Hover-cards).
- **Glassmorphism:** Custom CSS utilities for frosted glass effects in the "Architect" phase.

## 3. Motion & Interaction (The Experience Engine)
- **Framer Motion:** Primary engine for UI transitions, module expansions, and micro-interactions.
- **GSAP + ScrollTrigger:** For complex, scroll-synced timeline animations where high precision is required (especially the "Entropy Scroll").
- **Lenis:** Smooth scroll library to provide a cinematic, non-jerky navigation experience.
- **React Three Fiber (Subtle):** Low-overhead 3D particle systems or grid backgrounds for the "System OS" feel.

## 4. Systems Data & Content
- **Static Assets:** System data (projects, timeline) stored in TypeScript (`/data/*.ts`) for ultra-low latency.
- **GitHub API:** Real-time fetching of repository stars and project activity.
- **n8n (Optional):** For custom automation workflows (e.g., contact form processing or live system monitoring).

## 5. Development Standards
- **Component-Driven:** Atomic components with clean separation of concerns.
- **Animation Decoupling:** Animation logic segregated into utility hooks (`/hooks/use-system-motion.ts`).
- **Responsive Systems:** First-class mobile support while maintaining the "System Dashboard" desktop experience.

## 6. Project Architecture
```bash
/app                  # Next.js App Router root
/components
  /os                # OS-specific UI (Dashboard, Windows)
  /timeline          # Narrative level sections
  /ui                # shadcn & base primitives
/lib
  /animations        # GSAP/Framer Motion configs
  /utils             # Formatting, type helpers
/data                # Project & story definitions
/hooks               # Custom React hooks (useScroll, useStatus)
/public              # Lottie, SVGs, static assets
```
