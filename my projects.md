# Rahul Muraleedharan — Project Index and Portfolio Record



## 1. How to interpret this document

- This document describes selected projects and technical work presented in Rahul's public portfolio or public repositories.
- The project list is not a claim that every item is a commercially launched product.
- Status labels are taken from the current portfolio registry. They are snapshots and can change.
- A project marked **Prototype** is not production-ready by implication.
- A project marked **Pre-release** must not be described as generally available.
- A project marked **Active development** may still have unfinished work.
- A project marked **Live deployment** means a live URL is listed in the registry; it does not guarantee uptime at the time a visitor reads this file.
- **Public source available** means a public source repository is linked; it does not imply that every hosted service or dependency is operational.
- **Legacy experience** describes relevant past work or skills, not a currently maintained software product.
- For client and employer projects, the document uses only high-level portfolio-approved summaries. Private source code, internal URLs, database schemas, credentials, customer records, health records, financial records, and proprietary workflows are excluded.
- Forks and upstream contributions are explicitly labelled. They are not presented as sole-authored original products.
- Do not invent user counts, revenue, downloads, conversion rates, time savings, security certifications, uptime, performance gains, or customer outcomes.
- If a link is absent, say that no public link is currently published. Never construct a guessed URL.
- If the linked repository has changed since this file was curated, prefer the latest source code and update this document.

## 2. Portfolio and professional context



The public LinkedIn profile lists service categories including web design, web development, SaaS development, application development, custom software development, and cloud application development. These are profile service categories, not proof of particular client engagements.

Rahul's project work spans independent software, developer tools, client-facing websites, enterprise/business software, creative web experiences, desktop applications, open-source maintenance, and upstream contributions.

## 3. Curated portfolio project inventory

The current typed portfolio registry contains **22 projects**. The entries below mirror that registry and add human-readable context for recruiters, collaborators, and the portfolio RAG assistant.

### 1. Scrobblix — A privacy-first Windows listening companion
- **Category:** independent
- **Role:** Creator
- **Status:** Pre-release
- **Technologies:** C#, .NET 10, WinUI 3, TypeScript WebExtension, SQLite
**What it is**  
A Windows listening companion designed to identify playback, maintain local listening history, explain scrobble outcomes, and queue submissions when connectivity is unavailable.
**Problem addressed**  
Listening history and failed submissions can be difficult to understand when playback signals or network access are unreliable.
**Approach**  
Combine playback discovery, local history, clear submission outcomes, and a safe retry queue in a desktop-first workflow.
**Rahul's role / contribution**  
Public project source includes the desktop application and browser companion work.
**Implementation / architecture**  
Windows desktop application with a TypeScript browser extension, local SQLite storage, and a native messaging boundary.
**Evidence and limitations**  
The repository identifies the project as pre-release work; real-world qualification and signed distribution remain separate release gates.
**Key point**  
Transparent scrobble outcomes with local-first history.
**Links:** [Source](https://github.com/frpboy/Scrobblix)
### 2. Nah That's Fake — Deepfake and scam-signal checks in Telegram
- **Category:** independent
- **Role:** Creator
- **Status:** Active development
- **Technologies:** Node.js, TypeScript, Grammy, Supabase, Telegram Mini App
**What it is**  
A Telegram bot and Mini App for image analysis and suspicious-link checks, bringing multiple detection services into a single user flow.
**Problem addressed**  
People often encounter suspicious images and links inside messaging apps without an easy way to assess available signals.
**Approach**  
Provide a Telegram-native entry point for image analysis and multi-provider URL checks.
**Rahul's role / contribution**  
The public repository contains bot, Mini App, shared code, database schema, and migrations.
**Implementation / architecture**  
Node.js and TypeScript bot, browser-based Telegram Mini App, Supabase/PostgreSQL, and external analysis APIs.
**Evidence and limitations**  
Results depend on external detection services; the interface should not treat a single signal as definitive proof.
**Key point**  
A single Telegram workflow for image and URL checks.
**Links:** [Source](https://github.com/frpboy/NahThatsFake) · [Live demo](https://nahthatsfake.vercel.app/)
### 3. AdBlocker Test Lab — Evidence-led browser protection diagnostics
- **Category:** tool
- **Role:** Creator
- **Status:** Prototype
- **Technologies:** JavaScript, React, TypeScript, Browser APIs
**What it is**  
A browser-based lab exploring ad-resource blocking, tracking protection, cosmetic filtering, popup containment, and observable resource-loading behavior.
**Problem addressed**  
A blocked request alone does not prove which browser feature, extension, or network control caused it.
**Approach**  
Separate direct observations from inference and leave ambiguous outcomes inconclusive.
**Rahul's role / contribution**  
The public repository documents the prototype and its measurement limitations.
**Implementation / architecture**  
A browser-facing test interface with controlled fixtures and exploratory resource probes.
**Evidence and limitations**  
Tests and scores are explicitly a work in progress until verified in target browsers.
**Key point**  
Never confuse an observation with an unsupported conclusion.
**Links:** [Source](https://github.com/frpboy/adblocker-test-lab) · [Live demo](https://lab.frpboy.in/)
### 4. AutoReadMe — Repository-aware documentation generation
- **Category:** tool
- **Role:** Creator
- **Status:** Public source available
- **Technologies:** Node.js, TypeScript, Handlebars, GitHub Actions
**What it is**  
A CLI tool that inspects repository structure and project metadata to generate consistently organised README documentation.
**Problem addressed**  
Project documentation becomes stale or inconsistent when setup steps, scripts, and structure change.
**Approach**  
Discover project type and common metadata, then generate a structured README from templates.
**Rahul's role / contribution**  
The public source includes the CLI, templates, and automation-oriented workflows.
**Implementation / architecture**  
Node.js CLI, TypeScript modules, Handlebars templates, and optional GitHub Actions integration.
**Evidence and limitations**  
Designed to reduce repetitive documentation maintenance; no measured time-saving claim is made.
**Key point**  
Documentation generation built around repository context.
**Links:** [Source](https://github.com/frpboy/autoreadme)
### 5. RepoVerse — Fork-based animated GitHub repository visualisation
- **Category:** tool
- **Role:** Fork maintainer
- **Status:** Public source available
- **Technologies:** TypeScript, SVG, GitHub Actions
**What it is**  
A fork-based adaptation of a GitHub profile visualisation that renders public repositories as planets in an animated SVG scene.
**Problem addressed**  
A plain repository list offers limited visual hierarchy for exploring the projects on a GitHub profile.
**Approach**  
Generate an animated SVG overview with repository metadata and a cycling heads-up display.
**Rahul's role / contribution**  
Maintains a public fork of the upstream RepoVerse project. The original implementation is not claimed as sole authorship.
**Implementation / architecture**  
TypeScript SVG-generation modules and a GitHub Actions workflow for refreshing generated artwork.
**Evidence and limitations**  
Provides a visual summary of public repository metadata; no profile-growth or audience metric is claimed.
**Key point**  
An animated, repository-aware profile visualisation.
**Links:** [Source](https://github.com/frpboy/repo-verse)
### 6. Reddit Sniper — Monitor public conversations for relevant signals
- **Category:** independent
- **Role:** Project creator
- **Status:** Live deployment
- **Technologies:** RSS, Redis, Web application, Notifications
**What it is**  
A monitoring service for tracking relevant Reddit conversations and routing matching signals into notification workflows.
**Problem addressed**  
Finding relevant conversations by checking multiple communities manually can be repetitive.
**Approach**  
Monitor configured sources and surface matches through a central workflow.
**Rahul's role / contribution**  
Portfolio entry for the service; source code is not linked because a public repository was not available to this audit.
**Implementation / architecture**  
A hosted web service with feed monitoring, deduplication, and notification integrations as described by the live site.
**Evidence and limitations**  
No API-cost savings, revenue, or reliability metric is claimed.
**Key point**  
Conversation monitoring organised around user-defined signals.
**Links:** [Open app](https://reddit-sniper.online/)
### 7. Ashique Digital — Brand strategy and lead-generation website
- **Category:** client
- **Role:** Web developer
- **Status:** Live deployment
- **Technologies:** Next.js 16, TypeScript, Tailwind CSS, Framer Motion, Sanity
**What it is**  
A marketing website presenting brand strategy and lead-generation services with an emphasis on clear positioning and conversion-oriented content.
**Problem addressed**  
Service businesses need their positioning, offers, and next steps to be easy to understand online.
**Approach**  
Bring service messaging, proof points, and contact paths into a cohesive responsive website.
**Rahul's role / contribution**  
The public source repository and live branded website are available for inspection.
**Implementation / architecture**  
Next.js App Router, responsive UI, animation components, and content/analytics integrations described by the public repository.
**Evidence and limitations**  
The live website was reachable during this audit; no conversion or revenue outcome is claimed.
**Key point**  
A live client-facing website with a publicly inspectable codebase.
**Links:** [Source](https://github.com/frpboy/ashique-digital) · [Live website](https://www.ashique.digital/)
### 8. Metly — Gold and silver price-tracking app concept
- **Category:** independent
- **Role:** Creator
- **Status:** Prototype
- **Technologies:** Flutter, Dart, Dio, Shared Preferences, OpenRouter API
**What it is**  
A mobile app concept for gold and silver price tracking, explanatory insights, and buy-or-wait signals.
**Problem addressed**  
Price information is more useful when the interface also explains the reasoning behind a signal.
**Approach**  
Combine a compact precious-metal dashboard with configurable AI-assisted explanations.
**Rahul's role / contribution**  
The public repository describes the current prototype and its planned work.
**Implementation / architecture**  
Flutter/Dart client with Dio networking, local preferences, and an OpenRouter integration.
**Evidence and limitations**  
The repository says displayed prices are currently mocked; live market data is not claimed.
**Key point**  
A prototype whose live-price integration remains an explicit next step.
**Links:** [Source](https://github.com/frpboy/Metly) · [Live demo](https://metly-gold.vercel.app/)
### 9. Henna by Chippy — Digital storefront and portfolio for a henna brand
- **Category:** client
- **Role:** Web developer
- **Status:** Public source available
- **Technologies:** Next.js, TypeScript, Sanity CMS, Gemini AI, Pinecone, Tailwind CSS, Framer Motion
**What it is**  
A branded storefront and artist portfolio for a local henna business, connecting gallery-led presentation, CMS-managed stories, and a WhatsApp-based order path.
**Problem addressed**  
The brand needed one destination to present its work, answer common henna questions, and guide customers to a familiar ordering channel.
**Approach**  
Combine an image-forward portfolio, CMS-managed content, AI-assisted stain guidance, and WhatsApp checkout.
**Rahul's role / contribution**  
Implemented the responsive web experience, gallery and content surfaces, product journeys, and AI-assisted support experience.
**Implementation / architecture**  
Next.js App Router, Sanity CMS, Gemini API with Pinecone retrieval, Tailwind CSS, and Framer Motion.
**Evidence and limitations**  
The repository documents WhatsApp-based ordering rather than an online payment gateway; no sales or booking outcome is claimed.
**Key point**  
A practical brand website connecting creative work to enquiries and orders.
**Links:** [Source](https://github.com/frpboy/Henna-by-Chippy) · [Live website](https://henna-by-chippy.vercel.app/)
### 13. Hardware Diagnostics — The practical foundation behind the software work
- **Category:** tool
- **Role:** Hardware technician
- **Status:** Legacy experience
- **Technologies:** Device diagnostics, Circuit troubleshooting, Firmware tooling
**What it is**  
Hands-on troubleshooting of mobile hardware and device software, which shaped a systematic approach to diagnosing problems.
**Problem addressed**  
A visible device failure can originate from different hardware, firmware, or configuration causes.
**Approach**  
Trace symptoms to likely causes through structured checks rather than guesswork.
**Rahul's role / contribution**  
This is professional background, not a software repository.
**Implementation / architecture**  
Physical device systems and software diagnostics.
**Evidence and limitations**  
The experience informs an evidence-led debugging and repair mindset.
**Key point**  
Start with evidence, isolate the fault, then verify the fix.
**Links:** No public source or live destination is currently published in the project registry.
### 14. Portfolio OS — A searchable portfolio for software, systems, and automation
- **Category:** independent
- **Role:** Creator
- **Status:** Live deployment
- **Technologies:** Next.js, React, TypeScript, Tailwind CSS, Framer Motion, GSAP, Lenis
**What it is**  
A dark, terminal-inspired portfolio that presents professional work through a cinematic timeline and a searchable, evidence-led project registry.
**Problem addressed**  
A portfolio can become a flat list of project names without enough context about roles, implementation, status, or what can be verified.
**Approach**  
Use a single typed project registry, category filters, search, and accessible project detail windows with separate source and live links.
**Rahul's role / contribution**  
Created the site, project registry, category filtering, project detail views, and portfolio presentation.
**Implementation / architecture**  
Next.js App Router, React, TypeScript, Tailwind CSS, Framer Motion, GSAP, and Lenis.
**Evidence and limitations**  
The site provides a centralized overview of selected public work; no audience, conversion, or business metric is claimed.
**Key point**  
An evidence-led portfolio with explicit project status and source-link visibility.
**Links:** [Source](https://github.com/frpboy/frpboy-Portfolio) · [Live website](https://www.frpboy.in/)
### 15. Threadly — A daily clue-based connection puzzle
- **Category:** creative
- **Role:** Creator
- **Status:** Live deployment
- **Technologies:** Next.js, React, TypeScript, PostgreSQL, Prisma, NextAuth
**What it is**  
A short daily puzzle game in which players infer a hidden connection from progressively revealed clues, submit guesses, build streaks, and share spoiler-free results.
**Problem addressed**  
Daily puzzle games need a simple, repeatable play loop with clear feedback and lightweight sharing.
**Approach**  
Present a daily connection puzzle with progressive clues, scored guesses, streak tracking, and a shareable result card.
**Rahul's role / contribution**  
The public repository contains the game interface, puzzle and clue routes, scoring-related flows, data model, and supporting documentation.
**Implementation / architecture**  
Next.js App Router application with Prisma-backed data, authentication dependencies, and API routes for daily puzzles, clues, guesses, archive, and leaderboard-related workflows.
**Evidence and limitations**  
A production Vercel deployment is marked ready; gameplay engagement or retention metrics are not claimed.
**Key point**  
A quick daily puzzle built around progressive hints and spoiler-free sharing.
**Links:** [Source](https://github.com/frpboy/Threadly) · [Open app](https://threadly-ruddy.vercel.app/)
### 16. Service Status & Telemetry — Status monitoring and operational visibility
- **Category:** tool
- **Role:** Developer
- **Status:** Public source available
- **Technologies:** Next.js, TypeScript, PostgreSQL, Vercel
**What it is**  
A status dashboard and telemetry-oriented web application for presenting service health and operational signals.
**Problem addressed**  
Service status and probe history are more useful when displayed in one place with clear operational context.
**Approach**  
Combine status presentation and telemetry-backed reporting in a dedicated web interface.
**Rahul's role / contribution**  
Maintained as a public repository; this entry intentionally avoids publishing private deployment details or organization-specific operational data.
**Implementation / architecture**  
Next.js App Router application with TypeScript and PostgreSQL connectivity.
**Evidence and limitations**  
No uptime, reliability, or response-time metric is claimed.
**Key point**  
A dedicated interface for status visibility, documented without unverified service metrics.
**Links:** [Source](https://github.com/frpboy/Status-Page)
### 17. Deploy Raganork — A documentation-focused deployment tooling fork
- **Category:** tool
- **Role:** Fork maintainer
- **Status:** Public source available
- **Technologies:** Docker, Shell, Markdown
**What it is**  
A public fork of a Docker-oriented deployment setup that aims to make common application deployments more repeatable with fewer configuration steps.
**Problem addressed**  
Deployment configuration can become fragmented and inconsistent between environments.
**Approach**  
Maintain a focused deployment guide and opinionated setup patterns in a fork of the upstream project.
**Rahul's role / contribution**  
The fork differs from upstream primarily through README/documentation changes; the upstream implementation is not claimed as original work.
**Implementation / architecture**  
Forked Docker deployment configuration and its accompanying documentation.
**Evidence and limitations**  
No deployment-success or time-saving metric is claimed.
**Key point**  
A small, documentation-focused fork with the upstream relationship stated clearly.
**Links:** [Source](https://github.com/frpboy/deploy-raganork)
### 18. Lean Context Runtime — Context tooling for AI coding workflows
- **Category:** tool
- **Role:** Fork maintainer
- **Status:** Public source available
- **Technologies:** Rust, Shell, MCP, GitHub Actions
**What it is**  
A substantially diverged public fork of a context-management runtime intended to help AI coding tools work with relevant repository context.
**Problem addressed**  
Large codebases can consume unnecessary context when an assistant has to search manually for relevant project information.
**Approach**  
Maintain and extend a fork with additional workflow, documentation, and tooling changes while preserving attribution to upstream.
**Rahul's role / contribution**  
Maintains a highly diverged public fork of yvgude/lean-ctx; original upstream authorship is not claimed.
**Implementation / architecture**  
Rust-oriented context tooling, shell integration, and repository automation within a forked codebase.
**Evidence and limitations**  
No token savings, speed, or cost-reduction metric is asserted by this portfolio entry.
**Key point**  
A substantial fork, described as fork maintenance rather than sole authorship.
**Links:** [Source](https://github.com/frpboy/lean-ctx)
### 19. NEAT Browser — Native Windows browser contribution
- **Category:** tool
- **Role:** Open-source contributor
- **Status:** Public source available
- **Technologies:** C#, .NET, WinUI 3, WebView2, GitHub Actions
**What it is**  
A public contribution to a native Windows browser project built with WinUI 3 and WebView2, including automated validation of existing password-related self-checks.
**Problem addressed**  
A build can pass even when existing self-check suites are not run automatically in CI.
**Approach**  
Contributed CI steps to run existing vault and capture self-checks before the main application build.
**Rahul's role / contribution**  
Upstream PR #10 was merged into neatbrowser/neat; the maintained fork is linked separately from the upstream contribution.
**Implementation / architecture**  
WinUI 3 and WebView2 Windows application with .NET validation and a Node.js test step in GitHub Actions.
**Evidence and limitations**  
The contribution wires existing checks into CI; it does not claim to add new password-manager features.
**Key point**  
An accepted upstream contribution that brings existing self-checks into the build pipeline.
**Links:** [Source](https://github.com/frpboy/neat) · [Related PR](https://github.com/neatbrowser/neat/pull/10)
### 20. React Upstream Contribution — Ongoing work on React's Fizz rendering behavior
- **Category:** tool
- **Role:** Open-source contributor
- **Status:** Active development
- **Technologies:** React, JavaScript, TypeScript, Jest
**What it is**  
A contribution proposal in the public React repository focused on preserving postponed holes when replay aborts in Fizz.
**Problem addressed**  
Streaming rendering replay paths need consistent handling of postponed work when replaying an aborted render.
**Approach**  
The submitted change proposes a targeted behavior correction in the upstream rendering implementation.
**Rahul's role / contribution**  
Upstream PR #37974 is open and has not been represented as merged or accepted.
**Implementation / architecture**  
A focused change in React's server-rendering and streaming-renderer code paths.
**Evidence and limitations**  
The contribution remains pending maintainer review; no upstream acceptance is claimed.
**Key point**  
An active upstream contribution with its review status disclosed.
**Links:** [Source](https://github.com/frpboy/react) · [Related PR](https://github.com/react/react/pull/37974)
### 21. CommonsLens — Search and inspect reusable Wikimedia Commons media
- **Category:** tool
- **Role:** Open-source contributor
- **Status:** Public source available
- **Technologies:** Flutter, Dart, Wikimedia Commons API
**What it is**  
A browser-based research interface for discovering and inspecting reusable media with metadata filters, geographic discovery, licensing guidance, and exports.
**Problem addressed**  
Finding appropriate reusable media can require navigating many metadata fields, categories, and licensing details.
**Approach**  
Bring search, map-based exploration, rights guidance, and export-oriented workflows into a single interface.
**Rahul's role / contribution**  
Upstream PR #1 was merged, improving consistency when a cancelled Wikimedia retry wait raises a client exception. The public fork is linked as the maintained source reference.
**Implementation / architecture**  
A Flutter web application that uses Wikimedia Commons data and presents media discovery and metadata workflows.
**Evidence and limitations**  
The portfolio describes the project's documented purpose and one merged upstream fix; no performance or adoption metric is claimed.
**Key point**  
An accepted upstream fix alongside a media-research application fork.
**Links:** [Source](https://github.com/frpboy/commonslens.github.io) · [Related PR](https://github.com/commonslens/commonslens.github.io/pull/1)
### 22. Fly Log — Personal flight history visualisation
- **Category:** independent
- **Role:** Open-source contributor
- **Status:** Active development
- **Technologies:** Python, Pandas, React, Vite, Mantine
**What it is**  
A flight-history visualiser that processes flight data into structured records and explores the results through an interactive map and filterable table.
**Problem addressed**  
Personal flight history can be difficult to review when raw records and geographical context are separated.
**Approach**  
Clean and enrich flight records, then present them through map-based exploration and a sortable, filterable table.
**Rahul's role / contribution**  
Maintains a public fork and has multiple open upstream pull requests, including a cross-platform Vitest script fix; the contribution is pending rather than merged.
**Implementation / architecture**  
Python/Pandas processing pipeline with a React and Vite front end using Mantine.
**Evidence and limitations**  
No aviation-data accuracy, travel, or usage metric is claimed.
**Key point**  
A flight-history data visualiser with open, clearly attributed upstream contributions.
**Links:** [Source](https://github.com/frpboy/fly-log) · [Related PR](https://github.com/FedericoTartarini/fly-log/pull/88)
## 2. Open-source contributions (separate from owned projects)

These entries describe contributions to projects maintained by other people or organisations. They must not be described as projects Rahul created or owns.

### Selected upstream work

- **NEAT Browser** — contribution to a native Windows browser project using C#, .NET, WinUI 3 and WebView2. The portfolio registry identifies upstream PR #10 as merged and describes it as wiring existing vault/capture self-checks into CI. [PR #10](https://github.com/neatbrowser/neat/pull/10).
- **React** — contribution proposal focused on preserving postponed holes when replay aborts in Fizz. The portfolio registry records PR #37974 as active/pending; do not claim it was accepted or merged without checking GitHub. [PR #37974](https://github.com/facebook/react/pull/37974).
- **CommonsLens** — Flutter/Dart browser-based media research interface for Wikimedia Commons. The registry records upstream PR #1 as merged, addressing consistency when a cancelled Wikimedia retry wait raises a client exception. [PR #1](https://github.com/commonslens/commonslens.github.io/pull/1).
- **Fly Log** — public fork/contribution to a personal flight-history visualiser using Python/Pandas and React/Vite. The portfolio registry identifies multiple open upstream changes; the contribution must remain labelled pending unless the current PR state confirms otherwise. [Repository](https://github.com/FedericoTartarini/fly-log) · [PR #88](https://github.com/FedericoTartarini/fly-log/pull/88).
- **Mornye** — public upstream contributions to an Android music-player project. Selected merged PRs recorded in the public GitHub profile snapshot include #786 and #788. [Repository](https://github.com/mornyeapp/Mornye).
- **The Last Signal** — selected merged contributions listed in the public GitHub profile snapshot: PRs #183 and #184, related to packet tests and pull-request validation. [PR #183](https://github.com/The-last-signal-project/The-last-signal-/pull/183) · [PR #184](https://github.com/The-last-signal-project/The-last-signal-/pull/184).
- **Awesome Downloader** — selected merged contributions listed in the public GitHub profile snapshot: PRs #49, #50 and #53. [Repository](https://github.com/Ahmadkhattak1/awesome-downloader).

### Historical GitHub contribution snapshot

The public GitHub profile README snapshot reviewed on 03 November 2026 reported 16 external repositories with indexed public activity, 25 merged pull requests, 5 open pull requests, 11 closed-but-not-merged pull requests, 0 reviewed pull requests in that index, and 524 authored commit records. These are dated index values, not live counts or an endorsement by the upstream projects.

Always verify pull-request state before publication. A commit, fork, or open pull request is not equivalent to an accepted upstream contribution.

## 4. Additional public repository reference

## 5. LinkedIn profile context relevant to projects

Canonical profile: https://www.linkedin.com/in/rahul-muraleedharan-it/



The LinkedIn activity feed contains both Rahul-authored activity and content explicitly labelled as reposted from other people or organisations. Reposts must not be described as Rahul's own projects or original writing.

Two posts visible during the profile review mentioned **Kerala Dam Watch** and **Kandetham**. Those posts were authored by other LinkedIn users, not Rahul. They are deliberately not included in Rahul's project list.

The profile extraction did not expose a complete About, Experience, or Education section. No missing role or project has been inferred from similarly named people.

## 6. Technology map across the project portfolio

Technologies below are drawn from the typed portfolio registry and linked public repository descriptions. Their appearance here does not mean every technology is used at expert level or in every project.

### Languages and application development
- JavaScript and TypeScript
- Python
- C# and .NET
- Dart and Flutter
- Rust (in forked context tooling)
- SQL
- Shell scripting

### Web and UI
- Next.js and React
- Tailwind CSS
- Framer Motion
- GSAP
- Lenis
- Vite
- Mantine
- Sanity CMS
- SVG and browser APIs

### Backend, data and integration
- Node.js
- NestJS
- PostgreSQL
- Supabase
- Prisma
- SQLite
- Redis
- Google Apps Script
- Google Sheets
- REST APIs and external service integrations

### Desktop, native and browser
- WinUI 3
- Windows App SDK
- WebView2
- Windows Global System Media Transport Controls (GSMTC)
- TypeScript WebExtensions
- Chromium Manifest V3
- Browser Native Messaging

### Cloud, deployment and automation
- Vercel
- GitHub Actions
- Docker
- Serverless application routes
- CI/CD and automated validation
- Object storage and S3-compatible APIs
- Model and vector-search integrations in selected projects

## 7. Project status definitions

| Status | Meaning | Public wording guidance |
|---|---|---|
| Active development | Work is ongoing | Say 'in active development'; do not imply completion. |
| Pre-release | Core work exists but release qualification remains | Do not call it stable or generally available. |
| Prototype | Exploratory implementation | State important missing or mocked functionality. |
| Live deployment | A live URL is listed | Say a live destination is listed; do not guarantee present uptime. |
| Public source available | Source repository is linked | Link the repository and describe only what it supports. |
| Legacy experience | Relevant earlier work | Describe as experience, not a current product. |
| Not verified | Status or destination has not been confirmed | Clearly state that verification is pending. |

## 8. Project attribution rules



## 9. Source register



### Source limitations

- This is a curated portfolio document, not a full mirror of every repository or every private project.
- Private repositories, internal company systems, and confidential records are intentionally omitted or described only at a high level.
- LinkedIn is used for the exact profile URL and accessible profile-header context. Its full experience and education detail was not available in the inspected page extraction.
- No private Google Drive, Gmail, Docs, or Sheets content was ingested in this curation pass.
- No complete export of all ChatGPT conversations was available. The document uses already available public-safe project context, not private chat transcripts.
- Some project status labels and technology details are self-published or portfolio-supplied. For current technical claims, inspect the linked repository.

## 10. Maintenance checklist

- [ ] Update `lib/data/projects.ts` first when adding, removing, or materially changing a portfolio card.
- [ ] Confirm role and ownership wording.
- [ ] Confirm the project status against the latest repository or live deployment.
- [ ] Confirm all source and demo links actually resolve.
- [ ] Distinguish personal projects, client work, enterprise case studies, forks, and upstream contributions.
- [ ] Review the document for confidential details before publishing.
- [ ] Remove stale metrics rather than carrying them forward.
- [ ] Re-ingest this file into Pinecone after substantial approved changes, using the same source URL so the existing source can be re-indexed.

---

*This document is intended as a readable project index and RAG source. Prefer distinct, grounded facts over duplicated text or artificial line-count inflation.*
