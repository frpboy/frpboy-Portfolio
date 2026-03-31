Reddit Sniper 🎯
Early-stage market signals before they go mainstream. Real-time Reddit monitoring without the $10k/month API bill.

Reddit Sniper is a production-grade SaaS platform that monitors Reddit at scale using intelligent polling, not expensive enterprise APIs. It detects keyword mentions across subreddits and delivers instant alerts to founders, operators, and marketers who act on early signals.

Status: Active production SaaS. 67+ deployments. Real users, real revenue.

The Problem
Reddit is where market signals appear first:

Buying intent shows up in real-time
Trends emerge before everywhere else
User sentiment is authentic and unfiltered
But monitoring Reddit properly has been broken:

Challenge	Why It Matters
Official APIs cost $10k+/month at scale	Prohibitive for startups
Rate limits destroy real-time use cases	Polling becomes practical, not official APIs
Manual tracking doesn't scale	Labor-intensive, error-prone
Traditional data platforms overengineer	You need signals, not data warehouses
Reddit Sniper solves this by optimizing for signal detection over data hoarding — a fundamentally different architectural approach.

How It Works
The Model
Continuous RSS polling (every 60 seconds) — no API dependency
Keyword matching against user-defined rules
Deduplication layer prevents alert spam
Async notification dispatch (Resend)
Basic analytics for trend tracking
Why This Approach?
RSS is stable: Reddit publishes feeds, no API changes
Polling is predictable: Fixed cost per deployment, not per request
Deduplication is essential: Reddit's volume means duplicate posts without caching
Async dispatch: Notifications don't block monitoring
Multi-tenant isolation: Each user's rules are independent
Core Features
Real-time Monitoring: Polls RSS every 60 seconds for near-instant detection
Multi-tenant SaaS: Secure accounts, isolated data, user-safe access controls
Custom Alert Rules: Each user defines keywords, subreddits, and notification preferences
Instant Email Alerts: Powered by Resend for reliability
Redis Deduplication: Caching layer prevents redundant alerts at scale
Subscription Billing: Razorpay integration for Pro/lifetime plans
Basic Analytics: Track keyword trends and match frequency
Worker Decoupling: Background service runs independently from web app
Error Tracking: Sentry integration for production reliability
System Architecture
High-Level Design
┌─────────────────────────────────────────────────────────┐
│                    REDDIT SNIPER                         │
├──────────────────────────┬──────────────────────────────┤
│        Web App           │      Worker Service          │
│   (Vercel/Next.js)       │      (Fly.io/Node.js)        │
│                          │                              │
│ • Authentication         │ • RSS Polling (60s)          │
│ • Dashboards            │ • Keyword Matching           │
│ • User Management       │ • Deduplication (Redis)      │
│ • Billing (Razorpay)    │ • Alert Queueing             │
│ • API Routes            │ • Error Handling (Sentry)    │
│                          │                              │
├──────────────┬───────────┴──────────────┬────────────────┤
│              │                          │                │
│         Supabase              Upstash Redis         Resend
│       (Auth + Data)          (Deduplication)     (Notifications)
│                                                        │
└────────────────────────────────────────────────────────┘
Why Decoupled Architecture?
Problem: Polling + notifications can block dashboards if co-located Solution: Independent worker service Benefit:

Scaling polling doesn't affect UI responsiveness
Worker failures don't break user dashboards
Each component can be deployed/updated independently
Monitoring can run 24/7 even during maintenance
Data Model
interface AlertRule {
  userId: string
  keywords: string[]
  subreddits: string[]
  minUpvotes?: number
  createdAt: timestamp
}

interface RedditPost {
  id: string
  title: string
  subreddit: string
  author: string
  upvotes: number
  timestamp: timestamp
}

interface Alert {
  userId: string
  ruleId: string
  postId: string
  matchedKeyword: string
  sentAt: timestamp
  clickedAt?: timestamp  // analytics
}
Deduplication uses a Redis set keyed on {userId}:{postId} with TTL to prevent duplicate alerts.

Tech Stack
Frontend
Next.js 15 (App Router) — Modern, server-side rendering for fast loads
TypeScript — Type safety across the full stack
Tailwind CSS — Utility-first styling for rapid UI iteration
shadcn/ui — Accessible component library
Backend & Data
Next.js API Routes — Serverless functions, zero ops overhead
Supabase — PostgreSQL + Auth (simplifies multi-tenant setup)
Prisma (optional) — Type-safe database queries
Worker & Infra
Node.js — Familiar runtime, rich ecosystem
Fly.io — Container deployment with built-in reliability
Upstash Redis — Serverless caching for deduplication
Notifications & Monitoring
Resend API — Modern email service, better deliverability than legacy SMTP
Sentry — Production error tracking and performance monitoring
Project Structure
reddit-sniper/
├── app/                    # Next.js 15 App Router
│   ├── (auth)/            # Login, signup, auth pages
│   ├── dashboard/         # Protected user dashboard
│   ├── api/               # Backend endpoints
│   │   ├── alerts/        # GET/POST alert rules
│   │   ├── billing/       # Razorpay webhook, plan info
│   │   └── health/        # Liveness checks
│   └── public/            # Landing page, pricing
│
├── components/            # Reusable React components
│   ├── AlertRuleForm.tsx  # Create/edit rules
│   ├── Dashboard.tsx      # Main UI
│   └── ...
│
├── lib/                   # Shared utilities
│   ├── supabase.ts        # Client + admin
│   ├── auth.ts            # NextAuth/custom auth
│   ├── redis.ts           # Upstash client
│   └── payments.ts        # Razorpay integration
│
├── supabase/
│   └── migrations/        # SQL schemas
│       └── 001_initial.sql
│
├── worker/                # Separate deployment
│   ├── src/
│   │   ├── poller.ts      # RSS polling loop
│   │   ├── matcher.ts     # Keyword matching
│   │   ├── dedup.ts       # Redis deduplication
│   │   ├── notify.ts      # Alert dispatch
│   │   └── index.ts       # Entry point
│   ├── fly.toml           # Fly.io config
│   └── package.json
│
├── emails/                # Email templates (Resend)
│   └── AlertEmail.tsx
│
└── package.json
Getting Started
Prerequisites
Node.js 18+
Supabase account (free tier works)
Upstash Redis account (serverless, no credit card)
Resend account for emails
Razorpay account for payments (optional, for Pro tier)
Local Development
1. Setup Supabase
# Create a project at supabase.com
# Run migrations in SQL editor:
supabase/migrations/001_initial.sql
2. Environment Variables
cp .env.example .env.local

# Fill in:
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=...
UPSTASH_REDIS_URL=redis://...
RESEND_API_KEY=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
3. Run Web App
npm install
npm run dev
# Open http://localhost:3000
4. Run Worker (in another terminal)
cd worker
npm install
npm run dev
Deployment
Web App → Vercel
vercel deploy
Automatically deploys from main branch. Env vars configured in Vercel dashboard.

Worker → Fly.io
cd worker
flyctl deploy
Runs continuously. Monitor with flyctl status and logs with flyctl logs.

Design Principles
Signals Over Data

Not a data warehouse
Optimized for real-time alerts, not bulk analytics
Alert fatigue is the enemy (hence deduplication)
Cost Efficiency

RSS polling >> Official APIs
Serverless infrastructure (no idle servers)
Straightforward pricing (users pay for alerts, not data volume)
Reliability Through Decoupling

Web app and worker are independent
If notifications are slow, dashboards remain fast
Worker can be restarted without user impact
Clear Ownership

Each user's rules are isolated
Alert delivery is guaranteed (Resend + retries)
User data is encrypted at rest (Supabase)
Observability

Sentry tracks all errors in production
Worker logs polling health
Analytics tables track user engagement
Scaling Considerations
Current Limits
Single worker: ~500 concurrent users (monitored)
Supabase free tier: Adequate for MVP
Upstash: Scales automatically
Path to Scale
Shard workers by subreddit region (if needed)
Upgrade Supabase to larger plan
Add caching layer (Cloudflare)
Implement query batching for API routes
Troubleshooting
Q: Alerts are late (> 2 minutes) A: Check worker logs. RSS feeds can lag. Subreddit-specific feeds are faster than aggregated.

Q: Missing alerts for a keyword A: Check rule syntax. Keyword matching is case-insensitive but regex-aware. See TESTING-INSTRUCTIONS.md.

Q: Duplicate alerts A: Check Redis connection. Deduplication key format: {userId}:{postId}. TTL is 24h.

Contributing
Pull requests welcome. Please:

Test locally with both web and worker running
Run npm run lint before committing
Document any new dependencies
Add tests for new features
License
MIT — See LICENSE

Acknowledgments
Built with Next.js and Vercel
Powered by Supabase (open source PostgreSQL)
Notifications via Resend
Monitoring with Sentry
Deployment on Fly.io





Sahakar Accounts
Enterprise-grade accounting system for HyperPharmacy & SmartClinic networks. Secure, scalable, multi-tenant web application designed to replace manual spreadsheet workflows with a robust role-based digital system.

Highlights
Production-ready: security audit passed, rate limiting, input validation, idempotency, timezone handling, error sanitization
Next.js App Router for SSR, serverless API routes, and edge-optimized middleware
Supabase (PostgreSQL + Auth + Realtime) with RLS policies
Two runtimes in one repo: the production Next.js app and a Vite SPA for fast local workflows
Architecture

Request Flow

Export & Logs

RBAC Overview

Tech Stack
Frameworks: Next.js ^16 (App Router), React 18, Vite ^6 (SPA)
Styling: TailwindCSS, shadcn/ui
Data: Supabase (Postgres + Auth + RLS), React Query
Validation: Zod
Charts: Chart.js + react-chartjs-2
Storage: IndexedDB (Dexie/idb) for drafts
PWA: Workbox
Repository Layout
App (Next.js): app
APIs: app/api
Middleware proxy: proxy.ts
Components: components
Libraries: lib
Hooks: hooks
Supabase migrations: supabase/migrations
Database SQL and docs: database
SPA (Vite): src
Environment
Create .env with the following (no secrets in repo):

# Next.js + Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional flags
NEXT_PUBLIC_DEV_AUTH=false
NEXT_PUBLIC_ALLOW_FORCE_LOGIN=false
Scripts
Dev (Vite SPA): npm run dev
Build (Vite SPA): npm run build
Preview (Vite SPA): npm run preview
Next dev: npm run next:dev
Next build: npm run next:build
Next start: npm run next:start
Lint: npm run lint
Type-check: npm run check
Tests (Vitest): npm run test
Supabase Setup
Create a Supabase project and obtain URL/keys
Apply migrations in supabase/migrations
RLS and policies included via migrations and SQL under database
Security & Middleware
Proxy handler enforces:
Rate limiting on /api/* with stricter limits for mutating routes and login
DEV_AUTH production safeguard
Secure auth via supabase.auth.getUser() (avoids insecure cookie reads)
Auditor read-only enforcement
Dashboard page view audit logging
See proxy.ts
API Overview (selected)
Admin: /api/admin/*
Anomalies: /api/anomalies, /api/anomalies/stats, /api/anomalies/export
Audit logs: /api/audit-logs, /api/audit/log
Daily records: /api/daily-records/*
Reports: /api/reports/*
Transactions: /api/transactions/*
Users & Staff: /api/users/*
Profiles: /api/profile
Export Logs API
GET /api/anomalies/export?limit=10

Returns recent export logs for the authenticated user: { exports: [...] }
Role-based access: superadmin, master_admin, ho_accountant, auditor
Query params: limit (default 10)
POST /api/anomalies/export

Starts an export job and creates an export_logs entry
Body: { format: 'csv' | 'json' | 'pdf', filters?: { date_range?: '1d'|'7d'|'30d'|'90d'|'1y', severity?: 'critical'|'warning'|'info'|'all', outlet_id?: string } }
Response: { export_id, status: 'processing' }
POST /api/export-log

Records an explicit export log entry (for custom reports)
Body: { export_type: 'pdf'|'excel', report_type: string, file_hash: string(64), record_count: number, filters?: object }
Response: { success: true, id }
Roles
Superadmin: full governance and audit trail access
HO Accountant: monitor and lock/verify daily records (time window)
Manager: outlet operations and approvals
Staff: data entry only
Auditor: read-only; blocked from writes by proxy
Offline & PWA
Draft-only offline mode to preserve accounting integrity
IndexedDB-backed drafts, explicit submission when online
Workbox caching for assets; installable PWA
Testing & Linting
ESLint flat config across TS/TSX: eslint.config.js
TypeScript build checks: npm run check
Vitest for component tests; currently configured to pass without SPA tests pending stabilization
Deployment (Vercel)
Git push to main triggers build and deploy
Ensure environment variables set in Vercel project
Large build artifacts are ignored (.next/ not tracked)
Troubleshooting
Insecure user warning: switch to supabase.auth.getUser() (already implemented)
Cookie API errors: use Next 16 cookies correct signatures (already implemented)
Supabase connection: verify env vars and project settings
License
MIT License

Acknowledgments
Supabase, Next.js, TailwindCSS, shadcn/ui, React Query, Chart.js ecosystem




ZERPAI ERP - Monorepo
Modern ERP system with Flutter frontend and NestJS backend.

📁 Monorepo Structure
zerpai_erp/
├── lib/                    # Flutter Frontend (Web + Android)
│   ├── core/               # Core utilities, API client
│   ├── data/               # Models, repositories
│   ├── modules/            # Feature modules
│   └── shared/             # Shared widgets, services
│
├── backend/                # NestJS Backend API
│   ├── src/
│   │   ├── products/       # Products module
│   │   ├── supabase/       # Supabase client
│   │   ├── common/         # Middleware (multi-tenant)
│   │   └── main.ts
│   └── package.json
│
├── supabase/               # Database
│   └── migrations/         # SQL migrations
│
├── pubspec.yaml            # Flutter dependencies
└── README.md
🚀 Tech Stack
Frontend: Flutter (Web + Android), Riverpod, Dio
Backend: NestJS, TypeScript, Supabase Client
Database: Supabase (PostgreSQL) + Auth + Storage
Multi-tenancy: org_id + outlet_id filtering
🎨 UI Surface Rule
Dialogs, popup menus, dropdown overlays, date pickers, popovers, and similar floating surfaces must default to pure white #FFFFFF.
Do not rely on inherited Material surface tinting for these components unless a design exception is explicitly requested.
🧱 Canonical Flutter Structure Rule
lib/core/ is for app infrastructure only: routing, theme, logging, shell layout, and bootstrap concerns.
lib/core/layout/ is only for app shell/navigation infrastructure such as sidebar, navbar, and shell metrics.
lib/shared/widgets/ is the canonical home for reusable widgets, dialogs, inputs, page wrappers, and responsive UI primitives.
lib/shared/services/ is the canonical home for cross-feature services consumed by modules and repositories.
lib/modules/ remains the home for feature-specific code.
Do not use lib/core/widgets/ as the reusable widget home.
📅 Shared Date Picker Rule
Use ZerpaiDatePicker from lib/shared/widgets/inputs/zerpai_date_picker.dart as the standard reusable date picker across the app wherever the shared anchored picker pattern is feasible.
Avoid new direct showDatePicker(...) usage for standard ERP date fields unless there is a documented reason the shared picker cannot be used.
🌐 Global Settings Rules
Use real DB-backed runtime data wherever a schema-backed source exists; do not depend on dummy or demo values in active ERP flows.
If real data is missing, show explicit empty/error states rather than inventing placeholder operational values.
Resolve lookup defaults from DB-backed master rows where schema-backed masters exist instead of hardcoding IDs or visible labels.
Reuse shared controls and centralized style sources for common ERP patterns instead of rebuilding local one-off variants.
Use the shared responsive foundation for Flutter web layouts: global breakpoints, shared responsive table shells, shared responsive form rows/grids, shared responsive dialog width rules, and sidebar-aware shell/content metrics.
New modules and major internal sub-screens must be deep-linkable through GoRouter so refresh, direct URL entry, and browser history preserve working context.
Keep warehouse master data, storage/location master data, accounting stock, and physical stock logically separate.
Prefer additive migrations and INSERT ... ON CONFLICT DO UPDATE style seeding over destructive resets in shared environments.
Keep button and control styling consistent: primary save/create/confirm actions use the approved primary/success button styling, cancel/secondary actions use neutral secondary styling, upload controls follow the shared upload pattern, and borders/dividers use the approved light border tokens.
📐 Responsive Foundation Rule
Flutter web layouts must use the shared responsive foundation instead of screen-local overflow patches.
Foundation pieces:
global breakpoints in lib/shared/responsive/breakpoints.dart
shared responsive table shell for dense/wide tables
shared responsive form row/grid primitives for labels and fields
shared responsive dialog width rules
sidebar-aware shell/content metrics from the core layout layer
🛠️ Development Setup
Prerequisites
Flutter SDK 3.x
Node.js 20+
Supabase account
1. Database Setup
Run the migration in Supabase dashboard:

# Copy contents of: supabase/migrations/001_initial_schema_and_seed.sql
# Paste in: Supabase Dashboard → SQL Editor → New Query
2. Backend Setup
cd backend
npm install
npm run start:dev  # Runs on http://localhost:3001
3. Frontend Setup
flutter pub get
flutter run -d chrome
🌐 Environment Variables
Frontend (.env)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
API_BASE_URL=http://localhost:3001
Backend (backend/.env)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=3001
📊 Architecture
Flutter App
    ↓ REST API (dio)
NestJS Backend (Multi-tenant middleware)
    ↓ SQL Queries
Supabase PostgreSQL (RLS enabled)
🔒 Multi-Tenancy
Every request includes:

X-Org-Id header (organization)
X-Outlet-Id header (outlet/branch)
Backend automatically filters all queries by org_id.

📦 Available Scripts
Backend
npm run start:dev - Development mode
npm run build - Production build
npm test - Run tests
Frontend
flutter run - Run app
flutter build web - Build for web
flutter test - Run tests
🤝 Contributing
Create feature branch from main
Make changes
Test locally
Create pull request
📝 License
Private - ZABNIX Organization


MediReport
MediReport is a production-grade, multi-outlet diagnostic reporting platform.

Core Principles
Draft → Final Lifecycle: Strict state machine prevents editing finalized reports.
Immutable Records: Final reports are stamped, watermarked, hashed, and locked forever.
Private Storage: PDFs are stored in a private Cloudflare R2 bucket and served only via secure proxy.
Tamper-Evident: Every page is stamped with the outlet name; every document is hashed (SHA-256).
Outlet-Scoped: Strict isolation ensures users only access data from their assigned outlet.
Tech Stack
Frontend: Next.js 14 (App Router), Tailwind CSS, Lucide Icons
Backend: Next.js API Routes (Serverless)
Database: Neon (PostgreSQL) + Prisma ORM
Storage: Cloudflare R2 (Private Object Storage)
Auth: NextAuth.js v4
Security: pdf-lib (Watermarking), crypto (Hashing)
Deployment: Vercel
Architecture
Unable to render rich display

Parse error on line 2:
...NextApp[Next.js App (Vercel)] s
-----------------------^
Expecting 'SQE', 'DOUBLECIRCLEEND', 'PE', '-)', 'STADIUMEND', 'SUBROUTINEEND', 'PIPE', 'CYLINDEREND', 'DIAMOND_STOP', 'TAGEND', 'TRAPEND', 'INVTRAPEND', 'UNICODE_TEXT', 'TEXT', 'TAGSTART', got 'PS'

For more information, see https://docs.github.com/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams#creating-mermaid-diagrams

graph TD
    User[Browser / Mobile] -->|Secure Request| NextApp[Next.js App (Vercel)]
    
    subgraph "Secure Zone"
    NextApp -->|Auth Check| NextAuth
    NextApp -->|Data Query| Prisma
    NextApp -->|File Stream| Proxy[API Proxy]
    end
    
    Prisma -->|Persist| NeonDB[(PostgreSQL)]
    Proxy -->|Private Access| R2[(Cloudflare R2)]
    
    subgraph "Security Pipeline"
    Proxy -.->|Validate| Session
    Proxy -.->|Verify| Token
    end
Security Model
No Public URLs: R2 bucket is private. Direct access is impossible.
Streaming Proxy: Files are streamed from R2 to the client via /api/reports/file.
Strict Headers: Cache-Control: no-store, X-Content-Type-Options: nosniff.
Integrity Check: SHA-256 hash is computed at finalization and stored in the DB (pdfHash).
Audit Logs: All critical actions (Finalize, Login) are logged irreducibly.
Key Features
🛡️ Diagnostic Security
Per-Page Stamping: "Outlet: {Name} · Generated by MediReport"
Visual Verification: Diagonal "Verified Report" Watermark.
QR Verification: Public verification page /verify/[token] with hash validation.
📊 Admin Analytics
Super Admin Dashboard: Real-time network overview at /dashboard/admin/analytics.
Operational Metrics: Active outlets, daily volume, draft vs. final discipline.
🎨 Fluid UX
Green & White Theme: Professional medical aesthetic.
Responsive Design: Mobile drawer, adaptive grids, and touch-optimized interactions.
Deployment
Branch: main
Platform: Vercel (Automatic Deployments)
Env Vars:
DATABASE_URL
NEXTAUTH_SECRET
R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
Getting Started
Follow these steps to set up and run the project locally.

Prerequisites
Node.js (v18 or higher recommended)
npm (or your preferred package manager)
Installation
Clone the repository:

git clone https://github.com/your-username/medireport.git
cd medireport
Install dependencies:

npm install
Set up environment variables:

Create a .env file in the root directory by copying the example file:

cp .env.example .env
Then, fill in the required values in the .env file:

DATABASE_URL: Your PostgreSQL connection string.
NEXTAUTH_SECRET: A secret key for NextAuth.js. You can generate one with openssl rand -base64 32.
R2 variables are optional for local development unless you are testing file storage.
Running the Development Server
Once the installation is complete, you can start the development server:

npm run dev
Open http://localhost:3000 with your browser to see the result.

Database
This project uses Prisma to manage the database schema and data.

Migrations
To apply database migrations, run the following command:

npx prisma migrate dev
This will create the necessary tables and relations in your database based on the schema.prisma file.

Seeding
To seed the database with initial data, run the following command:

npx prisma db seed
The seed script is defined in prisma/seed.ts and can be modified to suit your needs.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Built for Trust, Clarity, and Operational Confidence.







Nah That's Fake - Telegram Bot & TMA
A comprehensive deepfake and scam detection system built for Telegram, featuring both a bot and a Telegram Mini App (TMA).

🚀 Features
Deepfake Detection: AI-powered image analysis to detect AI-generated content
Scam Link Detection: Multi-vendor URL scanning for phishing and malware
Telegram Integration: Seamless bot and TMA experience
Premium Plans: Razorpay and Telegram Stars payment integration
Referral System: Earn credits by inviting friends
Rate Limiting: Built-in abuse prevention
Real-time Analytics: Comprehensive check history and statistics
📁 Project Structure
NahThatsFake/
├── bot/                    # Telegram Bot (Node.js + TypeScript)
│   ├── src/
│   │   ├── index.ts       # Main bot entry point
│   │   ├── handlers/    # Command and message handlers
│   │   ├── utils/       # Utility functions
│   │   └── middleware/  # Rate limiting, consent, etc.
│   └── package.json
├── tma/                   # Telegram Mini App
│   ├── index.html       # TMA frontend
│   ├── server.js        # TMA backend server
│   └── package.json
├── supabase/             # Database schema and migrations
│   ├── schema.sql       # Database tables
│   ├── rls_policies.sql # Row Level Security
│   └── functions.sql    # PostgreSQL functions
└── shared/              # Shared types and utilities
🛠️ Tech Stack
Backend
Node.js with TypeScript
Grammy - Telegram Bot Framework
Supabase - PostgreSQL database and authentication
Axios - HTTP client for API calls
Frontend (TMA)
HTML/CSS/JavaScript - Vanilla JS for TMA
Express.js - Backend API server
Telegram Web App SDK - TMA integration
APIs
Sightengine - Deepfake detection
Google Safe Browsing - URL safety
VirusTotal - Multi-vendor URL scanning
Razorpay - Payment processing
🚀 Getting Started
Prerequisites
Node.js 18+
Telegram Bot Token
Supabase account and project
API keys for detection services
1. Clone and Setup
git clone <repository-url>
cd NahThatsFake
2. Setup Database
Create a Supabase project
Run the schema migrations in supabase/schema.sql
Apply RLS policies from supabase/rls_policies.sql
Add database functions from supabase/functions.sql
3. Configure Bot
cd bot
cp .env.example .env
# Edit .env with your credentials
npm install
npm run build
npm start
4. Configure TMA
cd tma
cp .env.example .env
# Edit .env with your credentials
npm install
npm start
🔧 Configuration
Environment Variables (Bot)
BOT_TOKEN=your_telegram_bot_token
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key
Environment Variables (TMA)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
PORT=3000
📊 Database Schema
Core Tables
users - User profiles and subscription status
checks - History of all image/link checks
check_cache - Caching layer for API responses
payments - Payment history and transactions
referrals - Referral tracking and credits
groups - Telegram group premium status
abuse_flags - Abuse detection and prevention
🎯 Bot Commands
/start - Welcome and onboarding
/check - Prompt to send content for checking
/credits - View credit balance
/refer - Generate referral link
/history - View recent checks
/premium - Premium subscription options
💳 Pricing Plans
Individual Plans
Free: 3 checks/day + bonus credits
Monthly: ₹99 - Unlimited checks
Annual: ₹799 - Unlimited checks (33% off)
Group Plans
Group Monthly: ₹299 - Unlimited group checks
🔒 Security Features
Row Level Security (RLS) policies
Rate limiting and abuse detection
API key management
Privacy-first design (no image storage)
Secure payment processing
🚀 Deployment
Bot Deployment
Build the bot: npm run build
Deploy to your preferred hosting (Railway, Render, etc.)
Set environment variables
Start the bot service
TMA Deployment
Deploy the TMA server to a hosting platform
Configure HTTPS (required for TMA)
Update bot to point to TMA URL
Configure Telegram Mini App settings
📈 Monitoring
Database performance monitoring via Supabase
Bot analytics through Telegram
Payment tracking through Razorpay dashboard
Error logging and alerting
🤝 Contributing
Fork the repository
Create a feature branch
Make your changes
Add tests if applicable
Submit a pull request
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🆘 Support
For support and questions:

Create an issue in the repository
Contact the development team
Check the documentation in the /docs folder
Nah That's Fake - Making the internet a safer place, one check at a time! 🔍✨













🏛️ BRIC – Wealth Management Platform
License Firebase Flutter Built by Status

BRIC is a corporate-grade wealth distribution platform that delivers transparent, government-style administrative hierarchy-based commission distribution. Built with Flutter and powered by Firebase, BRIC provides a professional solution for managing sales, incentives, and organizational hierarchies.

Property of Zabnix | Built by frpboy | © 2025 All Rights Reserved

🚀 Deployment Status
Live Application: https://bric-wealth.web.app
Last Verified: December 22, 2025, 2:15 PM IST
Version: 4.0 (Post-Remediation Verified)

✅ Production Status: VERIFIED FUNCTIONAL
Critical Fixes Deployed & Verified:

🟢 Timestamp Parsing - All 23 timestamp fields across 6 models parse correctly
🟢 Authentication - Route guards active, session management working
🟢 Admin Accounts - Master Admin and Admin accounts fully provisioned
🟢 Dashboard Loading - Zero crashes across all tested roles
🟢 Sales Creation - Form accessible and functional
Independent Audit Results (Dec 22, 2025):

✅ 3/3 tested accounts (masteradmin, admin, national) - 100% success rate
✅ Before remediation: 0% functional → After: 75% functional
✅ All SEV-1 critical blocking bugs resolved
⚠️ Remaining: Commission engine verification, complete role provisioning
Testing Summary:

Feature	Status	Notes
Login/Auth	✅ Working	All tested roles authenticate successfully
Dashboard	✅ Working	Loads without crashes, displays metrics
Sales Form	✅ Working	Accessible, form validation functional
Commission Calc	🟡 Partial	Forms work, end-to-end testing pending
Role Isolation	🟡 Partial	Basic permissions work, deep testing needed
For complete audit reports, see:

Post-Remediation Audit
Verified Assessment
🌟 Features
💼 Role-Based Sales Management
10-Level Administrative Hierarchy: Master Admin → National → Region → State → Zonal → District → Assembly → Panchayath/LSG → Ward
Hierarchical Organization: Teams organized by formal government-style tiers, NOT MLM/network marketing
Transparent Role Structure: Clear organizational structure with defined responsibilities at each level
💰 Verified Commission System
Fixed Distribution Model: 50% Company | 2% Activity Expenses | 48% Admin-Configured per Project
Hierarchy Levels: 9 government administrative levels (National → Ward)
Admin Configuration: Each project has a commission table defining % for each role level
Self-Adjusting Formula: Works with any hierarchy depth automatically
Activity Expense Fund: System-controlled pool for wellness and engagement activities
Real-time Calculations: Instant weighted commission breakdown preview before sale submission
📊 Comprehensive Dashboards
User Dashboard: Personal sales metrics, commission earnings, and hierarchy position
Incentive History: Complete earning ledger with date filters and detailed breakdowns
Sale Breakdown: Transparent visualization showing exactly how each commission was distributed
Participant Views: Drill-down into organizational hierarchy and fund flow
Activity Pool Dashboard: Track wellness fund allocation and usage
🔒 Enterprise-Grade Security
Firebase Authentication: Secure user login and session management
Firestore Security Rules: Role-based data access control at database level
App Check Integration: Protection against API abuse and unauthorized access
Encrypted Storage: Secure handling of sensitive financial data
🚀 Technology Stack
Frontend
Framework: Flutter 3.5.4
Language: Dart
State Management: Riverpod 3.0.3
Navigation: GoRouter 14.8.1
Charts: FL Chart + Syncfusion Charts
Backend
Platform: Firebase
Database: Cloud Firestore (NoSQL)
Authentication: Firebase Auth
Storage: Firebase Cloud Storage
Functions: Cloud Functions for Node.js 24
Hosting: Firebase Hosting
Analytics: Firebase Analytics
Messaging: Firebase Cloud Messaging
Additional Libraries
firebase_core - Firebase initialization
firebase_auth - User authentication
cloud_firestore - Real-time database
firebase_storage - File storage
firebase_analytics - Usage tracking
firebase_messaging - Push notifications
flutter_svg - SVG graphics
image_picker / image_cropper - Media handling
intl - Internationalization and date formatting
logger - Structured logging
uuid - Unique identifier generation
📐 Architecture Overview
┌─────────────────────────────────────────────────────────────┐
│                      Flutter Application                     │
├─────────────────────────────────────────────────────────────┤
│  UI Layer (lib/features/)                                   │
│  ├── Sales Management                                       │
│  ├── Dashboard & Analytics                                  │
│  ├── Ledger & Incentive History                            │
│  ├── Profile Management                                     │
│  └── Authentication                                          │
├─────────────────────────────────────────────────────────────┤
│  Logic Layer (lib/logic/)                                   │
│  ├── Incentive Engine (50-2-48 Distribution)               │
│  ├── Riverpod Providers (State Management)                 │
│  └── Business Logic                                         │
├─────────────────────────────────────────────────────────────┤
│  Data Layer (lib/data/)                                     │
│  ├── Models (User, Sale, Incentive)                        │
│  ├── Repositories (Firestore Access)                       │
│  └── Services (Analytics, Messaging, Storage)              │
├─────────────────────────────────────────────────────────────┤
│  Core (lib/core/)                                           │
│  ├── Router (Navigation)                                   │
│  ├── Theme (Styling)                                        │
│  ├── Constants & Utils                                      │
│  └── Error Handling                                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Firebase Backend                          │
├─────────────────────────────────────────────────────────────┤
│  Firestore Collections                                      │
│  ├── /users/{userId} - User profiles & balances            │
│  ├── /sales/{saleId} - Sale records                        │
│  ├── /incentives/{incentiveId} - Commission entries        │
│  └── /activityExpensePool/{poolId} - Activity fund         │
├─────────────────────────────────────────────────────────────┤
│  Cloud Functions                                            │
│  └── distributeIncentives - Auto commission calculation    │
├─────────────────────────────────────────────────────────────┤
│  Security Rules                                             │
│  ├── firestore.rules - Database access control             │
│  └── storage.rules - File access control                   │
└─────────────────────────────────────────────────────────────┘
⚙️ Installation & Setup
Prerequisites
Before you begin, ensure you have the following installed:

Flutter SDK: Version 3.5.4 or higher (Installation Guide)
Dart SDK: Included with Flutter
Firebase CLI: For deployment (Installation Guide)
Node.js: Version 24 or higher (for Cloud Functions)
Git: For version control
Code Editor: VS Code, Android Studio, or IntelliJ IDEA
1. Clone the Repository
git clone https://github.com/frpboy/BRIC.git
cd BRIC
2. Install Flutter Dependencies
flutter pub get
3. Firebase Configuration
The project is already configured with Firebase. Configuration files are included:

lib/firebase_options.dart - Generated Firebase configuration
google-services.json - Android configuration
GoogleService-Info.plist - iOS configuration
firebase.json - Firebase project settings
firestore.rules - Database security rules
storage.rules - Storage security rules
firestore.indexes.json - Composite indexes
Note: These files contain configuration for the production Firebase project bric-wealth. If you need to set up your own Firebase project, see FIREBASE_SETUP.md.

4. Environment Variables
Create a .env file in the project root (if not already present):

# Add any environment-specific configurations here
# Currently, Firebase config is handled via firebase_options.dart
5. Run the Application
Web (Recommended for development)
flutter run -d chrome
Android
flutter run -d <device-id>
iOS
flutter run -d <device-id>
To see available devices:

flutter devices
🔥 Firebase Deployment
Deploy Firestore Rules & Indexes
firebase deploy --only firestore
Deploy Storage Rules
firebase deploy --only storage
Deploy Cloud Functions
cd functions
npm install
cd ..
firebase deploy --only functions
Deploy Web App to Firebase Hosting
# Build the Flutter web app
flutter build web

# Deploy to Firebase Hosting
firebase deploy --only hosting
Live URL: https://bric-wealth.web.app

Deploy Everything
flutter build web
firebase deploy
🏗️ Building for Production
Android APK
flutter build apk --release
Output: build/app/outputs/flutter-apk/app-release.apk

Android App Bundle (for Play Store)
flutter build appbundle --release
Output: build/app/outputs/bundle/release/app-release.aab

iOS
flutter build ios --release
Then open ios/Runner.xcworkspace in Xcode and archive for distribution.

Web
flutter build web --release
Output: build/web/

📁 Project Structure
BRIC/
├── android/                 # Android native code
├── ios/                     # iOS native code
├── web/                     # Web-specific files
├── lib/
│   ├── app.dart            # Main application widget
│   ├── main.dart           # Entry point with Firebase init
│   ├── firebase_options.dart  # Firebase configuration
│   ├── config/             # App configuration
│   ├── constants/          # App-wide constants
│   ├── core/
│   │   ├── router/         # Navigation & routing (GoRouter)
│   │   ├── theme/          # App theme & styling
│   │   ├── services/       # Core services (Analytics, Messaging, Storage)
│   │   ├── utils/          # Utility functions
│   │   └── errors/         # Error handling
│   ├── data/
│   │   ├── models/         # Data models (User, Sale, Incentive)
│   │   ├── repositories/   # Data access layer
│   │   └── demo/           # Demo/test data
│   ├── features/           # Feature modules
│   │   ├── auth/           # Authentication screens
│   │   ├── dashboard/      # Dashboard & analytics
│   │   ├── sales/          # Sale management
│   │   ├── ledger/         # Incentive history
│   │   └── profile/        # User profile
│   ├── logic/
│   │   ├── engine/         # Incentive calculation engine ⭐
│   │   └── providers/      # Riverpod state providers
│   └── shared/             # Shared widgets & utilities
├── functions/              # Firebase Cloud Functions
│   ├── index.js           # Cloud Functions implementation
│   └── package.json       # Node.js dependencies
├── assets/
│   ├── images/            # Image assets
│   └── icons/             # Icon assets
├── firebase.json          # Firebase configuration
├── firestore.rules        # Firestore security rules
├── firestore.indexes.json # Firestore composite indexes
├── storage.rules          # Storage security rules
├── pubspec.yaml           # Flutter dependencies
└── README.md              # This file
Key Files
lib/logic/engine/incentive_engine.dart: Core 50-2-48 distribution algorithm ⭐
lib/features/sales/presentation/screens/add_sale_screen.dart: Sale creation with real-time breakdown
lib/features/ledger/presentation/screens/incentive_history_screen.dart: User earnings ledger
lib/features/sales/presentation/screens/sale_breakdown_screen.dart: Transparent commission visualization
functions/index.js: Cloud Function for automatic incentive distribution
🧪 Testing
Test Users
The system includes pre-configured test users representing the full hierarchy:

Email	Password	Role	Level	Status
masteradmin@test.com	Test@123	Master Admin	0	✅ Verified
admin@test.com	Test@123	Admin	1	✅ Verified
national@test.com	Test@123	National	2	✅ Verified
region@test.com	Test@123	Region	3	⚠️ Needs Testing
state@test.com	Test@123	State	4	⚠️ Needs Testing
zonal@test.com	Test@123	Zonal	5	✅ Working
district@test.com	Test@123	District	6	✅ Working
assembly@test.com	Test@123	Assembly	7	✅ Working
panchayath@test.com	Test@123	Panchayath/LSG	8	✅ Working
ward@test.com	Test@123	Ward	9	✅ Working
activity@test.com	Test@123	Activity/Expense	Special	⚠️ Needs Testing
Note: All passwords updated to Test@123 (case-sensitive). Accounts marked as "Verified" have been independently tested and confirmed working in production.

Running Tests
# Run all tests
flutter test

# Run specific test file
flutter test test/incentive_engine_test.dart

# Run with coverage
flutter test --coverage
Manual Testing Checklist
✅ Login: Test authentication with various user roles
✅ Dashboard: Verify metrics display correctly
✅ Create Sale: Submit test sale and verify commission calculation
✅ Incentive History: Check earnings ledger populates correctly
✅ Sale Breakdown: Verify participant list and distribution amounts
✅ Navigation: Test bottom navigation and routing
✅ Profile: View and update user profile
For detailed testing results, see: test results.md

📊 Business Logic: 50-2-48 Weighted Distribution
How It Works
When any user in the hierarchy creates a sale:

Company receives 50% (fixed)
Activity Expense Pool receives 2% (fixed)
Remaining 48% is distributed using WEIGHTED model (position-based)
Weighted Commission Model
NOT equal distribution - uses a weight ladder based on position in the participant chain.

Weight Ladder (Position-Based)
Position	Role Description	Weight
1	Initiator	12
2	Upward-1	8
3	Upward-2	6
4	Upward-3	5
5	Upward-4	4
6	Upward-5	3
7	Upward-6	2
8	Upward-7	1
Total Weights = 12 + 8 + 6 + 5 + 4 + 3 + 2 + 1 = 41

Formula
Participant % = (Participant Weight ÷ Total Weight) × 48%
Eligible Participants
The user who initiated the sale (initiator - gets highest weight 12)
All hierarchy levels ABOVE the initiator (decreasing weights 8, 6, 5...)
Levels BELOW the initiator receive nothing
Example: Ward User Creates Sale
Scenario: Ward user (9th Ward, Kuttor Panchayath) creates ₹7,00,000 franchise sale with ₹2,00,000 commission

Participant Chain (8 people):
Ward → Panchayath → Assembly → District → Zonal → State → Region → National

Total Weight: 12 + 8 + 6 + 5 + 4 + 3 + 2 + 1 = 41

Distribution:

Level	Role	Position	Weight	Formula	Commission %	Amount (₹)
1	Ward (9th Ward, Kuttor GP)	Initiator	12	(12/41)×48%	14.05%	28,100
2	Panchayath (Kuttor GP)	Upward-1	8	(8/41)×48%	9.37%	18,740
3	Assembly (Thiruvalla)	Upward-2	6	(6/41)×48%	7.02%	14,040
4	District (Pathanamthitta)	Upward-3	5	(5/41)×48%	5.85%	11,700
5	Zonal (Central Kerala)	Upward-4	4	(4/41)×48%	4.68%	9,360
6	State (Kerala)	Upward-5	3	(3/41)×48%	3.51%	7,020
7	Region (South India)	Upward-6	2	(2/41)×48%	2.34%	4,680
8	National (India)	Upward-7	1	(1/41)×48%	1.17%	2,340
—	Subtotal (Participants)	—	41	—	48.00%	₹96,000
—	Activity/Expense Pool	—	—	Fixed	2.00%	₹4,000
—	Company	—	—	Fixed	50.00%	₹1,00,000
—	TOTAL	—	—	—	100.00%	₹2,00,000 ✓
Why This Model Works
✅ Fair Recognition: Initiator gets the highest share (14.05%) - incentivizes direct sales
✅ Self-Adjusting: Fewer hierarchy levels = larger shares per participant
✅ Predictable: Formula is deterministic and transparent
✅ Audit-Friendly: Single source of truth, mathematically verifiable
✅ Scalable: Works regardless of hierarchy depth changes

One-Line Rule:
"Commission is calculated from a fixed distributable pool using a relative weight ladder applied from the sale initiator upward through the organizational hierarchy."

📖 Documentation
PLAN.md: Detailed production implementation plan
SETUP_GUIDE.md: Step-by-step setup instructions
FIREBASE_SETUP.md: Firebase configuration guide (to be created)
test results.md: Live testing feedback and bug tracking
TASK_LOG.md: Development task log
WALKTHROUGH.md: Feature walkthrough
🤝 Contributing
This is proprietary software owned by Zabnix. Unauthorized copying, modification, or distribution is strictly prohibited. See LICENSE for details.

If you are an authorized contributor:

Create a feature branch: git checkout -b feature/your-feature-name
Commit changes: git commit -am 'Add some feature'
Push to branch: git push origin feature/your-feature-name
Submit a pull request for review
📄 License
Proprietary Software - © 2025 Zabnix. All Rights Reserved.

This software is the exclusive property of Zabnix. Built by frpboy.

Unauthorized copying, modification, distribution, or use of this software is strictly prohibited without explicit written permission from Zabnix.

See LICENSE file for complete terms.

👨‍💻 Credits
Built by: frpboy
Property of: Zabnix
Project Repository: https://github.com/frpboy/BRIC

📞 Support
For questions, issues, or licensing inquiries, please contact:

GitHub: frpboy
Repository Issues: GitHub Issues
Made with ❤️ in India | Powered by Flutter & Firebase










Ashique-Digital — Brand Strategist & Lead Generation Specialist
🚀 Stop running ads. Start building a growth system.

Ashique Digital is a premium, high-performance web application built for Ashique, a Brand Strategist helping SMEs and startups turn digital marketing into predictable revenue engines.

✨ Tech Stack & Architecture
Framework: Next.js 15.3+ (App Router, Turbopack)
Styling: Tailwind CSS v4 + CSS Variables for Design Tokens
Animations: Framer Motion & Three.js (for 3D visual elements)
CMS: Sanity.io (Headless CMS for Case Studies & Insights)
Analytics: PostHog (Self-hosted/Reverse-proxy for Session Replay, Heatmaps, and Autocapture)
AI: Google Gemini Pro 2.0 (Powering the custom AI Growth Assistant)
Database: Upstash Redis & Pinecone (for RAG context)
Scheduling: Cal.com (Direct embedding for strategy calls)
🛠️ Key Features
Interactive AI Assistant: A custom-trained growth bot that handles leads, answers common questions, and facilitates booking.
Dynamic Mouse Trail: Custom-built Node/Data trail that follows user interaction.
Fluid Responsiveness: High-fidelity design that scales from mobile devices to ultra-wide desktop monitors.
PostHog Stealth Proxy: Advanced reverse-proxy setup to bypass adblockers and ensure 100% accurate session recording.
Dark Mode Optimization: Hand-crafted color palettes for professional typographic brutalism.
🚀 Getting Started
Clone the repository:

git clone https://github.com/frpboy/ashique-digital.git
Install dependencies:

npm install
Configure Environment Variables: Copy .env.example to .env.local and add your keys for Sanity, PostHog, Gemini, and Cal.com.

Run development server:

npm run dev
👨‍💻 Developer & Designer
Developed and Designed with ❤️ by frpboy.

© 2026 Ashique-Digital. All rights reserved.





🎉 his-birthday
his-birthday cover

A minimal, interactive birthday microsite crafted as a personal digital experience for a friend.
Designed to feel thoughtful, immersive, and calm—without unnecessary gimmicks.

This isn’t just a “birthday wish”.
It’s a moment.

✨ What Makes This Special
🎶 Cinematic background music (starts intentionally, never intrusive)
🖥️ Matrix-style visual atmosphere
🧊 Glassmorphism message card for a premium look
🕰️ Time-aware messages (changes based on time of day)
📅 Date-based logic (special messages appear only on the birthday)
🔐 Gesture-based unlock (swipe up / tap to begin)
🥚 Hidden easter egg (for the curious and observant)
📱 Mobile-first & responsive
🚫 No ads, no tracking, no noise
Everything is subtle by design.
Less flash, more feeling.

🧠 Design Philosophy
Restraint over excess
Emotion over effects
Intentional interaction over autoplay chaos
Every interaction exists for a reason.
If it doesn’t add meaning, it doesn’t belong.

🛠️ Tech Stack
HTML5
CSS3 (Glassmorphism, subtle animations)
Vanilla JavaScript
Local audio (browser-policy compliant)
Touch + keyboard interaction support
No frameworks.
No dependencies.
Just clean, understandable code.

🎮 How It Works
Page loads silently with a minimal start screen
User performs a gesture (swipe up / tap) to unlock
Visuals + music + message appear together
Time-based and date-based messages adjust automatically
Optional hidden easter egg rewards curiosity
Everything runs locally and reliably across modern browsers.

📷 Browser Compatibility Notes
Audio starts only after user interaction (by design, per browser rules)
Works on Chrome, Edge, Firefox, Safari (desktop & mobile)
Graceful degradation: if a feature isn’t supported, the experience still runs
💡 Inspiration & Credit
This project is inspired by the beautiful concept and execution by Real-Sam
👉 https://github.com/Real-Sam/her-birthday

This version adapts the idea with:

a different emotional tone
additional interaction layers
a focus on restraint and premium UX
Full credit and respect to the original creator for the inspiration.

📌 Purpose
This project was built for one person, for one day.
That’s intentional.

It’s not meant to scale.
It’s meant to matter.

📄 License
This project is licensed under the MIT License.

You are free to:

use
modify
adapt
…with attribution.

If you use this as inspiration for something personal, keep the spirit intact:
build with intention, not excess.

🖤 Final Note
If you’re reading this and thinking:

“This feels unusually thoughtful for a birthday page…”

That was the goal.

🚀 Deployment (GitHub Pages)
This project can be deployed easily using GitHub Pages.

Steps:
Go to the repository Settings
Navigate to Pages
Under Source, select:
Branch: main
Folder: / (root)
Save
Once enabled, the site will be available at:

https://.github.io/his-birthday/

Notes:
Ensure index.html is in the root directory
Audio and assets must use relative paths
First load may take a minute after enabling Pages
No build step required.











SAHAKAR PO System
A highly resilient Purchase Order (PO) Management platform built for internal business use, connecting Store Managers, PO Managers, and Administrators in a real-time environment.

⚙️ Core Technology Stack
Frontend: Next.js (App Router) + React + TypeScript
Styling: TailwindCSS + shadcn/ui
Database: Google Cloud Firestore (Client SDK and Admin SDK via Node.js APIs)
Authentication: Firebase Auth (Email/Password & Role-based guards)
Deployment: Vercel
Flutter Web Port
The repository now also contains a Flutter Web implementation inside flutter_web_app/ for teams that prefer a single cross-platform client. The Flutter app mirrors every major page, drawer, and data workflow from the Next.js UI while talking directly to the same Firebase project.

Key highlights:

Riverpod-powered providers for auth, offline, cart, drawer, and messaging state (ported from React context/hooks).
Firestore integration via cloud_firestore, firebase_auth, and firebase_storage, including demand, orders, carts, announcements, and admin collections.
Responsive layouts and form validation that mimic the original UX (e.g., store new order tables, PO demand management, admin requests).
Excel import, announcements, MOQ management, and dashboards recreated with Flutter widgets.
To run the Flutter client locally:

cd flutter_web_app
flutter pub get
flutter run -d chrome --dart-define=FIREBASE_API_KEY=XXX --dart-define=FIREBASE_AUTH_DOMAIN=XXX \
  --dart-define=FIREBASE_PROJECT_ID=XXX --dart-define=FIREBASE_STORAGE_BUCKET=XXX \
  --dart-define=FIREBASE_MESSAGING_SENDER_ID=XXX --dart-define=FIREBASE_APP_ID=XXX
All Firebase env values map 1:1 to the NEXT_PUBLIC_ entries already used by the React client.

🚀 Setup and Deployment
1. Local Development Setup
Clone the repository.

Install dependencies:

npm install
Configure Environment: Create a .env.local file in the project root.

Fill in all NEXT_PUBLIC_ variables from your Firebase Project Settings.
Fill in all server-side variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL).
CRITICAL: The FIREBASE_PRIVATE_KEY must be a single line, double-quoted string with newlines escaped (\\n).
Admin Service Account: Place the service-account-key.json file (used for direct file reading) in the project root for local testing resilience.

Run Development Server:

npm run dev
2. Required Database Configuration (Once per Project)
The following steps must be completed in the Firebase Console:

Deploy Security Rules: Publish the contents of firestore.rules.
Deploy Composite Indexes: Deploy the indexes defined in firestore.indexes.json using the Firebase CLI:
firebase deploy --only firestore:indexes
Google Cloud IAM: Ensure the service account used for the Admin SDK has the Cloud Datastore User role assigned in the Google Cloud Console.
3. Vercel Deployment
Environment Variables: In your Vercel project settings, add the following variables:

All NEXT_PUBLIC_ variables.
FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL.
FIREBASE_PRIVATE_KEY: Paste the multi-line key exactly as it appears in the JSON file (Vercel handles the newlines automatically).
Deploy: Push code to GitHub and allow Vercel to build.

🔑 Role Matrix
Role	Access
SuperAdmin	All privileges; user management, global settings
Admin	Manage settings, approve/reject POs, manage users
PO Manager	Approve/reject POs, demand allocation, communication
Store Manager	Create/edit/submit PO drafts, track status
Viewer	(Future use) Read-only access












Henna by Chippy
Premium organic henna e-commerce & portfolio platform Karuvarakundu, Malappuram, Kerala

What This Is
The official digital platform for Henna by Chippy — a handmade organic henna brand from Malappuram, Kerala. Built for a friend's entrepreneurship journey.

Two purposes:

Shop — Sell nail cones (₹35) and skin cones (₹45) via WhatsApp checkout
Portfolio — Showcase bridal henna artistry and attract local bookings
Tech Stack
Layer	Technology
Framework	Next.js 15 (App Router)
CMS	Sanity.io
AI	Google Gemini 2.5 Flash + Pinecone RAG
Styling	Tailwind CSS v4
Animations	Framer Motion + custom CSS
Deployment	Vercel
Key Features
AI Stain Consultant — Gemini-powered chat widget that knows everything about henna storage, application, and logistics (supports English + Malayalam + Manglish)
WhatsApp Checkout — No payment gateway; orders sent directly to Chippy via WhatsApp
Storage Warning System — Terracotta banner on all product pages reminding customers to freeze immediately
Freshness Checker — Pincode-based delivery risk assessment (3-day rule)
Bridal Gallery — Managed via Sanity Studio
Chippy's Stories — Personal blog where the artist shares her journey
Stain Showcase — Photos of results uploaded by Chippy, shown below the hero
Customer Reviews — Post-purchase review system with photo upload, moderated by Chippy
Instagram Feed — Embedded section showing latest posts
Project Structure
See docs/PLAN.md for the full directory structure and development roadmap.

Documentation
File	Purpose
CLAUDE.md	AI coding instructions (read by Claude Code)
docs/PRD.md	Full product requirements document
docs/PLAN.md	Phase-by-phase development roadmap
docs/content.md	All real website copy
docs/ai-instructions.md	Gemini system prompt and AI personality
docs/knowledge-base.json	Pinecone RAG knowledge base data
.env.example	Required environment variables
Brand
"Modern Kasavu" — clean ivory base with deep organic tones, inspired by Kerala's traditional Kasavu saree.

Token	Hex
Background	#FFFDF5
Text	#5D2906
Buttons	#2D4B22
Warnings	#D4A373
License
This is proprietary software. See LICENSE for terms. All rights reserved © 2026 Henna by Chippy.

Built with ❤️ for Chippy







Specly
Clarity before you buy.

Note

Specly is a lightweight gadget comparison tool built to help people make better decisions without noise, pressure, or tracking.

Data Accuracy Disclaimer
Specifications and prices are fetched daily from trusted external sources and analyzed using deterministic logic. However, Specly does not guarantee 100% accuracy of all data points. Final purchasing decisions should always be verified on the retailer's official website.

This project is intentionally simple, privacy-respecting, and opinionated about what not to do.

Why Specly exists
Buying gadgets online has become exhausting.

Specifications are scattered
Reviews are biased or sponsored
Comparison sites optimize for clicks, not clarity
Specly was built to solve a narrow problem: Help users compare gadgets based on facts, understand trade-offs, and decide faster — without manipulation.

Core Principles
No accounts, no profiles: No sign-ups. Search, compare, leave.
Privacy by default: No personal data, no session recording, no fingerprinting.
Facts over opinions: Deterministic comparison of structured specs.
Explainable logic: Transparent scoring; AI only for explanation, not decision-making.
No dark patterns: No urgency tactics, no sponsored rankings, no infinite scroll.
Sustainable, not optimized for profit: Affiliate supported, but neutral.
Tech Stack
Frontend: Next.js 15 (App Router), React 19, Tailwind CSS
Database: PostgreSQL (Neon Serverless)
Cache: Redis (Upstash)
ORM: Drizzle ORM
AI: Gemini Flash (Phase 2 - for explanations only)
Deployment: Vercel
Getting Started
Prerequisites
Node.js 20+
Neon PostgreSQL database
Upstash Redis instance
Installation
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with DATABASE_URL, UPSTASH_REDIS_*, etc.

# Push database schema
npm run db:push

# Seed initial data
npx tsx --env-file=.env seed.ts

# Run development server
npm run dev
Project Status
Specly is a personal, independent project. Built incrementally with no fixed roadmap. Features are added only if they reduce confusion and improve decision clarity.

License
MIT

Specly exists because the internet needs more tools that respect users’ time and intelligence.














README
💫 Sanu Weds Bijeesh - Project Eternal Scroll
A cinematic wedding tribute for Sanu & Bijeesh — An immersive, 3D celestial journey that transcends traditional wedding websites.

🌟 About This Project
This is a beautifully crafted digital wedding invitation created with love and turned into a stunning web experience. What started as a fun project for a friend's wedding has evolved into an immersive, interactive website celebrating the union of two families.

The Story
Sanu and Bijeesh are coming together through an arranged marriage on April 8th, 2026, following their engagement in April 2025. This website transforms their journey into an interactive cinematic experience that guests can explore before the big day.

✨ Key Features
🌌 The Star Tunnel
A dynamic 3D starfield that responds to user scroll, creating a "Warp Speed" effect. The background seamlessly transitions as you journey through the experience.

🎬 Horizontal Storytelling
A 500vw-wide horizontal timeline ("Film Strip") using GSAP ScrollTrigger that presents the couple's story as a cinematic journey with glassmorphism memory cards and parallax effects.

🎆 Interactive Nebula
The climax of the experience features a swirling 3D nebula that explodes into gold heart particles when you interact with it—a truly magical moment.

🎙️ Audio & Entry Gate
A full-screen interactive entry point with cinematic soundtrack integration. Users must interact to unlock the experience and begin their journey.

💝 Send Blessings
A concluding tribute section where guests can send their wishes with a personal message and interactive "Send Blessings" button featuring confetti animation and WhatsApp integration.

🛠️ Tech Stack
Layer	Technology	Why?
Framework	Next.js 15 (App Router)	Best-in-class performance, SEO, and image optimization
3D Engine	React Three Fiber (R3F) + Drei	Modern, declarative way to handle Three.js in React
3D Helpers	@react-three/drei	Essential shortcuts for 3D text, environments, and loaders
Animation	GSAP + ScrollTrigger	Syncs the 3D world with user scroll perfectly
Post-Processing	@react-three/postprocessing	Cinematic Bloom, Depth of Field, and Vignette effects
Styling	Tailwind CSS	Rapid UI development for elegant overlays
Audio	Howler.js	Reliable audio management for cinematic soundtrack
Interaction	Framer Motion + Canvas-Confetti	Smooth UI transitions and celebratory particles
Database	Neon (Serverless Postgres)	For storing guest wishes and interactions
🚀 Getting Started
Prerequisites
Node.js 18+ (preferably 20 LTS)
npm, yarn, pnpm, or bun as your package manager







Metly 🪙
Metly is a premium Flutter application designed to track Gold and Silver prices in real-time, providing intelligent "Buy" or "Wait" signals and AI-driven market insights.

✨ Features
Real-time Price Tracking: Monitor live Gold and Silver prices (currently mocked).
Smart Signals: Get actionable "Buy" or "Wait" recommendations based on price trends and festive windows.
AI Insights: Ask the AI for detailed explanations of market movements and signal rationale.
Premium UI: A sleek, dark-themed interface with gold and silver accents.
Customizable: Toggle between different AI modes (Metly Cloud, User API Key) and configure preferences.
🛠 Tech Stack
Framework: Flutter (Dart)
State Management: setState (Migration to Provider/Riverpod planned)
Networking: dio
Local Storage: shared_preferences
AI Integration: OpenRouter API
Backend: Firebase (Configured), Cloudflare Workers (Proxy)
🚀 Getting Started
Prerequisites
Flutter SDK (>=3.4.0 <4.0.0)
Dart SDK
Android Studio / VS Code with Flutter extensions
Installation
Clone the repository:

git clone https://github.com/frpboy/metly.git
cd metly
Install dependencies:

flutter pub get
Run the app:

flutter run
🗺 Roadmap
 Architecture Refactor: Split main.dart into a scalable folder structure.
 Real Data: Integrate with live Metal Price APIs.
 Firebase: Initialize Firebase Auth and Firestore.
 Notifications: Push notifications for price alerts.
 Paywall: Implement premium subscription features.
🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.






README
City Cranes Website
Professional crane services based in Perinthalmanna, Kerala.

Project Overview
This is a modern, responsive website for City Cranes, built with Next.js. The focus is on industrial aesthetics, fast performance, and direct communication channels.

Tech Stack
Framework: Next.js (App Router)
Styling: Tailwind CSS
Language: TypeScript
Deployment: Vercel
Core Features
Responsive & Fast: Optimized with Next.js for near-instant loading on mobile and desktop.
Conversion Focused: Sticky WhatsApp and Call buttons for high lead generation.
Local SEO & GEO: Optimized for AI-powered engines and local search in Perinthalmanna, Malappuram, and Kerala.
Trust Signals: Built with credibility features like FAQ sections, real work galleries, and experience metrics.
Business-First Mindset: Every element is designed to turn visitors into calls and leads.
Website Structure
Home: Conversion hub with hero CTA, services, trust signals, and FAQ.
About: Local presence and commitment details.
Services: Detailed crane specs and lifting solutions.
Projects: Gallery showcasing real work and site environments.
Contact: Map, location clarity, and direct contact channels.
Legal: Privacy Policy and Terms for professional legitimacy.
Design Guidelines
Colors: Black, Dark Grey, Yellow (Industrial palette).
Typography: Clean sans-serif fonts.
Style: Minimalist, professional, and industrial.
Getting Started
To run the project locally:

Clone the repository.
Install dependencies: npm install.
Start the development server: npm run dev.
Open http://localhost:3000 in your browser.




AutoReadMe
Transform messy repositories into maintainable documentation, automatically.

AutoReadMe is a lightweight CLI tool that generates professional-grade README files from project analysis. Zero configuration. Intelligent defaults. Built for teams and CI/CD pipelines.

build passing license MIT

Problem Statement
README files are often an afterthought:

Outdated as projects evolve
Inconsistently structured across teams
Time-consuming to maintain manually
Frequently missing critical sections (setup, architecture, troubleshooting)
AutoReadMe solves this by analyzing your codebase and generating documentation that reflects reality.

How It Works
Scans your project structure, dependencies, and scripts
Detects project type (Node.js, Python, or generic)
Generates a structured, polished README with zero manual effort
Integrates seamlessly into CI/CD pipelines
Key Features
Zero Configuration: Works immediately with sensible defaults
Smart Detection: Identifies Node.js, Python, or generic projects automatically
Git Integration: Pulls repository URL and metadata from .git/config
Customizable Templates: Handlebars-based templates for full flexibility
CI/CD Ready: Includes GitHub Action for automatic README updates on every push
Script Discovery: Auto-lists available npm/Python scripts for quick reference
Comprehensive Error Handling: Helpful messages when something goes wrong
Installation
Global (recommended)
npm install -g autoreadme
Local Development
git clone https://github.com/frpboy/autoreadme.git
cd autoreadme
npm install
npm run build
Usage
Quick Start
autoreadme generate
This creates/overwrites README.md in the current directory.

With Options
# Specify template type
autoreadme generate --template node

# Custom output path
autoreadme generate --out docs/README.md

# Display help
autoreadme generate --help
Project Type Detection
AutoReadMe intelligently detects your project:

Detection	Template	File Markers
Node.js	node.hbs	package.json present
Python	python.hbs	requirements.txt present
Generic	default.hbs	No recognized markers
Architecture
Core Components
src/
├── index.ts        # CLI entry point and command routing
├── scanner.ts      # Project type detection and metadata extraction
├── generator.ts    # README generation logic
└── templates/      # Handlebars templates
    ├── node.hbs
    ├── python.hbs
    └── default.hbs
Template System
Templates use Handlebars syntax and have access to:

{
  projectName: string              // Inferred from package.json or directory
  description?: string             // From package.json or manual input
  license?: string                 // License type
  type: 'node' | 'python' | 'default'
  usageExample?: string            // CLI command examples
  dependencies?: string[]          // Package dependencies
  author?: string                  // Author information
  repository?: string              // Git repository URL
  scripts?: string[]               // Available npm/Python scripts
  badges: {                        // Pre-formatted status badges
    build: string
    license: string
  }
}
Creating Custom Templates
Create a new .hbs file in src/templates/
Use {{variable}} for text, {{{variable}}} for HTML/code
Test with example projects in test/
Example:

# {{projectName}}

{{description}}

## Installation
\`\`\`bash
{{{usageExample}}}
\`\`\`
GitHub Actions Integration
Automatically regenerate your README on every push:

Copy .github/workflows/autoreadme.yml to your repository
Commit and push the workflow file
GitHub Actions will run automatically on main branch pushes
The workflow:

Installs dependencies
Builds the project
Generates a fresh README
Commits changes if any (automatic version bump friendly)
Development
Build
npm run build
Compiles TypeScript to dist/ using tsup.

Test Locally
npm run test:local
cd test/example-node
node ../../dist/index.js generate
Available Scripts
npm run dev - Run in watch mode with ts-node
npm run build - Build using tsup
npm run start - Run the compiled CLI
npm run test:local - Test against example projects
npm run test - Build and generate test README
FAQ
Can I customize the generated README? Yes. Either modify templates in src/templates/ or use custom templates with the --template flag.

Does it overwrite my existing README? Yes, by default. Use --out to save to a different file.

How do I add support for a new language/framework? Create a new .hbs template and add detection logic in scanner.ts. See CONTRIBUTING.md for details.

Can I use this in CI/CD without GitHub Actions? Absolutely. The CLI works in any environment—just run autoreadme generate in your pipeline.

Design Principles
Speed over perfection: Generate useful docs in seconds, refine manually if needed
Zero friction: No config files, no setup wizards
Extensibility: Easy to add new templates and detection methods
Maintainability: Clear separation of concerns (scanning, generation, templates)
Roadmap
 Support for Rust, Go, Java, and other languages
 AI-powered content enhancement (optional)
 Interactive customization mode
 Badge configuration (build status, coverage, etc.)
 Plugin system for extensibility
 Multi-language README generation
Contributing
We welcome contributions! Please see CONTRIBUTING.md for guidelines.

Quick start:

Fork the repository
Create a feature branch
Make your changes
Test thoroughly
Submit a pull request
License
MIT License - See LICENSE for details.

Support & Feedback
Bug reports: Open an issue
Feature requests: Discussions
Security concerns: Please email directly (see LICENSE for contact)
Check existing issues before creating new ones to avoid duplicates.

Built With
Commander.js - Powerful CLI framework
Handlebars - Logic-less templates
fs-extra - File system utilities
TypeScript - Type-safe JavaScript








🧩 Purchase Order System (Google Apps Script)
Automates the daily Purchase Order (PO) workflow across Stock List, PO Output, Master Log, and MOQ Tracker Google Sheets.

✨ Features
Daily PO generation + history logging to Master
Strict date formats (dd/MM/yy + run timestamp)
Carries Stock in Strip as values (no formulas)
Pending subtraction via Master (one-pass index → fast)
Active MOQ rows merged; Dispatched rows appended to Master
Remarks policy + auto reset on “Item Dispatched”
Status dropdown (M) + six color rules on all tabs
Protection model: only K/L/M editable for non-admins
🗂 File Layout
Code.gs — core Apps Script
appsscript.json — manifest (scopes, timezone)
⚙️ Configuration (per outlet)
Set Script Properties in Apps Script → Project Settings:

STOCK_LIST_SPREADSHEET_ID
PO_OUTPUT_SPREADSHEET_ID
PO_MASTER_SPREADSHEET_ID
MOQ_TRACKER_SPREADSHEET_ID
ADMIN_EMAILS (comma-separated)
No sensitive IDs/emails are committed to Git. This template can be reused across outlets without code edits.

🚀 First Run
Paste Code.gs + appsscript.json into a new Apps Script project.
Set Script Properties (IDs + ADMIN_EMAILS).
Run _pingSheets() once → authorize.
Run generateDailyPO() → initial build.
Run setupInstallableTriggers() → enable onEdit automation.
🧑‍💼 Admin Notes
Color/status rules are re-applied on each run to keep consistency.
Protections allow only columns K/L/M to be edited by staff; admins have full edit.
Optional alerts: set ALERT_EMAILS or ALERT_WEBHOOK_URL in Code.gs.
📄 License
© 2025 Sahakar Medicals & Surgicals LLP. Internal use only.











SmartLabs
A comprehensive healthcare laboratory management system featuring a modern web interface and PDF report generation capabilities. SmartLabs streamlines lab operations, report management, and patient data handling with a full-stack architecture.

🎯 Project Overview
SmartLabs is an integrated healthcare solution designed to:

Manage laboratory operations and workflows
Generate professional PDF reports for lab results
Provide a modern, intuitive web interface for healthcare professionals
Securely handle sensitive patient health data
Integrate with Supabase for reliable data persistence
✨ Key Features
Healthcare Management
Lab Report Management - Create, store, and retrieve comprehensive lab reports
Patient Data Handling - Secure management of patient information
Report Generation - Automated PDF generation for lab results with professional formatting
Billing Integration - Track and manage lab billing and invoices
Technical Features
Responsive UI - Mobile-friendly React application with Vite for optimal performance
Microservices Architecture - Separated frontend and PDF generation services
Real-time Database - Supabase integration for scalable data management
Secure APIs - Express-based backend with proper authentication
📁 Project Structure
SmartLabs/
├── healthos-web/                    # React frontend application
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── .env                        # Environment configuration
│
├── healthos-pdf/                    # Express PDF microservice
│   ├── src/
│   ├── routes/
│   ├── package.json
│   ├── server.js
│   └── .env                        # Environment configuration
│
├── labsoft.sql                      # Database schema and initialization
├── easyLAB_DESKTOP_FUNCTIONAL_SOURCE.txt  # Legacy desktop application source
├── plan.md                          # Project planning and roadmap
└── README.md                        # This file
🚀 Quick Start
Prerequisites
Node.js 18 or higher
npm or pnpm package manager
Git for version control
Installation & Setup
1. Clone the Repository
git clone https://github.com/frpboy/SmartLabs.git
cd SmartLabs
2. Setup healthos-pdf (PDF Generation Service)
cd healthos-pdf
npm install
npm start
The PDF service will run on http://localhost:3001

3. Setup healthos-web (React Frontend)
In a new terminal:

cd healthos-web
npm install
npm run dev
The web application will run on http://localhost:5173

⚙️ Configuration
Environment Variables
healthos-web/.env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
VITE_PDF_API_URL=http://localhost:3001

# Optional: Add other environment-specific variables
VITE_API_TIMEOUT=30000
healthos-pdf/.env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Server Configuration
PORT=3001
NODE_ENV=development

# Optional: Add other configuration
LOG_LEVEL=info
Getting Supabase Credentials
Sign up at supabase.com
Create a new project
Navigate to Project Settings > API
Copy your Project URL and API keys
Use anon key for frontend, service_role key for backend
🔌 API Reference
healthos-pdf Service
Health Check
GET http://localhost:3001/
Response: Service status confirmation

Generate Lab Report PDF
GET http://localhost:3001/reports/lab/:billId
Parameters:

billId (string, required) - Unique identifier for the lab bill
Response: PDF file with lab report

Example:

curl http://localhost:3001/reports/lab/BILL-2026-001 \
  --output report.pdf
💻 Development
Technology Stack
Frontend:

React 18+ with TypeScript
Vite for fast development and building
Supabase JavaScript client
Modern CSS/Tailwind (if configured)
Responsive design patterns
Backend:

Node.js with Express.js
PDF generation libraries (pdfkit/similar)
Supabase Node.js client
RESTful API architecture
Database:

Supabase PostgreSQL
Real-time capabilities
Row-level security (RLS)
Available Scripts
healthos-web:

npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linting (if configured)
npm run type-check   # TypeScript checking
healthos-pdf:

npm start            # Start PDF service
npm run dev          # Development with hot reload
npm test             # Run tests (if configured)
🌐 Deployment
Deployment Architecture
┌─────────────────┐
│  Vercel/Netlify │ ← healthos-web (React Frontend)
└─────────────────┘
        ↓ API Calls
┌─────────────────┐
│  Railway/Render │ ← healthos-pdf (Express Backend)
└─────────────────┘
        ↓ Database Queries
┌─────────────────┐
│    Supabase     │ ← PostgreSQL Database
└─────────────────┘
Frontend Deployment (Vercel/Netlify)
Connect Repository

Sign in to Vercel or Netlify
Import the SmartLabs repository
Configure Environment

Set environment variables in deployment dashboard
Update VITE_PDF_API_URL to production backend URL
Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
Deploy

Push to main branch to trigger automatic deployment
Vercel/Netlify will build and deploy automatically
Backend Deployment (Railway/Render/Fly.io)
Using Railway:

Sign in to Railway.app
Create new project → Deploy from GitHub
Select healthos-pdf directory
Set environment variables
Deploy
Using Render:

Sign in to Render.com
Create new Web Service
Connect GitHub repository
Set build and start commands
Configure environment variables
Deploy
Using Fly.io:

Install Flyctl
Run fly launch in healthos-pdf directory
Configure fly.toml
Deploy with fly deploy
Production Checklist
 Update API URLs in frontend environment
 Set up SSL/HTTPS certificates
 Configure CORS policies
 Enable database backups
 Set up monitoring and logging
 Configure rate limiting
 Test PDF generation at scale
 Set up error tracking (Sentry, etc.)
 Configure analytics
 Test authentication flows
🔒 Security Best Practices
Never commit .env files - Use .env.example as template
Use service roles carefully - Keep service keys on backend only
Implement Row-Level Security (RLS) in Supabase
Validate all inputs on backend
Use HTTPS/TLS for all communications
Rotate API keys periodically
Monitor for suspicious activity
Keep dependencies updated - Run npm audit regularly
📊 Database
Initial Setup
Run the provided SQL schema to initialize the database:

# In Supabase dashboard, go to SQL Editor
# Copy content from labsoft.sql and execute
Schema Overview
Patient information tables
Lab results and test data
Billing and invoice records
Report generation history
User authentication and roles
🤝 Contributing
We welcome contributions to SmartLabs! Here's how to contribute:

Steps to Contribute
Fork the repository
Create feature branch
git checkout -b feature/your-feature-name
Make changes with clear, descriptive commits
Push to branch
git push origin feature/your-feature-name
Open Pull Request with detailed description
Contribution Guidelines
Follow existing code style and patterns
Add comments for complex logic
Test changes thoroughly before submitting
Update documentation as needed
Keep commits atomic and well-described
Reference any related issues in PR description
Code Standards
Use TypeScript for type safety
Follow ESLint configuration (if present)
Write meaningful variable and function names
Keep functions focused and modular
Add error handling for all async operations
📝 Documentation
plan.md - Detailed project planning and roadmap
labsoft.sql - Database schema documentation
API endpoints documented in this README
🐛 Troubleshooting
Common Issues
Port already in use:

# Change port in .env file or kill process using port
# For macOS/Linux:
lsof -ti:3001 | xargs kill -9
lsof -ti:5173 | xargs kill -9
Supabase connection failed:

Verify credentials in .env files
Check internet connection
Ensure IP is allowed in Supabase project settings
PDF generation fails:

Check PDF service is running on port 3001
Verify billId format is correct
Check server logs for specific errors
CORS errors:

Verify VITE_PDF_API_URL matches backend URL
Check CORS configuration in Express server
Ensure headers are properly set
📋 Resources
React Documentation
Vite Guide
Express.js Docs
Supabase Documentation
Node.js Best Practices
📄 License
This project is licensed under the MIT License - see LICENSE file for details.

📞 Support & Contact
For questions, issues, or suggestions:

Open an GitHub Issue
Create a Discussion thread
Contact the development team
🎉 Acknowledgments
Healthcare industry partners for requirements
Open source community for excellent libraries
All contributors to this project
Last Updated: 2026-03-31 07:49:54
Version: 1.0.0
Status: Active Development

About
No description, website, or topics provided.
Resources
 Readme
 Activity
Stars
 0 stars
Watchers
 0 watching
Forks
 0 forks
Releases
No releases published
Create a new release
Packages
No packages published
Publish your first package
Contributors
1
@frpboy
frpboy Rahul
Languages
TypeScript
93.6%
 
JavaScript
5.9%
 
Other
0.5%
Suggested workflows
Based on your tech stack
Datadog Synthetics logo
Datadog Synthetics
Run Datadog Synthetic tests within your GitHub Actions workflow
Webpack logo
Webpack
Build a NodeJS project with npm and webpack.
SLSA Generic generator logo
SLSA Generic generator
Generate SLSA3 provenance for your existing release workflows
More workflows
Footer




# Order Management

## Comprehensive Documentation

### Features
- Easy order placement and tracking
- User-friendly interface for managing orders
- Real-time notifications for order status updates
- Comprehensive reporting tools
- Support for multiple payment methods

### Architecture
The application is built on a microservices architecture, using Node.js for the backend and React for the frontend. The services communicate through REST APIs, ensuring scalability and maintainability.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/shabinzabnix/ordermanagement.git
   ```
2. Navigate to the project directory:
   ```bash
   cd ordermanagement
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables in a `.env` file.
5. Start the application:
   ```bash
   npm start
   ```

### API Documentation
- **GET /api/orders**: Retrieve a list of orders.
- **POST /api/orders**: Create a new order.
- **GET /api/orders/:id**: Retrieve a specific order by ID.
- **PUT /api/orders/:id**: Update an order.
- **DELETE /api/orders/:id**: Delete an order.

### Deployment
- Use Docker for containerization.
- Run the following command to build the Docker image:
   ```bash
   docker build -t ordermanagement .
   ```
- Use Docker Compose for multi-container deployment.

### Testing
- Run tests using Jest:
   ```bash
   npm test
   ```
- Ensure all tests pass before deployment.

### Troubleshooting
- If the application fails to start, check for missing environment variables.
- For database connection issues, verify your database configuration and credentials.

### Security
- Always validate and sanitize user inputs to prevent SQL injection and XSS attacks.
- Use HTTPS to secure API endpoints.
- Implement logging and monitoring to detect unusual activities.





Daily Food Log
A modern, feature-rich food logging application built with React, TypeScript, and Vite. Track your daily meals, monitor nutrition, and maintain a detailed food diary with an intuitive user interface.

🎯 Project Overview
Daily Food Log is a web-based application designed to help users log and track their daily food intake. Originally designed in Figma, this project brings the design to life with a fully functional React application using modern web technologies and UI components.

Original Design: View on Figma

✨ Features
Daily Food Logging - Add and track meals throughout the day
Responsive Design - Works seamlessly on desktop and mobile devices
Modern UI Components - Built with Radix UI and Material-UI components
Form Handling - Robust form management with React Hook Form
Data Visualization - Charts and graphs powered by Recharts
Date Management - Easy date selection with date-fns
Theme Support - Light/dark mode support with next-themes
Toast Notifications - User feedback with Sonner
Drag & Drop - Drag and drop functionality with React DnD
Carousel Support - Image carousel with Embla Carousel
🛠️ Tech Stack
Core Framework
React 18.3.1 - UI library
TypeScript - Type-safe JavaScript
Vite 6.3.5 - Build tool and development server
UI Libraries
Material-UI 7.3.5 - Component library
Radix UI - Headless UI components
Lucide React - Icon library
Tailwind CSS 4.1.12 - Utility-first CSS framework
Styling
Emotion - CSS-in-JS styling
PostCSS - CSS processing
class-variance-authority - Component variant management
Tailwind Merge - Tailwind class merging utility
State & Forms
React Hook Form 7.55.0 - Efficient form management
React DnD 16.0.1 - Drag and drop functionality
Utilities
date-fns 3.6.0 - Date manipulation
Motion 12.23.24 - Animation library
Recharts 2.15.2 - Data visualization
Sonner 2.0.3 - Toast notifications
React Popper 2.3.0 - Positioning engine
React Resizable Panels 2.1.7 - Resizable UI panels
📁 Project Structure
Dailyfoodlog/
├── src/
│   ├── app/              # Application components
│   ├── styles/           # Global stylesheets
│   └── main.tsx          # React entry point
├── index.html            # HTML template
├── package.json          # Project dependencies
├── vite.config.ts        # Vite configuration
├── postcss.config.mjs    # PostCSS configuration
├── ATTRIBUTIONS.md       # Third-party attributions
└── README.md             # This file
🚀 Getting Started
Prerequisites
Node.js (v16 or higher recommended)
npm or pnpm package manager
Installation
Clone the repository:
git clone https://github.com/frpboy/Dailyfoodlog.git
cd Dailyfoodlog
Install dependencies:
npm install
# or
pnpm install
Development
Start the development server:

npm run dev
# or
pnpm dev
The application will be available at http://localhost:5173 (or the next available port).

Building for Production
Create an optimized production build:

npm run build
# or
pnpm build
The built files will be in the dist/ directory and ready for deployment.

📦 Available Scripts
npm run dev - Start the development server with hot module replacement
npm run build - Build the application for production
npm run preview - Preview the production build locally
🎨 Design System
The project uses a comprehensive component library combining:

Radix UI for unstyled, accessible components
Material-UI for rich, pre-styled components
Tailwind CSS for utility-first styling
Custom themes for consistent branding
📝 Dependencies Overview
Major Dependencies
React & React DOM 18.3.1 - Core React library
Vite 6.3.5 - Next generation frontend tooling
Tailwind CSS 4.1.12 - Utility-first CSS framework
Radix UI - Collection of low-level UI components
Material-UI - Comprehensive component library
Development Dependencies
Vite 6.3.5 - Development server and build tool
@vitejs/plugin-react 4.7.0 - React plugin for Vite
Tailwind CSS 4.1.12 - CSS framework
@tailwindcss/vite 4.1.12 - Vite integration for Tailwind
🔗 Links
Original Design: Figma Project
Repository: GitHub
📄 Attribution
See ATTRIBUTIONS.md for acknowledgments of third-party libraries and resources used in this project.

📧 Contact & Support
For issues, suggestions, or contributions, please visit the GitHub repository.

Version: 0.0.1
Last Updated: 2026-03-31 07:53:41

About
No description, website, or topics provided.
Resources
 Readme
 Activity
Stars
 0 stars
Watchers
 0 watching
Forks
 0 forks
Releases
No releases published
Create a new release
Packages
No packages published
Publish your first package
Contributors
1
@frpboy
frpboy Rahul
Languages
TypeScript
97.0%
 
CSS
2.6%
 
Other
0.4%
Suggested workflows
Based on your tech stack
Datadog Synthetics logo
Datadog Synthetics
Run Datadog Synthetic tests within your GitHub Actions workflow
Webpack logo
Webpack
Build a NodeJS project with npm and webpack.
SLSA Generic generator logo
SLSA Generic generator
Generate SLSA3 provenance for your existing release workflows
More workflows
Footer





