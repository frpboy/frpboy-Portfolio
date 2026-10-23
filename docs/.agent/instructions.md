# Agent Instructions: Portfolio OS

## Project context

Maintain the terminal-inspired portfolio for Rahul Muraleedharan, Full Stack Developer & Automation Specialist. The experience tells a professional story from hardware diagnostics to software engineering and workflow automation.

## Visual governance

- Keep the OLED-black base with restrained green, blue, and purple accents.
- Keep headings bold and system metadata monospace.
- Preserve the narrative timeline and operating-system-inspired project registry.
- Prefer purposeful transitions to continuous decorative animation.
- Honour prefers-reduced-motion in JavaScript motion effects and CSS.
- Keep mobile layouts, text wrapping, and keyboard focus usable.

## Project registry

- The canonical project data file is lib/data/projects.ts.
- Do not invent source URLs, live demos, project outcomes, technical stacks, status, or metrics.
- Only link to repositories that are public and appropriate for promotion.
- A private or client project may have a high-level case study, but must not expose internal source or customer information.
- Keep repository/demo/documentation actions labelled, keyboard-accessible, and visually distinct.
- Every detail window should explain Problem, Solution, Contribution, Impact and evidence, and Architecture.
- An unavailable demo must remain absent rather than using a fake or unrelated destination.

## Accessibility and interaction

- Project cards open a detail dialog using a separate button; external links must not be nested within the open button.
- Dialogs require a name, modal semantics, Escape-to-close, focus containment, focus restoration, and sensible background scroll locking.
- All icon-only controls require accessible names.
- Use server components by default. Place client components only where browser APIs, state, or animation require them.

## Engineering workflow

1. Inspect current data and call sites before changing the schema.
2. Avoid blanket dependency upgrades. Preserve package-lock consistency.
3. Run npm run lint, npm run typecheck, npm run test:registry, and npm run build when possible.
4. Report exact failures and blockers; never claim a check passed without its result.
5. Review diffs for sensitive local files, secrets, and unsupported public claims before opening a pull request.
