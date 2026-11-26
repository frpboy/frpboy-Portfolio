import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { games } from "@/lib/data/games";

const siteUrl = "https://frpboy.in";
type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return games.map((game) => ({ slug: game.id }));
}

function findGame(slug: string) {
  return games.find((game) => game.id === slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = findGame(slug);
  if (!game) return { title: "Game not found" };
  const url = siteUrl + "/games/" + game.id;
  return {
    title: game.title + " — Games",
    description: game.description,
    alternates: { canonical: "/games/" + game.id },
    openGraph: {
      type: "website",
      url,
      title: game.title + " — Rahul Muraleedharan",
      description: game.description,
    },
  };
}

export default async function GameDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const game = findGame(slug);
  if (!game) notFound();

  const pageUrl = siteUrl + "/games/" + game.id;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "@id": pageUrl + "#game",
    name: game.title,
    description: game.description,
    url: pageUrl,
    applicationCategory: "Game",
    operatingSystem: "Any (web browser)",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
  };
  const moreGames = games.filter((other) => other.id !== game.id).slice(0, 3);

  return (
    <article className="mx-auto w-full max-w-4xl flex-1 px-6 py-16 sm:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <nav aria-label="Breadcrumb" className="font-mono text-[10px] uppercase tracking-wider text-white/45">
        <Link href="/" className="transition-colors hover:text-system-green">Portfolio</Link>
        <span aria-hidden="true"> / </span>
        <Link href="/games" className="transition-colors hover:text-system-green">Games</Link>
        <span aria-hidden="true"> / </span>
        <span className="text-system-green">{game.title}</span>
      </nav>
      <header className="mt-8 border-b border-white/10 pb-8">
        <div className="flex flex-wrap items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em]">
          <span className="text-system-green">{game.category}</span>
          <span className="text-white/25">/</span>
          <span className="text-white/45">Free</span>
        </div>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-6xl">{game.title}</h1>
        <p className="mt-4 text-lg text-white/55">{game.tagline}</p>
        <p className="mt-6 max-w-3xl text-base leading-8 text-white/70">{game.description}</p>
        <p className="mt-5 font-mono text-[10px] uppercase tracking-wider text-white/45">Controls: {game.controls}</p>
      </header>

      <section aria-label={game.title + " game"}>
        <iframe
          src={`/games-play/${game.id}.html?v=1`}
          title={`${game.title} game`}
          className="mt-8 h-[760px] w-full border border-white/10 bg-black"
          loading="lazy"
        />
        <p className="mt-4 font-mono text-[10px] uppercase tracking-wider">
          <a href={`/games-play/${game.id}.html`} className="text-system-green underline underline-offset-4">Open the game full screen</a>
        </p>
      </section>

      <div className="mt-10 space-y-10">
        <section>
          <h2 className="text-xl font-bold text-white">How to play</h2>
          <p className="mt-3 leading-8 text-white/65">{game.howTo}</p>
        </section>
      </div>

      <section aria-label="More games" className="mt-12 border-t border-white/10 pt-7">
        <h2 className="text-xl font-bold text-white">More games</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-3">
          {moreGames.map((other) => (
            <li key={other.id} className="border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-system-green/30">
              <Link href={`/games/${other.id}`} className="text-base font-bold text-white transition-colors hover:text-system-green">{other.title}</Link>
              <p className="mt-2 text-sm leading-6 text-white/55">{other.tagline}</p>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-5 font-mono text-[10px] uppercase tracking-wider">
          <Link href="/games" className="text-system-green underline underline-offset-4">All games</Link>
        </div>
      </section>
    </article>
  );
}
