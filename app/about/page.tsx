import type { Metadata } from "next";
import Link from "next/link";

const profileStructuredData = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": "https://www.frpboy.in/about#profile",
  url: "https://www.frpboy.in/about",
  name: "About Rahul Muraleedharan — K4NN4N / FrpBoy",
  mainEntity: {
    "@type": "Person",
    "@id": "https://www.frpboy.in/#person",
    name: "Rahul Muraleedharan",
    alternateName: ["K4NN4N", "FrpBoy"],
    jobTitle: "Full Stack Developer & Automation Specialist",
    description: "A developer focused on web applications, Android apps, Python, and workflow automation.",
    url: "https://www.frpboy.in/",
    sameAs: ["https://github.com/frpboy", "https://www.linkedin.com/in/k4nn4n/"],
    knowsAbout: [
      "Full-stack development",
      "Android development",
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
  description: "Learn about Rahul Muraleedharan (K4NN4N / FrpBoy), a full-stack developer and automation specialist from Kerala, India.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    url: "https://www.frpboy.in/about",
    title: "About Rahul Muraleedharan — K4NN4N / FrpBoy",
    description: "Professional background, development focus, and open-source work by Rahul Muraleedharan.",
  },
};

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
        I am a developer from Kerala, India, with a background in hardware systems and a focus on building practical software.
        I work across web applications, Android applications, Python, and Google Apps Script, with an emphasis on replacing
        repetitive manual processes with reliable, maintainable workflows.
      </p>
      <h2 className="mt-14 text-2xl font-bold text-white">Engineering focus</h2>
      <p className="mt-4 max-w-3xl leading-8 text-white/70">
        My work combines troubleshooting, system thinking, application development, and automation. I enjoy taking a real
        operational problem from its first diagnosis through implementation, testing, and delivery.
      </p>
      <h2 className="mt-14 text-2xl font-bold text-white">Find me online</h2>
      <ul className="mt-5 flex flex-wrap gap-4 text-sm">
        <li><a className="text-system-green underline underline-offset-4" href="https://github.com/frpboy" rel="me">GitHub — FrpBoy</a></li>
        <li><a className="text-system-green underline underline-offset-4" href="https://www.linkedin.com/in/k4nn4n/" rel="me">LinkedIn — Rahul Muraleedharan</a></li>
        <li><a className="text-system-green underline underline-offset-4" href="mailto:frpboy12@gmail.com">Email Rahul</a></li>
        <li><Link className="text-system-green underline underline-offset-4" href="/">Official portfolio</Link></li>
      </ul>
      <p className="mt-14 border-t border-white/10 pt-6 font-mono text-xs uppercase tracking-wider text-white/45">
        Also known online as K4NN4N and FrpBoy.
      </p>
    </article>
  );
}
