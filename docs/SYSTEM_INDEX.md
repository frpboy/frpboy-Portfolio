# Portfolio OS — Registry and System Index

The canonical project information lives in lib/data/projects.ts. Project cards, search, category filters, and detail windows all consume that typed registry.

## Registry fields

Every project record includes its title, category, publication/status label, description, problem, solution, contribution, impact/evidence note, architecture note, highlight, and optional links. Technology tags are included only when current public documentation supports them.

## Publication labels

- **Public source available** — a public GitHub repository was confirmed for this entry.
- **Live deployment** — a current live destination was verified during the portfolio audit.
- **Prototype** — public source describes incomplete or exploratory implementation.
- **Pre-release** — the repository identifies the project as pre-release.
- **Private case study** — kept at a high level without linking private source code.
- **Not verified** — current source, implementation, or deployment could not be independently verified.
- **Legacy experience** — professional background rather than a current software product.
- **Active development** — active project work; not a claim of production stability.

## Engineering rules

- Public repository links must point to the exact repository, not the account profile.
- Live demos are not inferred from repository homepage metadata alone.
- Private source code and client-specific implementation details stay out of public links.
- Remove pseudo-metrics, fake hashes, and unmeasured health indicators.
- Preserve the OS visual language, while ensuring links, status, filtering, and dialogs remain accessible.
- Do not treat vendor/API output as definitive without a clear evidence trail.
