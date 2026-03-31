# Rahul Muraleedharan | Portfolio OS
> Full Stack Developer & Automation Specialist

![Portfolio Banner](./public/window.svg) <!-- A stylized representation of the OS window concept -->

Welcome to the source code of my **Portfolio OS**. This is a highly interactive, cinematic web experience designed to showcase my journey from hardware diagnostics (Smartphone micro-electronics) to Systems Architecture (Cloud ERPs, Web/Android Apps, and Automation workflows).

Instead of a standard resume, this portfolio serves as a functional "terminal/OS interface" that narrates my professional timeline, starting from my origins in Thiruvalla to my current role as an Automation Specialist at Zabnix Private Limited.

## 🚀 The Architecture

This project was built with a complete focus on performance, narrative storytelling, and robust animations.

### Tech Stack
*   **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Scroll Engine**: [Lenis](https://lenis.darkroom.engineering/) (Custom optimized for cross-platform precision)
*   **Animations**: [GSAP](https://gsap.com/) (ScrollTrigger) & [Framer Motion](https://www.framer.com/motion/)
*   **Icons**: [Lucide React](https://lucide.dev/)

### Key Systems
*   **`ScrollEngine.tsx`**: A low-level wrapper around Lenis to handle responsive resizing, dynamic height synchronization with Next.js hydration, and customized touch/wheel multipliers for Windows users.
*   **Narrative Timeline**: Deeply integrated components (`OriginSection`, `SparkSection`, `TransitionShock`, `LogicSection`) that use GSAP scroll binding to visually pull the user through my biographical story (from tile working to full-stack engineering).
*   **Dashboard Module**: A scalable, Framer Motion-powered "OS Window" system that catalogs my professional projects, categorizing them via "Enterprise", "Tool", and "Independent" tags.

---

## 🛠️ Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   npm, pnpm, or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/frpboy/frpboy-Portfolio.git
    cd frpboy-Portfolio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open the interface:**
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```text
├── app/
│   ├── globals.css      # Core OS themes, Lenis variables, and cyber-glow effects
│   ├── layout.tsx       # Root layout wrapping the ScrollEngine and UI overlays
│   └── page.tsx         # Main sequential assembly of the timeline components
├── components/          
│   ├── os/              # OS-themed UI (Dashboard, Loaders, Status Bars, Project Windows)
│   └── timeline/        # GSAP storytelling components (Hero, Origin, Spark, Logic)
├── lib/
│   ├── animations/      # The critical ScrollEngine wrapper
│   └── data/            # Centralized project registry and CMS
└── public/              # Static assets
```

## 📖 The System Evolution (My Story)

My journey began in Thymaravumkara, a small village in Thiruvalla, Kerala. With modest resources but abundant curiosity, I became obsessed with computers by age 11. Over the years, I transitioned from being the "Computer Genie" at school to facing the grind of survival—working as an Apprentice Tile Worker, a SIM Promoter for Reliance Jio, and an Accountant at Achooz Lights and Hardwares. 

Realizing I belonged with systems rather than ledgers, I pivoted to hardware electronics. From 2019 to 2025, I mastered smartphone software and hardware diagnostics, working at Mobile Guru in Chhattisgarh, FixFone in Tirur, and eventually serving as a Faculty Member at SISCO Institute of Smartphone Technology.

The ultimate shift happened when I solved a repetitive task using a Python OCR tool. I realized building software systems helps thousands, unlike fixing a single phone. Today, as a Full Stack Developer & Automation Specialist at Zabnix Private Limited, I architect web apps, Android apps, and automation workflows using Next.js, Flutter, Python, and Google Apps Script.

## 💼 Notable Projects

*   **🎯 Reddit Sniper**: A production-grade SaaS for real-time Reddit monitoring via RSS polling and Redis deduplication. Built with Next.js 15, Supabase, Fly.io, and Resend.
*   **🏢 Sahakar Accounts**: An enterprise-grade, multi-tenant accounting platform for clinical networks. Features Next.js, Supabase, and a Vite SPA with strict Row Level Security and offline drafts.
*   **📦 ZERPAI ERP**: A comprehensive, multi-tenant ERP system supporting real-world business operations. Built with a Flutter (Web + Android) frontend and a NestJS/Supabase backend.
*   **🏥 MediReport**: A production diagnostic reporting platform. Generates secure, watermarked PDFs stored in Cloudflare R2, powered by Next.js, Prisma, and NeonDB.
*   **🔍 Nah That's Fake**: A deepfake and scam link detection system deployed as a Telegram Bot & Mini App. Integrates AI analysis, URL scanning, and Razorpay billing.
*   **🏛️ BRIC**: A corporate wealth management and administrative commission hierarchy platform built robustly with Flutter and Firebase.

## 📜 Professional Identity

I am an ambivert who talks to servers more than people. As an analytical thinker, I trust logs, evidence, and stack traces over "gut feelings." From a tile worker's apprentice to a Systems Engineer, my mission remains the same: **Replacing manual chaos with automated control.**

**Technical Arsenal:**
*   **Frontend**: Next.js (App Router), React, Flutter, Tailwind CSS
*   **Backend & Cloud**: Node.js, NestJS, Python, Supabase, Firebase, NeonDB
*   **Automation**: Google Apps Script, REST APIs, Webhooks
*   **Hardware**: Smartphone micro-electronics, eMMC/UFS Programming

**Connect with me:**
*   **LinkedIn**: [Rahul Muraleedharan](https://www.linkedin.com/in/rahul-muraleedharan-it/)
*   **GitHub**: [@frpboy](https://github.com/frpboy)
