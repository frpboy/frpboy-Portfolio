# Page structure — Portfolio OS

## Root layout

- app/layout.tsx defines site metadata, viewport settings, fonts, the global status bar, the optional intro, the illustrative activity trace, and the scrolling wrapper.
- app/globals.css defines the dark theme, neon accents, focus styling, and reduced-motion fallback.
- app/manifest.ts, app/robots.ts, and app/sitemap.ts expose standard metadata routes.
- app/opengraph-image.tsx generates the social-sharing image.

## Home page

1. **HeroSection** — professional headline and a link to selected work.
2. **OriginSection** — a practical troubleshooting mindset.
3. **SparkSection** — how repetitive work led to automation.
4. **TransitionShock** — transition from diagnosing faults to delivering systems.
5. **LogicSection** — diagnose, automate, and engineer.
6. **Dashboard** — searchable, filterable project registry.
7. **Contact footer** — email, GitHub, LinkedIn, and canonical website.

## Project registry and detail view

- lib/data/projects.ts contains all project records.
- components/os/ProjectModule.tsx renders a project card and explicit source/demo actions.
- components/os/Dashboard.tsx owns search, category filters, the empty state, and selected-project state.
- components/os/ProjectWindow.tsx renders a modal dialog with Problem, Solution, Contribution, Impact and evidence, Architecture, role, technology, status, and available links.

Opening project details and following external links are separate actions. The dialog supports Escape, focus containment, focus restoration, and background scroll locking.

## Motion and status chrome

- lib/animations/ScrollEngine.tsx manages Lenis and ScrollTrigger setup and cleanup, unless reduced motion is requested.
- components/os/SystemLoader.tsx provides a short optional introduction without pretending to measure build progress.
- components/os/SystemStatusBar.tsx displays the portfolio label and local clock.
- components/os/SystemActivityLog.tsx contains a static illustrative trace, not production telemetry.
