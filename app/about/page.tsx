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
      "A developer from Kerala, India, focused on web applications, Android apps, Python, and workflow automation, with a background in smartphone hardware diagnostics and teaching.",
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
    "About Rahul Muraleedharan (K4NN4N / FrpBoy): from smartphone hardware diagnostics and teaching to full-stack development, Android apps, and workflow automation, from Kerala, India.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    url: "https://frpboy.in/about",
    title: "About Rahul Muraleedharan — K4NN4N / FrpBoy",
    description:
      "Background, current role, development focus, and the independent projects Rahul Muraleedharan builds as FrpBoy.",
  },
};

const focusAreas = [
  {
    title: "Web and full-stack",
    detail:
      "TypeScript, JavaScript, React, Next.js, and Node.js. Marketing sites, dashboards, and product interfaces with responsive, accessible layouts.",
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
      "A food review app for finding places worth eating at: a map of food spots, first-hand reviews, and ratings. Flutter Android app with a web app and API, currently in closed testing.",
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
      "An Android app for downloading video and audio from supported sites, built on the yt-dlp engine and based on the open-source Seal project.",
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
      <p className="mt-4 text-lg text-system-green sm:text-xl">Full Stack Developer &amp; Automation Specialist</p>
      <p className="mt-8 max-w-3xl text-base leading-8 text-white/70">
        I am a developer from Kerala, India, building practical software across web applications, Android applications,
        desktop tools, and workflow automation. Most of what I make starts the same way: a repetitive manual process
        that should be a reliable, maintainable system instead.
      </p>
      <p className="mt-4 max-w-3xl text-base leading-8 text-white/70">
        I publish my independent work as FrpBoy (also K4NN4N in gaming corners of the internet). The apps are free and
        non-profit, supported by tips, and each one is something I built because I wanted it to exist. Alongside the
        independent work, I take on select private and freelance projects.
      </p>

      <h2 className="mt-14 text-2xl font-bold text-white">What I work on</h2>
      <p className="mt-4 max-w-3xl leading-8 text-white/70">
        My work combines troubleshooting, system thinking, application development, and automation. I enjoy taking a
        real operational problem from its first diagnosis through implementation, testing, and delivery.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {focusAreas.map((area) => (
          <div key={area.title} className="border border-white/10 bg-white/[0.025] p-4">
            <h3 className="font-semibold text-white/90">{area.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">{area.detail}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-14 text-2xl font-bold text-white">From hardware to software</h2>
      <p className="mt-4 max-w-3xl leading-8 text-white/70">
        Before writing software full time, I spent years in smartphone hardware: diagnostics, repair, and teaching.
        As a Faculty Member at SISCO Institute of Smartphone Technology (Dec 2021 &ndash; Aug 2025), I taught practical
        diagnostics, repair, and software-troubleshooting foundations to more than 1,000 students, and I consulted
        part-time as a smartphone technician with FixFone (Aug 2022 &ndash; Dec 2023).
      </p>
      <p className="mt-4 max-w-3xl leading-8 text-white/70">
        Hardware troubleshooting taught me to isolate causes and prove a fix before calling it done. Software
        engineering extended that discipline into applications, APIs, and repeatable workflows that can be tested and
        maintained, and it still shapes how I debug: start with reproducible evidence, make failure states visible,
        and validate the outcome.
      </p>

      <h2 className="mt-14 text-2xl font-bold text-white">Today</h2>
      <p className="mt-4 max-w-3xl leading-8 text-white/70">
        I work as a Platform Catalyst at Zabnix Private Limited, contributing to the company&apos;s platform and
        product engineering. The details of that work stay with the company; what carries over publicly is the same
        engineering approach you see across my independent projects below.
      </p>

      <h2 className="mt-14 text-2xl font-bold text-white">Selected projects</h2>
      <p className="mt-4 max-w-3xl leading-8 text-white/70">
        A few of the things I build and maintain as FrpBoy. The full registry, with screenshots and status, lives on
        the <Link className="text-system-green underline underline-offset-4" href="/projects">projects page</Link>.
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
        Start with reproducible evidence. Make system behavior and failure states visible. Prefer maintainable
        changes over clever shortcuts. Validate outcomes, document limits, and leave a clear handoff.
      </p>

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
        Also known online as K4NN4N and FrpBoy.
      </p>
    </article>
  );
}
