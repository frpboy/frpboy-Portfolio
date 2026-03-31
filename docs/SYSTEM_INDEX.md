# SYSTEM_INDEX: Portfolio Modules & Technical Specs

This document serves as the canonical index for all modules integrated into the Rahul OS dashboard. It consolidates high-level project metadata and technical architectural highlights.

---

## 01. Enterprise Core (Work)

### **Zerpai ERP** (`zerpai-erp`)
- **Role**: Systems Architect & Lead Developer
- **Tech**: Flutter (Web/Android), NestJS (Backend), Supabase (PostgreSQL)
- **Architecture**: Monorepo with multi-tenant isolation (`org_id` + `outlet_id`).
- **Highlight**: Modular ERP with real-time inventory, accounting stock, and physical stock decoupling.

### **Sahakar Accounts** (`sahakar-accounts`)
- **Role**: Lead Developer
- **Tech**: Next.js 16 (App Router), Supabase (Auth/RLS), Zod, React Query
- **Architecture**: Dual runtime (Next.js production + Vite SPA local).
- **Highlight**: RBAC enforcement via proxy with strict timezone handling and idempotency for financial logs.

### **Sahakar PO System** (`sahakar-po-system`)
- **Role**: Systems Engineer
- **Tech**: Next.js, Postgres, Prisma
- **Highlight**: Purchase Order orchestration for HyperPharmacy & SmartClinic networks.

### **MediReport** (`medireport`)
- **Role**: Full Stack Developer
- **Tech**: Next.js 14, Neon (PostgreSQL), Prisma, Cloudflare R2, pdf-lib
- **Highlight**: Tamper-evident diagnostic reporting with SHA-256 document hashing and visual watermarking.

### **BRIC – Wealth Management** (`bric-wealth`)
- **Role**: Developer (Zabnix)
- **Tech**: Flutter, Firebase (Auth/Firestore)
- **Highlight**: Corporate-grade wealth distribution with administrative hierarchy-based commission logic.

---

## 02. Independent Products

### **Reddit Sniper** (`reddit-sniper`)
- **Role**: Founder & Sole Developer
- **Tech**: Next.js 15, Node.js Worker (Fly.io), Upstash Redis, Resend
- **Architecture**: Decoupled poller service using RSS feeds (60s intervals) to bypass expensive API costs.
- **Highlight**: Real-time signal detection with deduplication layer for high-volume monitoring.

### **Nah That's Fake** (`nah-thats-fake`)
- **Role**: Creator
- **Tech**: Grammy (Telegram Bot), Vanilla JS (TMA), Sightengine (AI), Razorpay
- **Highlight**: AI-powered deepfake and scam detection integrated directly into Telegram.

### **Specly** (`specly`)
- **Role**: Developer
- **Tech**: Next.js, Framer Motion, Tailwind
- **Highlight**: High-fidelity landing page for luxury performance hardware.

---

## 03. Client Systems & Personal Builds

### **City Cranes** (`city-cranes`)
- **Role**: Consultant Developer
- **Tech**: Next.js, SEO Optimized, Performance tuned.

### **Henna by Chippy** (`henna-by-chippy`)
- **Role**: Creative Developer
- **Tech**: Visual-centric portfolio for makeup and henna artists.

### **Sanu Weds Bijeesh** (`wedding-site`)
- **Role**: Personal Developer
- **Highlight**: Real-time RSVP system and gallery for a family wedding event.

---

## 04. Tools & Utils

### **Metly** (`metly`)
- **Role**: Developer
- **Tech**: Micro-analytics tool for link tracking.

### **AutoReadMe** (`autoreadme`)
- **Role**: Developer
- **Tech**: Documentation automation for GitHub repositories.

---

## Implementation Rules
- **Canonical Source**: `data/projects.ts`
- **Narrative Source**: `docs/my story.md`
- **UI Standard**: Minimalist terminal-inspired "Systems Aesthetic" (Rahul OS).
