# Product Requirements Document — Portfolio OS

## Purpose

Portfolio OS presents Rahul Muraleedharan as a Full Stack Developer & Automation Specialist through a distinctive operating-system-inspired interface. It should help recruiters, engineering leads, collaborators, and potential clients quickly understand the work, the approach, and where public source or a live demo can be inspected.

## Audience and primary journeys

- Understand the professional progression from hardware diagnostics to software engineering and automation.
- Browse selected projects using search and category filters.
- Open a project detail view to read the problem, solution, contribution, evidence/impact note, architecture, role, and technologies.
- Follow an exact public repository, verified live demo, or documentation link when available.
- Reach out through professional contact links.

## Visual direction

Preserve the OLED-black interface, restrained neon-green/blue accents, monospaced metadata, cinematic timeline, and tile-to-window visual language. Do not replace the identity with a generic portfolio template.

## Functional requirements

### Project registry
- All cards and detail windows consume the same typed registry.
- Each record contains a stable unique ID, title, category, status, description, problem, solution, contribution, impact/evidence, architecture, and highlight.
- Technology tags and links are optional when not supported by current evidence.
- Project search matches relevant text and category filtering remains keyboard operable.
- Empty search/filter results provide a clear recovery action.

### Project detail dialog
- A project card opens detail without nesting external anchors inside the open control.
- Dialog uses semantic dialog and accessible-name attributes.
- Escape closes the dialog.
- Keyboard focus remains within the dialog while it is open and returns to the invoking element when closed.
- Background scrolling is suppressed while the dialog is active.
- Only links with real destinations are rendered, with distinct labels for source, live demo, and documentation.

### Accessibility and motion
- Keyboard focus remains visible.
- Icon-only controls have accessible names.
- Responsive layouts must not force horizontal scrolling at narrow widths.
- Respect prefers-reduced-motion in JavaScript and CSS effects.
- Zoom must not be disabled through viewport metadata.

### Metadata
- Use https://www.frpboy.in/ as canonical domain.
- Provide truthful title, description, Open Graph, Twitter, manifest, robots, sitemap, and Person structured data.
- Avoid invented employment claims, certifications, scores, business outcomes, or production health indicators.

## Technical constraints

- Framework: Next.js 16 App Router.
- UI: React and TypeScript.
- Styling: Tailwind CSS v4.
- Motion: Framer Motion, GSAP/ScrollTrigger, and Lenis with lifecycle cleanup.
- Do not upgrade dependencies in bulk.
- Keep project content in one source of truth.

## Quality gates

CI should run npm ci, lint, TypeScript, registry URL/privacy checks, and the production build. Production deployment and external URL availability require separate verification; passing CI is not proof of a live deployment.
