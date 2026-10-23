# Rahul Muraleedharan — Portfolio OS

**Full Stack Developer & Automation Specialist**

Portfolio website: [www.frpboy.in](https://www.frpboy.in/)  
Source: [frpboy/frpboy-Portfolio](https://github.com/frpboy/frpboy-Portfolio)  
GitHub: [frpboy](https://github.com/frpboy) · LinkedIn: [k4nn4n](https://www.linkedin.com/in/k4nn4n)

Portfolio OS is a dark, terminal-inspired portfolio that tells a professional story through a cinematic timeline and searchable project registry. It retains the OS visual concept while making project links, statuses, and evidence limitations explicit.

## What it showcases

- A professional timeline from hardware diagnostics to software development and automation.
- A single typed project registry in lib/data/projects.ts.
- Searchable project cards with category filters.
- Accessible project detail windows with Escape-to-close behavior, focus handling, and source/demo actions.
- Honest publication statuses for public source, prototypes, private case studies, and unverified entries.
- Reduced-motion support, canonical metadata, Open Graph artwork, a web manifest, robots rules, and a sitemap.

## Technology

| Area | Implementation |
|---|---|
| Framework | Next.js 16.4.2 App Router |
| UI and language | React 19.2.4, TypeScript |
| Styling | Tailwind CSS v4 |
| UI motion | Framer Motion |
| Timeline motion | GSAP and ScrollTrigger |
| Smooth scrolling | Lenis, disabled when reduced motion is requested |
| Icons | Lucide React |
| Validation | ESLint, TypeScript, and a Node.js project-registry check |
| CI | GitHub Actions |

Only public repositories confirmed during the audit are linked. A live demo is included only when its destination could be verified. Private project source and internal implementation details are not linked.

## Requirements

- Node.js 20.9 or later
- npm (use the committed package-lock.json for repeatable installation)

## Local development

~~~bash
npm ci
npm run dev
~~~

Open [http://localhost:3000](http://localhost:3000).

## Validation

~~~bash
npm run lint
npm run typecheck
npm run test:registry
npm run build
~~~

The GitHub Actions workflow runs these checks for pull requests to main and pushes to main.

## Repository structure

~~~text
app/                         Next.js pages, metadata, manifest, sitemap and social image
components/os/               Project registry, detail window and interface chrome
components/timeline/          Narrative sections and motion effects
lib/animations/               Lenis and ScrollTrigger lifecycle
lib/data/projects.ts           Typed, central project registry
scripts/validate-projects.mjs  Registry, URL and privacy guardrails
docs/                         Project notes and engineering guidance
~~~

## Content and evidence policy

Project descriptions explain the problem, approach, contribution, implementation shape, and known limitations. Do not add user counts, revenue, reliability percentages, performance gains, certifications, employment claims, or deployment claims without evidence. A public repository does not, by itself, prove that its deployed demo is operational.
