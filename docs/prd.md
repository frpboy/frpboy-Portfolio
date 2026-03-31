# Product Requirements Document (PRD): Rahul OS Portfolio

## Project Title: Rahul OS — The Evolution of Logic
**Owner:** Rahul Muraleedharan (@frpboy)  
**Status:** Design & Specification Phase  
**Domain:** Systems Architect & Product Builder Portfolio  

---

## 1. Executive Summary
**Objective:** To build a high-impact personal portfolio that positions Rahul as a **Systems Architect & Product Builder**. The site moves beyond a static resume, telling a linear story of growth—from a curious child in a small village to a hardware technician, and finally to a Systems Engineer.

**Core Concept:** **"Rahul OS"** — The user inhabits a system interface. The UI evolves from a chaotic, low-level feel to a structured, high-level architected system as the user explores the levels of Rahul's professional life.

**Key Message:** "I don't just fix things; I build systems that prevent them from breaking."

---

## 2. Flagship Systems (The "War Room")
The portfolio will showcase production-grade systems built by Rahul, with deep-dives into their architecture:

1. **Reddit Sniper (SaaS):** 
   - *Problem:* Expensive enterprise APIs ($10k/mo) for market signals.
   - *Architecture:* RSS-based polling worker (Fly.io) + Next.js 15 + Upstash Redis (Deduplication).
   - *Impact:* Production SaaS with 67+ deployments and real users.

2. **Sahakar Accounts (Enterprise ERP):**
   - *Problem:* Manual spreadsheet workflows for pharmacy networks.
   - *Architecture:* Next.js 16 (App Router) + Supabase (RLS) + RBAC secure proxy.
   - *Impact:* Government-grade security audit passed; replacement for legacy manual systems.

3. **Zerpai ERP (Monorepo):**
   - *Problem:* Fragmented data across multi-outlet businesses.
   - *Architecture:* Flutter (Web/Android) + NestJS Backend + Multi-tenant Supabase.

4. **MediReport (Diagnostic Platform):**
   - *Problem:* Tamper-prone medical reports and insecure storage.
   - *Architecture:* Neon (Postgres) + Prisma + Cloudflare R2 (Private Storage) + PDF Watermarking logic.

5. **Nah That's Fake (AI/Safety):**
   - *Problem:* Deepfakes and phishing scams in Telegram.
   - *Architecture:* Telegram Bot (Grammy) + TMA (Mini App) + AI Analysis APIs.

---

## 3. Visual Identity: "The Entropy Scroll"
The website uses a **Scroll-Triggered Evolution** system (Entropy to Logic).

| Level | Phase | Visual Style | Tech Theme |
| :--- | :--- | :--- | :--- |
| **0-2** | **Origin** | CRT Scanlines, Glitch | Low-Level curiosity, raw hardware. |
| **3-5** | **Trial** | Monospace Terminal | B.Com misdirection, survival jobs, grit. |
| **6-8** | **Pivot** | Structured Grids | SISCO Hardware Repair, first Python automation. |
| **9-11** | **Architect** | Glassmorphism, Luxury Dark | Modular systems, Next.js, Cloud Architectures. |

---

## 4. Functional Requirements

### 4.1 The Boot Experience
- One-time "Rahul OS" initialization sequence.
- Live system status feed: `> Authenticating builder...` `> System healthy.`

### 4.2 System Module Dashboard
- Desktop-like module grid where each project is a **System Tile**.
- Modules expand into **System Windows** using Framer Motion's shared layout transitions.

### 4.3 Hardware DNA Section
A specific module dedicated to the "Hardware Soul":
- Smartphone repair logic, micro-soldering, and ROM flashing expertise.
- Bridging the gap between Silicon and JavaScript.

---

## 5. Technical Specifications
- **Framework:** Next.js 15 (App Router).
- **Animation:** GSAP (Timeline sync) + Framer Motion (Module UI).
- **Scrolling:** Lenis (Smooth scroll engine).
- **Backgrounds:** React Three Fiber (Subtle particle fields).
- **Deployment:** Vercel (frpboy.in).

---

## 6. Project Architecture
```bash
/app                # OS Layout & Dashboard
/components
  /os               # Windowing system & UI primitives
  /timeline         # Scroll-triggered narrative levels
/data               # projects.ts (Reddit Sniper, Sahakar, etc.)
/lib/animations     # hooks for GSAP/Framer Motion
```
