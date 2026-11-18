import type { Metadata } from "next";
import Link from "next/link";

const profileStructuredData = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": "https://frpboy.in/about#profile",
  url: "https://frpboy.in/about",
  name: "About Rahul Muraleedharan — K4NN4N / FrpBoy",
  mainEntity: {
    "@type": "Person",
    "@id": "https://frpboy.in/#person",
    name: "Rahul Muraleedharan",
    alternateName: ["K4NN4N", "FrpBoy"],
    jobTitle: "Full Stack Developer & Automation Specialist",
    description:
      "A technology professional from Kerala, India, who moved from smartphone hardware diagnostics and teaching into software engineering, platform engineering, and business process automation.",
    url: "https://frpboy.in/",
    sameAs: [
      "https://github.com/frpboy",
      "https://www.linkedin.com/in/rahul-muraleedharan-it/",
      "https://x.com/frpboy",
      "https://www.youtube.com/@frpboyapps",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Zabnix Private Limited",
      url: "https://zabnix.com",
    },
    knowsAbout: [
      "Full-stack development",
      "Android development",
      "Flutter",
      "C# and .NET",
      "Python",
      "Google Apps Script",
      "TypeScript",
      "Workflow automation",
      "APIs and databases",
    ],
  },
};

export const metadata: Metadata = {
  title: "About Rahul Muraleedharan — K4NN4N / FrpBoy",
  description:
    "About Rahul Muraleedharan (K4NN4N / FrpBoy): from smartphone hardware diagnostics and teaching to full-stack development, platform engineering, and workflow automation, from Kerala, India.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    url: "https://frpboy.in/about",
    title: "About Rahul Muraleedharan — K4NN4N / FrpBoy",
    description:
      "Professional journey, current role, development focus, and the independent projects Rahul Muraleedharan builds as FrpBoy.",
  },
};

const journey = [
  {
    role: "Platform Catalyst",
    org: "Zabnix Private Limited",
    period: "Current position",
    detail:
      "Software development, platform engineering, and business process automation across the company's operations, from application interfaces to backend services and operational workflows.",
  },
  {
    role: "Faculty Member",
    org: "SISCO Institute of Smartphone Technology",
    period: "Dec 2021 – Aug 2025",
    detail:
      "Taught practical smartphone diagnostics, repair, and software-troubleshooting foundations to more than 1,000 students, and learned how to make complicated technical subjects accessible.",
  },
  {
    role: "Part-Time / Consulting Smartphone Technician",
    org: "FixFone",
    period: "Aug 2022 – Dec 2023",
    detail:
      "Hands-on smartphone diagnostics and repair consulting alongside the faculty role. It reinforced a lesson that still shapes my engineering: understanding the problem accurately matters more than attempting a fix quickly.",
  },
];

const focusAreas = [
  {
    title: "Web and full-stack",
    detail:
      "TypeScript, JavaScript, React, Next.js, Node.js, and NestJS. Product interfaces, backend services, and REST APIs with responsive, accessible layouts.",
  },
  {
    title: "Mobile",
    detail:
      "Flutter and Dart for Android, from UI through release builds, plus Kotlin where a feature needs native code.",
  },
  {
    title: "Desktop and extensions",
    detail:
      "C#, .NET, and WinUI 3 for Windows apps, and TypeScript browser extensions that pair with them.",
  },
  {
    title: "Automation and data",
    detail:
      "Python and Google Apps Script for workflow automation, GitHub Actions for CI/CD, and PostgreSQL, SQLite, and Supabase for the data underneath.",
  },
];

const selectedProjects = [
  {
    title: "Truebite",
    detail:
      "A food review app for finding places worth eating at: a map of food spots, first-hand reviews, and ratings, with a focus on review integrity and trust. Flutter Android app with a web app and API, currently in closed testing.",
    href: "/projects/truebite",
  },
  {
    title: "Scrobblix",
    detail:
      "A privacy-first Windows listening companion that identifies playback, keeps local listening history, explains scrobble outcomes, and queues submissions when connectivity drops.",
    href: "/projects/scrobblix",
  },
  {
    title: "Seali",
    detail:
      "An Android app for downloading video and audio from supported sites, built on the yt-dlp engine and based on the open-source Seal project, with upstream attribution and licensing kept intact.",
    href: "/projects/seali",
  },
  {
    title: "Nah That's Fake",
    detail:
      "A Telegram bot and Mini App for image analysis and suspicious-link checks, bringing multiple detection services into a single user flow.",
    href: "/projects/nah-thats-fake",
  },
  {
    title: "Threadly",
    detail:
      "A short daily puzzle game where players infer a hidden connection from progressively revealed clues, build streaks, and share spoiler-free results.",
    href: "/projects/threadly",
  },
  {
    title: "AdBlocker Test Lab",
    detail:
      "A browser-based lab exploring ad-resource blocking, tracking protection, cosmetic filtering, and observable resource-loading behavior.",
    href: "/projects/adblocker-test-lab",
  },
];

const workingSteps = [
  { step: "Understand", detail: "Investigate the problem, the existing process, and the constraints before choosing a technology." },
  { step: "Plan", detail: "Evaluate options and pick an architecture that stays maintainable as requirements change." },
  { step: "Build", detail: "Implement the application, the business logic, and the integrations it needs." },
  { step: "Validate", detail: "Test behavior, probe edge cases, and verify the outcome instead of assuming it." },
  { step: "Improve", detail: "Monitor limitations, fix issues, and reduce technical debt. The work does not end at launch." },
];

export default function AboutPage() {
  return (
    <article className="mx-auto w-full max-w-4xl flex-1 px-6 py-16 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(profileStructuredData).replace(/</g, "\\u003c"),
        }}
      />
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-system-green">PROFILE // FRPBOY.IN</p>
      <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-6xl">Rahul Muraleedharan</h1>
      <p className="mt-4 text-lg text-system-green sm:text-xl">
        Platform Catalyst · Full Stack Developer &amp; Automation Specialist · Independent builder
      </p>
      <p className="mt-8 max-w-3xl text-base leading-8 text-white/70">
        I am a technology professional from Kerala, India, working across software development, platform engineering,
        automation, and practical problem-solving. My journey started with hardware systems and hands-on technical
        troubleshooting, and grew into programming, application architecture, and business process automation.
      </p>
      <p className="mt-4 max-w-3xl text-base leading-8 text-white/70">
        Today I build complete systems: web applications, Android apps, desktop tools, backend services, and the
        automated workflows that replace repetitive manual work. I publish my independent projects as FrpBoy (also
        K4NN4N); they are free and non-profit, supported by tips, and each one exists because I wanted it to exist.
        Alongside the independent work, I take on select private and freelance projects.
      </p>
      <p className="mt-4 max-w-3xl text-base leading-8 text-white/70">
        I believe technology should do more than demonstrate technical capability: it should make processes simpler,
        reduce unnecessary manual work, and hold up reliably for the people who depend on it.
      </p>

      <h2 className="mt-14 text-2xl font-bold text-white">Professional journey</h2>
      <div className="mt-6 space-y-4">
        {journey.map((item) => (
          <article key={item.org} className="border border-white/10 bg-white/[0.025] p-4">
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
              <div>
                <h3 className="font-semibold text-white/90">{item.role}</h3>
                <p className="mt-1 text-xs text-white/60">{item.org}</p>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-wide text-zinc-400">{item.period}</p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/65">{item.detail}</p>
          </article>
        ))}
      </div>

      <h2 className="mt-14 text-2xl font-bold text-white">What I work on</h2>
      <p className="mt-4 max-w-3xl leading-8 text-white/70">
        I work across multiple technology domains rather than limiting myself to one language or framework. My primary
        interest is building complete systems, understanding how their components interact, and making them work
        reliably together.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {focusAreas.map((area) => (
          <div key={area.title} className="border border-white/10 bg-white/[0.025] p-4">
            <h3 className="font-semibold text-white/90">{area.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">{area.detail}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-14 text-2xl font-bold text-white">Independent projects</h2>
      <p className="mt-4 max-w-3xl leading-8 text-white/70">
        Outside my professional responsibilities, I develop and maintain software under the FrpBoy identity. These
        projects let me experiment with technologies, solve real problems, and contribute useful tools. A few of them
        are below; the full registry, with screenshots and status, lives on the{" "}
        <Link className="text-system-green underline underline-offset-4" href="/projects">projects page</Link>.
      </p>
      <div className="mt-6 space-y-4">
        {selectedProjects.map((project) => (
          <div key={project.title} className="border-l border-white/15 pl-4">
            <h3 className="font-bold text-white">
              <Link className="transition-colors hover:text-system-green" href={project.href}>
                {project.title}
              </Link>
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-white/65">{project.detail}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-14 text-2xl font-bold text-white">Open source</h2>
      <p className="mt-4 max-w-3xl leading-8 text-white/70">
        Most of my independent work is open source, and I contribute upstream where I can: ongoing work on React&apos;s
        Fizz rendering behavior is public through my fork and its pull request, and I maintain and contribute to
        downloader tooling such as Open Download Manager and Awesome Downloader. The{" "}
        <Link className="text-system-green underline underline-offset-4" href="/open-source">open-source page</Link>{" "}
        collects that work.
      </p>

      <h2 className="mt-14 text-2xl font-bold text-white">How I work</h2>
      <p className="mt-4 max-w-3xl leading-8 text-white/70">
        I prefer understanding a problem from the ground up before building anything, and I treat maintenance,
        reliability, and security as part of the work, not as follow-ups.
      </p>
      <ol className="mt-6 space-y-3">
        {workingSteps.map((item, index) => (
          <li key={item.step} className="flex gap-4 border-l border-white/15 pl-4">
            <span className="font-mono text-xs text-system-green">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3 className="font-semibold text-white/90">{item.step}</h3>
              <p className="mt-1 text-sm leading-relaxed text-white/60">{item.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="mt-14 text-2xl font-bold text-white">Find me online</h2>
      <ul className="mt-5 flex flex-wrap gap-4 text-sm">
        <li><a className="text-system-green underline underline-offset-4" href="https://github.com/frpboy" rel="me">GitHub — FrpBoy</a></li>
        <li><a className="text-system-green underline underline-offset-4" href="https://www.linkedin.com/in/rahul-muraleedharan-it/" rel="me">LinkedIn — Rahul Muraleedharan</a></li>
        <li><a className="text-system-green underline underline-offset-4" href="https://x.com/frpboy" rel="me">X — @frpboy</a></li>
        <li><a className="text-system-green underline underline-offset-4" href="https://www.youtube.com/@frpboyapps" rel="me">YouTube — FrpBoy</a></li>
        <li><a className="text-system-green underline underline-offset-4" href="mailto:frpboy12@gmail.com">Email Rahul</a></li>
        <li><Link className="text-system-green underline underline-offset-4" href="/book">Book a call</Link></li>
        <li><Link className="text-system-green underline underline-offset-4" href="/">Official portfolio</Link></li>
        <li><Link className="text-system-green underline underline-offset-4" href="/projects">Project portfolio</Link></li>
        <li><Link className="text-system-green underline underline-offset-4" href="/open-source">Open-source work</Link></li>
        <li><Link className="text-system-green underline underline-offset-4" href="/blog">Blog</Link></li>
        <li><Link className="text-system-green underline underline-offset-4" href="/resume">Resume</Link></li>
      </ul>
      <p className="mt-14 border-t border-white/10 pt-6 font-mono text-xs uppercase tracking-wider text-white/45">
        Also known online as K4NN4N and FrpBoy. Try again, fail again, fail better.
      </p>
    </article>
  );
}
