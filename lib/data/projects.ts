export type ProjectCategory = "independent" | "client" | "tool" | "creative";

export type ProjectStatus =
  | "Active development"
  | "Pre-release"
  | "Prototype"
  | "Live deployment"
  | "Public source available"
  | "Legacy experience"
  | "Not verified";

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  role: string;
  category: ProjectCategory;
  status: ProjectStatus;
  tech: string[];
  description: string;
  problem: string;
  solution: string;
  contribution: string;
  impact: string;
  architecture: string;
  highlight: string;
  links?: {
    github?: string;
    live?: string;
    documentation?: string;
    liveLabel?: "Live website" | "Open app" | "Live demo";
    pullRequest?: string;
  };
}

/**
 * Public-facing registry. Keep links and technical claims grounded in public
 * repository metadata or a destination that has actually been verified.
 * Keep public-facing project records grounded in verifiable project information.
 */
export const projects: Project[] = [
  {
    id: "scrobblix",
    title: "Scrobblix",
    subtitle: "A privacy-first Windows listening companion",
    role: "Creator",
    category: "independent",
    status: "Pre-release",
    tech: ["C#", ".NET 10", "WinUI 3", "TypeScript WebExtension", "SQLite"],
    description: "A Windows listening companion designed to identify playback, maintain local listening history, explain scrobble outcomes, and queue submissions when connectivity is unavailable.",
    problem: "Listening history and failed submissions can be difficult to understand when playback signals or network access are unreliable.",
    solution: "Combine playback discovery, local history, clear submission outcomes, and a safe retry queue in a desktop-first workflow.",
    contribution: "Public project source includes the desktop application and browser companion work.",
    impact: "The repository identifies the project as pre-release work; real-world qualification and signed distribution remain separate release gates.",
    architecture: "Windows desktop application with a TypeScript browser extension, local SQLite storage, and a native messaging boundary.",
    highlight: "Transparent scrobble outcomes with local-first history.",
    links: { github: "https://github.com/frpboy/Scrobblix" },
  },
  {
    id: "nah-thats-fake",
    title: "Nah That's Fake",
    subtitle: "Deepfake and scam-signal checks in Telegram",
    role: "Creator",
    category: "independent",
    status: "Active development",
    tech: ["Node.js", "TypeScript", "Grammy", "Supabase", "Telegram Mini App"],
    description: "A Telegram bot and Mini App for image analysis and suspicious-link checks, bringing multiple detection services into a single user flow.",
    problem: "People often encounter suspicious images and links inside messaging apps without an easy way to assess available signals.",
    solution: "Provide a Telegram-native entry point for image analysis and multi-provider URL checks.",
    contribution: "The public repository contains bot, Mini App, shared code, database schema, and migrations.",
    impact: "Results depend on external detection services; the interface should not treat a single signal as definitive proof.",
    architecture: "Node.js and TypeScript bot, browser-based Telegram Mini App, Supabase/PostgreSQL, and external analysis APIs.",
    highlight: "A single Telegram workflow for image and URL checks.",
    links: { github: "https://github.com/frpboy/NahThatsFake", live: "https://nahthatsfake.vercel.app/", liveLabel: "Live demo" },
  },
  {
    id: "adblocker-test-lab",
    title: "AdBlocker Test Lab",
    subtitle: "Evidence-led browser protection diagnostics",
    role: "Creator",
    category: "tool",
    status: "Prototype",
    tech: ["JavaScript", "React", "TypeScript", "Browser APIs"],
    description: "A browser-based lab exploring ad-resource blocking, tracking protection, cosmetic filtering, popup containment, and observable resource-loading behavior.",
    problem: "A blocked request alone does not prove which browser feature, extension, or network control caused it.",
    solution: "Separate direct observations from inference and leave ambiguous outcomes inconclusive.",
    contribution: "The public repository documents the prototype and its measurement limitations.",
    impact: "Tests and scores are explicitly a work in progress until verified in target browsers.",
    architecture: "A browser-facing test interface with controlled fixtures and exploratory resource probes.",
    highlight: "Never confuse an observation with an unsupported conclusion.",
    links: { github: "https://github.com/frpboy/adblocker-test-lab", live: "https://lab.frpboy.in/", liveLabel: "Live demo" },
  },

  {
    id: "autoreadme",
    title: "AutoReadMe",
    subtitle: "Repository-aware documentation generation",
    role: "Creator",
    category: "tool",
    status: "Public source available",
    tech: ["Node.js", "TypeScript", "Handlebars", "GitHub Actions"],
    description: "A CLI tool that inspects repository structure and project metadata to generate consistently organised README documentation.",
    problem: "Project documentation becomes stale or inconsistent when setup steps, scripts, and structure change.",
    solution: "Discover project type and common metadata, then generate a structured README from templates.",
    contribution: "The public source includes the CLI, templates, and automation-oriented workflows.",
    impact: "Designed to reduce repetitive documentation maintenance; no measured time-saving claim is made.",
    architecture: "Node.js CLI, TypeScript modules, Handlebars templates, and optional GitHub Actions integration.",
    highlight: "Documentation generation built around repository context.",
    links: { github: "https://github.com/frpboy/autoreadme" },
  },
  {
    id: "repo-verse",
    title: "RepoVerse",
    subtitle: "Fork-based animated GitHub repository visualisation",
    role: "Fork maintainer",
    category: "tool",
    status: "Public source available",
    tech: ["TypeScript", "SVG", "GitHub Actions"],
    description: "A fork-based adaptation of a GitHub profile visualisation that renders public repositories as planets in an animated SVG scene.",
    problem: "A plain repository list offers limited visual hierarchy for exploring the projects on a GitHub profile.",
    solution: "Generate an animated SVG overview with repository metadata and a cycling heads-up display.",
    contribution: "Maintains a public fork of the upstream RepoVerse project. The original implementation is not claimed as sole authorship.",
    impact: "Provides a visual summary of public repository metadata; no profile-growth or audience metric is claimed.",
    architecture: "TypeScript SVG-generation modules and a GitHub Actions workflow for refreshing generated artwork.",
    highlight: "An animated, repository-aware profile visualisation.",
    links: { github: "https://github.com/frpboy/repo-verse" }
  },
  {
    id: "reddit-sniper",
    title: "Reddit Sniper",
    subtitle: "Monitor public conversations for relevant signals",
    role: "Project creator",
    category: "independent",
    status: "Live deployment",
    tech: ["RSS", "Redis", "Web application", "Notifications"],
    description: "A monitoring service for tracking relevant Reddit conversations and routing matching signals into notification workflows.",
    problem: "Finding relevant conversations by checking multiple communities manually can be repetitive.",
    solution: "Monitor configured sources and surface matches through a central workflow.",
    contribution: "Portfolio entry for the service; source code is not linked because a public repository was not available to this audit.",
    impact: "No API-cost savings, revenue, or reliability metric is claimed.",
    architecture: "A hosted web service with feed monitoring, deduplication, and notification integrations as described by the live site.",
    highlight: "Conversation monitoring organised around user-defined signals.",
    links: { live: "https://reddit-sniper.online/", liveLabel: "Open app" },
  },
  {
    id: "ashique-digital",
    title: "Ashique Digital",
    subtitle: "Brand strategy and lead-generation website",
    role: "Web developer",
    category: "client",
    status: "Live deployment",
    tech: ["Next.js 16", "TypeScript", "Tailwind CSS", "Framer Motion", "Sanity"],
    description: "A marketing website presenting brand strategy and lead-generation services with an emphasis on clear positioning and conversion-oriented content.",
    problem: "Service businesses need their positioning, offers, and next steps to be easy to understand online.",
    solution: "Bring service messaging, proof points, and contact paths into a cohesive responsive website.",
    contribution: "The public source repository and live branded website are available for inspection.",
    impact: "The live website was reachable during this audit; no conversion or revenue outcome is claimed.",
    architecture: "Next.js App Router, responsive UI, animation components, and content/analytics integrations described by the public repository.",
    highlight: "A live client-facing website with a publicly inspectable codebase.",
    links: {
      github: "https://github.com/frpboy/ashique-digital",
      live: "https://www.ashique.digital/", liveLabel: "Live website",
    },
  },


  {
    id: "metly",
    title: "Metly",
    subtitle: "Gold and silver price-tracking app concept",
    role: "Creator",
    category: "independent",
    status: "Prototype",
    tech: ["Flutter", "Dart", "Dio", "Shared Preferences", "OpenRouter API"],
    description: "A mobile app concept for gold and silver price tracking, explanatory insights, and buy-or-wait signals.",
    problem: "Price information is more useful when the interface also explains the reasoning behind a signal.",
    solution: "Combine a compact precious-metal dashboard with configurable AI-assisted explanations.",
    contribution: "The public repository describes the current prototype and its planned work.",
    impact: "The repository says displayed prices are currently mocked; live market data is not claimed.",
    architecture: "Flutter/Dart client with Dio networking, local preferences, and an OpenRouter integration.",
    highlight: "A prototype whose live-price integration remains an explicit next step.",
    links: { github: "https://github.com/frpboy/Metly" },
  },
  {
    id: "henna-by-chippy",
    title: "Henna by Chippy",
    subtitle: "Digital storefront and portfolio for a henna brand",
    role: "Web developer",
    category: "client",
    status: "Public source available",
    tech: ["Next.js", "TypeScript", "Sanity CMS", "Gemini AI", "Pinecone", "Tailwind CSS", "Framer Motion"],
    description: "A branded storefront and artist portfolio for a local henna business, connecting gallery-led presentation, CMS-managed stories, and a WhatsApp-based order path.",
    problem: "The brand needed one destination to present its work, answer common henna questions, and guide customers to a familiar ordering channel.",
    solution: "Combine an image-forward portfolio, CMS-managed content, AI-assisted stain guidance, and WhatsApp checkout.",
    contribution: "Implemented the responsive web experience, gallery and content surfaces, product journeys, and AI-assisted support experience.",
    impact: "The repository documents WhatsApp-based ordering rather than an online payment gateway; no sales or booking outcome is claimed.",
    architecture: "Next.js App Router, Sanity CMS, Gemini API with Pinecone retrieval, Tailwind CSS, and Framer Motion.",
    highlight: "A practical brand website connecting creative work to enquiries and orders.",
    links: { github: "https://github.com/frpboy/Henna-by-Chippy", live: "https://henna-by-chippy.vercel.app/", liveLabel: "Live website" }
  },




  {
    id: "silicon-soul",
    title: "Hardware Diagnostics",
    subtitle: "The practical foundation behind the software work",
    role: "Hardware technician",
    category: "tool",
    status: "Legacy experience",
    tech: ["Device diagnostics", "Circuit troubleshooting", "Firmware tooling"],
    description: "Hands-on troubleshooting of mobile hardware and device software, which shaped a systematic approach to diagnosing problems.",
    problem: "A visible device failure can originate from different hardware, firmware, or configuration causes.",
    solution: "Trace symptoms to likely causes through structured checks rather than guesswork.",
    contribution: "This is professional background, not a software repository.",
    impact: "The experience informs an evidence-led debugging and repair mindset.",
    architecture: "Physical device systems and software diagnostics.",
    highlight: "Start with evidence, isolate the fault, then verify the fix.",
  },
  {
    id: "portfolio-os",
    title: "Portfolio OS",
    subtitle: "A searchable portfolio for software, systems, and automation",
    role: "Creator",
    category: "independent",
    status: "Live deployment",
    tech: ["Next.js","React","TypeScript","Tailwind CSS","Framer Motion","GSAP","Lenis"],
    description: "A dark, terminal-inspired portfolio that presents professional work through a cinematic timeline and a searchable, evidence-led project registry.",
    problem: "A portfolio can become a flat list of project names without enough context about roles, implementation, status, or what can be verified.",
    solution: "Use a single typed project registry, category filters, search, and accessible project detail windows with separate source and live links.",
    contribution: "Created the site, project registry, category filtering, project detail views, and portfolio presentation.",
    impact: "The site provides a centralized overview of selected public work; no audience, conversion, or business metric is claimed.",
    architecture: "Next.js App Router, React, TypeScript, Tailwind CSS, Framer Motion, GSAP, and Lenis.",
    highlight: "An evidence-led portfolio with explicit project status and source-link visibility.",
    links: { github: "https://github.com/frpboy/frpboy-Portfolio", live: "https://www.frpboy.in/", liveLabel: "Live website" }
  },
  {
    id: "threadly",
    title: "Threadly",
    subtitle: "A daily clue-based connection puzzle",
    role: "Creator",
    category: "creative",
    status: "Live deployment",
    tech: ["Next.js","React","TypeScript","PostgreSQL","Prisma","NextAuth"],
    description: "A short daily puzzle game in which players infer a hidden connection from progressively revealed clues, submit guesses, build streaks, and share spoiler-free results.",
    problem: "Daily puzzle games need a simple, repeatable play loop with clear feedback and lightweight sharing.",
    solution: "Present a daily connection puzzle with progressive clues, scored guesses, streak tracking, and a shareable result card.",
    contribution: "The public repository contains the game interface, puzzle and clue routes, scoring-related flows, data model, and supporting documentation.",
    impact: "A production Vercel deployment is marked ready; gameplay engagement or retention metrics are not claimed.",
    architecture: "Next.js App Router application with Prisma-backed data, authentication dependencies, and API routes for daily puzzles, clues, guesses, archive, and leaderboard-related workflows.",
    highlight: "A quick daily puzzle built around progressive hints and spoiler-free sharing.",
    links: { github: "https://github.com/frpboy/Threadly", live: "https://threadly-ruddy.vercel.app/", liveLabel: "Open app" }
  },
  {
    id: "service-status-telemetry",
    title: "Service Status & Telemetry",
    subtitle: "Status monitoring and operational visibility",
    role: "Developer",
    category: "tool",
    status: "Public source available",
    tech: ["Next.js","TypeScript","PostgreSQL","Vercel"],
    description: "A status dashboard and telemetry-oriented web application for presenting service health and operational signals.",
    problem: "Service status and probe history are more useful when displayed in one place with clear operational context.",
    solution: "Combine status presentation and telemetry-backed reporting in a dedicated web interface.",
    contribution: "Maintained as a public repository; this entry intentionally avoids publishing private deployment details or organization-specific operational data.",
    impact: "No uptime, reliability, or response-time metric is claimed.",
    architecture: "Next.js App Router application with TypeScript and PostgreSQL connectivity.",
    highlight: "A dedicated interface for status visibility, documented without unverified service metrics.",
    links: { github: "https://github.com/frpboy/Status-Page" }
  },
  {
    id: "deploy-raganork",
    title: "Deploy Raganork",
    subtitle: "A documentation-focused deployment tooling fork",
    role: "Fork maintainer",
    category: "tool",
    status: "Public source available",
    tech: ["Docker","Shell","Markdown"],
    description: "A public fork of a Docker-oriented deployment setup that aims to make common application deployments more repeatable with fewer configuration steps.",
    problem: "Deployment configuration can become fragmented and inconsistent between environments.",
    solution: "Maintain a focused deployment guide and opinionated setup patterns in a fork of the upstream project.",
    contribution: "The fork differs from upstream primarily through README/documentation changes; the upstream implementation is not claimed as original work.",
    impact: "No deployment-success or time-saving metric is claimed.",
    architecture: "Forked Docker deployment configuration and its accompanying documentation.",
    highlight: "A small, documentation-focused fork with the upstream relationship stated clearly.",
    links: { github: "https://github.com/frpboy/deploy-raganork" }
  },
  {
    id: "lean-ctx",
    title: "Lean Context Runtime",
    subtitle: "Context tooling for AI coding workflows",
    role: "Fork maintainer",
    category: "tool",
    status: "Public source available",
    tech: ["Rust","Shell","MCP","GitHub Actions"],
    description: "A substantially diverged public fork of a context-management runtime intended to help AI coding tools work with relevant repository context.",
    problem: "Large codebases can consume unnecessary context when an assistant has to search manually for relevant project information.",
    solution: "Maintain and extend a fork with additional workflow, documentation, and tooling changes while preserving attribution to upstream.",
    contribution: "Maintains a highly diverged public fork of yvgude/lean-ctx; original upstream authorship is not claimed.",
    impact: "No token savings, speed, or cost-reduction metric is asserted by this portfolio entry.",
    architecture: "Rust-oriented context tooling, shell integration, and repository automation within a forked codebase.",
    highlight: "A substantial fork, described as fork maintenance rather than sole authorship.",
    links: { github: "https://github.com/frpboy/lean-ctx" }
  },
  {
    id: "neat-browser",
    title: "NEAT Browser",
    subtitle: "Native Windows browser contribution",
    role: "Open-source contributor",
    category: "tool",
    status: "Public source available",
    tech: ["C#",".NET","WinUI 3","WebView2","GitHub Actions"],
    description: "A public contribution to a native Windows browser project built with WinUI 3 and WebView2, including automated validation of existing password-related self-checks.",
    problem: "A build can pass even when existing self-check suites are not run automatically in CI.",
    solution: "Contributed CI steps to run existing vault and capture self-checks before the main application build.",
    contribution: "Upstream PR #10 was merged into neatbrowser/neat; the maintained fork is linked separately from the upstream contribution.",
    impact: "The contribution wires existing checks into CI; it does not claim to add new password-manager features.",
    architecture: "WinUI 3 and WebView2 Windows application with .NET validation and a Node.js test step in GitHub Actions.",
    highlight: "An accepted upstream contribution that brings existing self-checks into the build pipeline.",
    links: { github: "https://github.com/frpboy/neat", pullRequest: "https://github.com/neatbrowser/neat/pull/10" }
  },
  {
    id: "react-upstream",
    title: "React Upstream Contribution",
    subtitle: "Ongoing work on React's Fizz rendering behavior",
    role: "Open-source contributor",
    category: "tool",
    status: "Active development",
    tech: ["React","JavaScript","TypeScript","Jest"],
    description: "A contribution proposal in the public React repository focused on preserving postponed holes when replay aborts in Fizz.",
    problem: "Streaming rendering replay paths need consistent handling of postponed work when replaying an aborted render.",
    solution: "The submitted change proposes a targeted behavior correction in the upstream rendering implementation.",
    contribution: "Upstream PR #37974 is open and has not been represented as merged or accepted.",
    impact: "The contribution remains pending maintainer review; no upstream acceptance is claimed.",
    architecture: "A focused change in React's server-rendering and streaming-renderer code paths.",
    highlight: "An active upstream contribution with its review status disclosed.",
    links: { github: "https://github.com/frpboy/react", pullRequest: "https://github.com/react/react/pull/37974" }
  },
  {
    id: "commonslens",
    title: "CommonsLens",
    subtitle: "Search and inspect reusable Wikimedia Commons media",
    role: "Open-source contributor",
    category: "tool",
    status: "Public source available",
    tech: ["Flutter","Dart","Wikimedia Commons API"],
    description: "A browser-based research interface for discovering and inspecting reusable media with metadata filters, geographic discovery, licensing guidance, and exports.",
    problem: "Finding appropriate reusable media can require navigating many metadata fields, categories, and licensing details.",
    solution: "Bring search, map-based exploration, rights guidance, and export-oriented workflows into a single interface.",
    contribution: "Upstream PR #1 was merged, improving consistency when a cancelled Wikimedia retry wait raises a client exception. The public fork is linked as the maintained source reference.",
    impact: "The portfolio describes the project's documented purpose and one merged upstream fix; no performance or adoption metric is claimed.",
    architecture: "A Flutter web application that uses Wikimedia Commons data and presents media discovery and metadata workflows.",
    highlight: "An accepted upstream fix alongside a media-research application fork.",
    links: { github: "https://github.com/frpboy/commonslens.github.io", pullRequest: "https://github.com/commonslens/commonslens.github.io/pull/1" }
  },
  {
    id: "fly-log",
    title: "Fly Log",
    subtitle: "Personal flight history visualisation",
    role: "Open-source contributor",
    category: "independent",
    status: "Active development",
    tech: ["Python","Pandas","React","Vite","Mantine"],
    description: "A flight-history visualiser that processes flight data into structured records and explores the results through an interactive map and filterable table.",
    problem: "Personal flight history can be difficult to review when raw records and geographical context are separated.",
    solution: "Clean and enrich flight records, then present them through map-based exploration and a sortable, filterable table.",
    contribution: "Maintains a public fork and has multiple open upstream pull requests, including a cross-platform Vitest script fix; the contribution is pending rather than merged.",
    impact: "No aviation-data accuracy, travel, or usage metric is claimed.",
    architecture: "Python/Pandas processing pipeline with a React and Vite front end using Mantine.",
    highlight: "A flight-history data visualiser with open, clearly attributed upstream contributions.",
    links: { github: "https://github.com/frpboy/fly-log", pullRequest: "https://github.com/FedericoTartarini/fly-log/pull/88" }
  }
];
