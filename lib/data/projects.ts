export type ProjectCategory = 'enterprise' | 'independent' | 'client' | 'tool' | 'creative';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  role: string;
  category: ProjectCategory;
  tech: string[];
  description: string;
  highlight: string;
  stats: {
    load: number; // For the visual progress bar (0-100)
    status: 'STABLE' | 'OPTIMIZING' | 'ACTIVE' | 'EXPERIMENTAL';
  };
  links?: {
    github?: string;
    live?: string;
  };
}

export const projects: Project[] = [
  {
    id: 'zerpai-erp',
    title: 'ZERPAI ERP',
    subtitle: 'High-performance cloud-native ERP.',
    role: 'Systems Architect',
    category: 'enterprise',
    tech: ['Flutter', 'NestJS', 'Supabase', 'PostgreSQL', 'Riverpod', 'Multi-tenant'],
    description: 'A comprehensive monorepo solution with a Flutter (Web+Android) frontend and NestJS backend. Implements organization-wide multi-tenancy (org_id + outlet_id) with strict data isolation through Supabase RLS.',
    highlight: 'Unified stock-sync logic with org-level operational isolation.',
    stats: { load: 72, status: 'OPTIMIZING' },
    links: { github: 'https://github.com/frpboy' }
  },
  {
    id: 'sahakar-accounts',
    title: 'SAHAKAR ACCOUNTS',
    subtitle: 'Enterprise-grade accounting at scale.',
    role: 'Lead Developer',
    category: 'enterprise',
    tech: ['NextJS 16', 'Supabase', 'Zod', 'RBAC', 'PWA'],
    description: 'A secure, multi-tenant accounting platform featuring Next.js App Router, serverless API routes, and edge-optimized middleware. Includes mandatory read-only audit logging and role-based access for large clinic networks.',
    highlight: 'Passed government-grade security audit with immutable ledger states.',
    stats: { load: 64, status: 'STABLE' }
  },
  {
    id: 'reddit-sniper',
    title: 'REDDIT SNIPER',
    subtitle: 'Market signal acquisition via RSS.',
    role: 'Founder & Sole Developer',
    category: 'independent',
    tech: ['NextJS 15', 'Upstash Redis', 'Fly.io', 'Resend', 'Sentry'],
    description: 'A production SaaS platform that monitors Reddit for buying intent using continuous RSS polling every 60 seconds. A decoupled architecture (Vercel + Fly.io) ensures zero-API overhead and high reliability.',
    highlight: 'Saved $10k/mo in API costs using intelligent polling and Redis dedup.',
    stats: { load: 88, status: 'STABLE' },
    links: { github: 'https://github.com/frpboy', live: 'https://reddit-sniper.online/' }
  },
  {
    id: 'medireport',
    title: 'MEDI REPORT',
    subtitle: 'Diagnostic integrity platform.',
    role: 'Lead Developer',
    category: 'enterprise',
    tech: ['Next.js 14', 'Prisma', 'Neon', 'Cloudflare R2', 'SHA-256'],
    description: 'Multi-outlet diagnostic reporting platform ensuring immutable results. Reports follow a strict Draft-to-Final lifecycle, stamped with SHA-256 hashes and stored in private Cloudflare R2 buckets served via proxy.',
    highlight: 'Immutable diagnostic records with per-page tamper-evident stamping.',
    stats: { load: 45, status: 'STABLE' }
  },
  {
    id: 'nah-thats-fake',
    title: 'NAH THATS FAKE',
    subtitle: 'AI/Deepfake security suite.',
    role: 'Creator',
    category: 'independent',
    tech: ['Node.js', 'Grammy', 'Sightengine AI', 'Telegram TMA', 'Safe Browsing'],
    description: 'A deepfake and scam detection platform featuring a Telegram Bot and Mini App (TMA). Uses Sightengine AI for image analysis and VirusTotal/Google Safe Browsing for phishing detection.',
    highlight: 'Telegram Mini App integration with real-time deepfake analysis.',
    stats: { load: 92, status: 'STABLE' },
    links: { live: 'https://t.me/NahThatsFakeBot' }
  },
  {
    id: 'bric-wealth',
    title: 'BRIC WEALTH',
    subtitle: 'Wealth management hierarchy.',
    role: 'Lead Developer',
    category: 'enterprise',
    tech: ['Flutter 4.0', 'Firebase', 'Cloud Functions', 'Riverpod'],
    description: 'Corporate-grade wealth distribution platform managing transparent, government-style administrative hierarchies. Version 4.0 features robust timestamp parsing and automated commission dispersal.',
    highlight: 'Multi-level hierarchy logic verified for precise commission dispersal.',
    stats: { load: 58, status: 'STABLE' },
    links: { live: 'https://bric-wealth.web.app' }
  },
  {
    id: 'sahakar-po',
    title: 'SAHAKAR PO',
    subtitle: 'Procurement orchestration.',
    role: 'Lead Developer',
    category: 'enterprise',
    tech: ['Next.js', 'PostgreSQL', 'Prisma', 'Tailwind'],
    description: 'Streamlined purchase order management for HyperPharmacy & SmartClinic networks. Automates requisition-to-delivery pipelines with real-time vendor tracking.',
    highlight: 'Automated requisition workflows reducing procurement lag by 40%.',
    stats: { load: 61, status: 'STABLE' }
  },
  {
    id: 'eternal-scroll',
    title: 'ETERNAL SCROLL',
    subtitle: 'Cinematic 3D celestial odyssey.',
    role: 'Creative Developer',
    category: 'creative',
    tech: ['Next.js 15', 'Three.js', 'React Three Fiber', 'GSAP', 'Neon'],
    description: 'An immersive digital wedding narrative transforming traditional storytelling into a 3D celestial journey via interactable nebula fields and starfield tunnels.',
    highlight: 'Bespoke 3D Starfield Tunnel & Interactive Nebula climax point.',
    stats: { load: 85, status: 'STABLE' }
  },
  {
    id: 'ashique-digital',
    title: 'ASHIQUE DIGITAL',
    subtitle: 'AI Growth Assistant platform.',
    role: 'Systems Architect',
    category: 'client',
    tech: ['Next.js 15', 'Gemini Pro 2.0', 'PostHog', 'Sanity.io', 'Pinecone'],
    description: 'Premium brand strategist engine featuring a custom-trained AI Growth Assistant (Gemini 2.0 Flash) and advanced behavioral user-flow analytics.',
    highlight: 'Behavioral analytics integration for data-driven brand strategies.',
    stats: { load: 55, status: 'STABLE' },
    links: { live: 'https://www.ashique.digital/' }
  },
  {
    id: 'specly',
    title: 'SPECLY',
    subtitle: 'Clarity before you buy.',
    role: 'Creator',
    category: 'independent',
    tech: ['Next.js 15', 'Drizzle ORM', 'Neon', 'Upstash Redis', 'React 19'],
    description: 'A lightweight, privacy-first gadget comparison tool built to help users make decisions based on deterministic logic.',
    highlight: 'Deterministic Comparison engine with zero-noise UI.',
    stats: { load: 38, status: 'OPTIMIZING' }
  },
  {
    id: 'city-cranes',
    title: 'CITY CRANES',
    subtitle: 'Industrial performance showcased.',
    role: 'Full Stack Developer',
    category: 'client',
    tech: ['Next.js', 'Advanced SEO', 'Framer Motion', 'SSG'],
    description: 'A high-performance corporate platform for the crane and heavy machinery industry. Focused on extreme SEO optimization.',
    highlight: 'Extreme SEO optimization for regional market dominance.',
    stats: { load: 25, status: 'STABLE' }
  },
  {
    id: 'metly',
    title: 'METLY',
    subtitle: 'Micro-analytics engine.',
    role: 'Lead Developer',
    category: 'tool',
    tech: ['Node.js', 'Redis', 'Next.js', 'Lightweight Client'],
    description: 'Privacy-focused micro-analytics tool for real-time link tracking and campaign conversion analysis.',
    highlight: 'Real-time campaign tracking without invasive cookies.',
    stats: { load: 15, status: 'STABLE' }
  },
  {
    id: 'autoreadme',
    title: 'AUTO README',
    subtitle: 'Automated documentation engine.',
    role: 'Creator',
    category: 'tool',
    tech: ['Node.js', 'LLM APIs', 'Git Hooks', 'Markdown Engine'],
    description: 'Dev tool that automatically generates high-fidelity README documentation by analyzing codebase structure and generating context graphs using LLMs.',
    highlight: 'Documentation generation at the speed of code execution.',
    stats: { load: 42, status: 'STABLE' }
  },
  {
    id: 'henna-by-chippy',
    title: 'HENNA BY CHIPPY',
    subtitle: 'Digital canvas for artistry.',
    role: 'Creative Developer',
    category: 'creative',
    tech: ['React', 'CSS Grid', 'Animations', 'Portfolio Engine'],
    description: 'A minimalist, artistic portfolio designed for a high-end makeup and henna artist.',
    highlight: 'Fluid gallery-first UX with artistic transitions.',
    stats: { load: 12, status: 'STABLE' }
  },
  {
    id: 'wedding-site',
    title: 'SANU WEDS BIJEESH',
    subtitle: 'Real-time celebration hub.',
    role: 'Lead Developer',
    category: 'creative',
    tech: ['React', 'Firebase RTDB', 'Cloud Storage', 'PWA'],
    description: 'A centralized event platform for a large-scale wedding, featuring real-time RSVP tracking and live photo gallery.',
    highlight: 'Live RSVP Sync & Real-time Photo Gallery.',
    stats: { load: 33, status: 'STABLE' },
    links: { live: 'https://sanu-weds-bijeesh.vercel.app/' }
  },
  {
    id: 'his-birthday',
    title: 'HIS BIRTHDAY',
    subtitle: 'A personal digital birthday moment.',
    role: 'Creative Developer',
    category: 'creative',
    tech: ['HTML5', 'CSS3', 'Vanilla JS', 'Glassmorphism', 'Web Audio API'],
    description: 'A minimal, immersive birthday microsite built for one person, for one day. Features matrix-style visuals, gesture-based unlock, cinematic background music, time-aware messages, and a hidden easter egg — all without frameworks or dependencies.',
    highlight: 'Date-aware logic and gesture-based unlock that turns a webpage into a moment.',
    stats: { load: 78, status: 'STABLE' },
    links: { live: 'https://his-birthday.web.app/' }
  },
  {
    id: 'silicon-soul',
    title: 'SILICON SOUL',
    subtitle: 'Hardware-level system diagnostics.',
    role: 'Hardware Technician (Legacy)',
    category: 'tool',
    tech: ['SMD Soldering', 'Circuit Analysis', 'Firmware Flashing'],
    description: 'Early days of smartphone repair and hardware level troubleshooting - the foundation of understanding systems.',
    highlight: 'Foundation of physical systems understanding.',
    stats: { load: 100, status: 'STABLE' }
  }
];
