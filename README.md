# Rahul Muraleedharan — Portfolio OS

**Full Stack Developer & Automation Specialist**

Portfolio website: [www.frpboy.in](https://www.frpboy.in/)  
Source: [frpboy/frpboy-Portfolio](https://github.com/frpboy/frpboy-Portfolio)  
GitHub: [frpboy](https://github.com/frpboy) · LinkedIn: [rahul-muraleedharan-it](https://www.linkedin.com/in/rahul-muraleedharan-it/)

Portfolio OS is a dark, terminal-inspired portfolio that tells a professional story through a cinematic timeline and searchable project registry. It retains the OS visual concept while making project links, statuses, and evidence limitations explicit.

## What it showcases

- A professional timeline from hardware diagnostics to software development and automation.
- A single typed project registry in lib/data/projects.ts.
- Searchable project cards with category filters.
- Accessible project detail windows with Escape-to-close behavior, focus handling, and source/demo actions.
- Statically generated `/projects` and `/projects/[slug]` pages backed by the curated registry.
- A dedicated `/open-source` index that distinguishes maintained forks from upstream contributions.
- Clear publication statuses for public source, prototypes, and unverified entries.
- Reduced-motion support, canonical metadata, Open Graph artwork, a web manifest, robots rules, and a sitemap.

## Technology

| Area | Implementation |
|---|---|
| Framework | Next.js 16.4.3 App Router |
| UI and language | React 19.2.4, TypeScript |
| Styling | Tailwind CSS v4 |
| UI motion | Framer Motion |
| Timeline motion | GSAP and ScrollTrigger |
| Smooth scrolling | Lenis, disabled when reduced motion is requested |
| Icons | Lucide React |
| Validation | ESLint, TypeScript, and a Node.js project-registry check |
| CI | GitHub Actions |

Only public repositories confirmed during the audit are linked. A live demo is included only when its destination could be verified. Private project source and internal implementation details are not linked.

## Portfolio selection and client privacy

The project registry is intentionally curated; it is not a mirror of every repository on the GitHub account. Empty starters, personal/private applications, forks with no attributable contribution, and projects with stale or insufficient documentation are not automatically promoted. Fork-based work is labelled as such rather than presented as original authorship.

Client-facing projects are included only when their public presentation is appropriate. Private source, authenticated operational systems, proprietary implementation details, and confidential records are not exposed through public project links. Public client repositories are linked only when the repository and its contents are suitable for public presentation.

## Requirements

- Node.js 22.0 or later
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
app/projects/                Crawlable project index and statically generated project detail pages
app/open-source/              Curated index of maintained forks and upstream contributions
components/os/               Project registry, detail window and interface chrome
components/timeline/          Narrative sections and motion effects
lib/animations/               Lenis and ScrollTrigger lifecycle
lib/data/projects.ts           Typed, central project registry
scripts/validate-projects.mjs  Registry, URL and privacy guardrails
docs/                         Project notes and engineering guidance
~~~

## Content and evidence policy

Project descriptions explain the problem, approach, contribution, implementation shape, and known limitations. Do not add user counts, revenue, reliability percentages, performance gains, certifications, employment claims, or deployment claims without evidence. A public repository does not, by itself, prove that its deployed demo is operational.


## Backend services and integrations

The portfolio uses Neon PostgreSQL for anonymous visitor analytics and application metadata. Next.js Route Handlers run as Vercel Functions and use the Neon serverless HTTP driver.

Prepared integrations:
- **Neon AI Gateway + Pinecone:** grounded portfolio Q&A; Pinecone's integrated `llama-text-embed-v2` model handles chunk and query embeddings, while Neon AI Gateway generates the final answer.
- **Cal.com:** a scheduling link at `/book`, a contact CTA, and a signed booking webhook endpoint.
- **Neon Object Storage:** archives original knowledge-source text in a private branch-aware bucket before indexing.
- **Neon Realtime:** provisioned for future live analytics views. Visitor analytics currently refreshes after tracked route events.

See [docs/NEON_INTEGRATIONS_SETUP.md](docs/NEON_INTEGRATIONS_SETUP.md) for the database migration, required environment variables, Pinecone index configuration, knowledge ingestion, Cal.com webhook setup, and activation steps.

Apply database migrations in order:
1. `database/migrations/001_visitor_analytics.sql` — visitor, page-view, aggregate-view, and recording-function schema.
2. `database/migrations/002_portfolio_integrations.sql` — knowledge-source versioning, assistant rate limiting, and Cal.com booking events.

Both migrations are safe to run against the already-provisioned production schema; the initial table and index creation uses `IF NOT EXISTS`, and the views/functions are created or replaced.
