import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/lib/data/articles";

const siteUrl = "https://www.frpboy.in";

export const metadata: Metadata = {
  title: "Technical writing",
  description: "Engineering notes and source-backed case studies on Android, web development, automation, release engineering, and reliable software systems by Rahul Muraleedharan.",
  alternates: { canonical: "/writing" },
  openGraph: {
    type: "website",
    url: siteUrl + "/writing",
    title: "Technical writing — Rahul Muraleedharan",
    description: "Source-backed engineering notes and project case studies.",
  },
};

export default function WritingPage() {
  return (
    <article className="mx-auto w-full max-w-5xl flex-1 px-6 py-16 sm:py-24">
      <nav aria-label="Breadcrumb" className="font-mono text-[10px] uppercase tracking-wider text-white/45">
        <Link href="/" className="transition-colors hover:text-system-green">Portfolio</Link>
        <span aria-hidden="true"> / </span>
        <span className="text-system-green">Writing</span>
      </nav>
      <header className="mt-7 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-system-green">Engineering notes // evidence over hype</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-6xl">Technical writing</h1>
        <p className="mt-6 text-base leading-8 text-white/65">
          Practical engineering write-ups grounded in public source code, tests, release notes, and known limitations. I publish a case study when there is something concrete to explain—not to fill a posting schedule.
        </p>
      </header>
      <section aria-label="Articles" className="mt-12 space-y-4">
        {articles.map((item) => (
          <article key={item.slug} className="border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-4 font-mono text-[9px] uppercase tracking-wider text-white/45">
              <time dateTime={item.publishedAt}>{item.dateLabel}</time>
              <span>{item.readingMinutes} min read</span>
            </div>
            <h2 className="mt-4 max-w-3xl text-2xl font-bold text-white sm:text-3xl">
              <Link href={"/writing/" + item.slug} className="transition-colors hover:text-system-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green">{item.title}</Link>
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/65">{item.excerpt}</p>
            <ul aria-label="Article topics" className="mt-5 flex flex-wrap gap-2">
              {item.tags.map((tag) => <li key={tag} className="border border-white/10 px-2 py-1 font-mono text-[9px] text-white/45">{tag}</li>)}
            </ul>
            <Link href={"/writing/" + item.slug} className="mt-6 inline-flex font-mono text-[10px] uppercase tracking-wider text-system-green underline underline-offset-4">Read article</Link>
          </article>
        ))}
      </section>
    </article>
  );
}
