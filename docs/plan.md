# Portfolio OS — maintenance and release plan

This file replaces the original scaffold checklist. The live source of truth is the code in this repository, not an aspirational list of unimplemented components.

## Current implementation baseline

- Next.js App Router application with the Portfolio OS visual identity.
- Timeline sections for the troubleshooting-to-software narrative.
- One typed project registry at lib/data/projects.ts.
- Search and category filtering for project discovery.
- Project detail dialogs with separate repository, demo, and documentation actions.
- Modal Escape handling, focus containment/restoration, and background scroll locking.
- Reduced-motion handling for timeline animation and smooth scrolling.
- Canonical metadata, Person structured data, Open Graph image, manifest, robots, and sitemap routes.
- Automated lint, typecheck, registry validation, and production-build checks configured in GitHub Actions.

## Release gate

Before promoting changes to the live domain:

1. Run lint, TypeScript, registry validation, and a clean production build.
2. Review the pull request diff and resolve blocking CI or review feedback.
3. Check the deployed page at desktop and narrow mobile widths.
4. Verify project actions, modal keyboard behavior, reduced-motion behavior, canonical metadata, sitemap, robots, and social-preview image on the actual deployment.
5. Check the production deployment after merge; a successful source build alone does not prove deployment succeeded.

## Ongoing guardrails

- Keep public project links exact and confirm repository visibility before adding them.
- Do not infer that a deployment is healthy from a configured homepage URL.
- Do not publish private source, client details, secrets, local settings, or personal working documents.
- Do not use simulated progress, integrity, reliability, throughput, or version hashes as measured facts.
- Avoid framework/dependency upgrades without compatibility evidence and a concrete reason.
