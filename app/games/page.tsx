import type { Metadata } from "next";
import Link from "next/link";
import { games } from "@/lib/data/games";

const siteUrl = "https://frpboy.in";

export const metadata: Metadata = {
  title: "Games",
  description:
    "Play 10 free online games in your browser at FRPBOY Games: Snake, 2048, Flappy Bird, Chess, Piano, Tic Tac Toe, Memory Match, Breakout, Minesweeper and Tetris. No download, no sign-up - mobile and desktop.",
  alternates: { canonical: "/games" },
  openGraph: {
    type: "website",
    url: siteUrl + "/games",
    title: "Games — Rahul Muraleedharan",
    description:
      "10 free single-file browser games by FRPBOY. No download, no sign-up - play on mobile or desktop.",
  },
};

export default function GamesPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": siteUrl + "/games#page",
    url: siteUrl + "/games",
    name: "FRPBOY Games",
    description:
      "Free online browser games by FRPBOY - no download, no sign-up.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: games.map((game, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: game.title,
        url: siteUrl + "/games/" + game.id,
      })),
    },
  };

  return (
    <article className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 sm:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <nav aria-label="Breadcrumb" className="font-mono text-[10px] uppercase tracking-wider text-white/45">
        <Link className="transition-colors hover:text-system-green" href="/">Portfolio</Link>
        <span aria-hidden="true"> / </span>
        <span className="text-system-green">Games</span>
      </nav>
      <header className="mt-7 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-system-green">Play // FRPBOY Games</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-6xl">Games</h1>
        <p className="mt-6 text-base leading-8 text-white/65">
          Ten classic games, rebuilt by FRPBOY as tiny single-file web pages. No download, no sign-up, no ads inside the games - just tap and play, on your phone or your computer. Every game works offline once the page loads.
        </p>
      </header>
      <section aria-label="Game catalogue" className="mt-12 grid gap-4 md:grid-cols-2">
        {games.map((game) => (
          <article key={game.id} className="flex h-full flex-col border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-system-green/30 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-system-green">{game.category}</p>
              <span className="font-mono text-[9px] uppercase tracking-wider text-white/40">Free</span>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-white">
              <Link href={`/games/${game.id}`} className="transition-colors hover:text-system-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-system-green">{game.title}</Link>
            </h2>
            <p className="mt-2 text-sm font-medium text-white/55">{game.tagline}</p>
            <p className="mt-4 flex-1 text-sm leading-7 text-white/65">{game.description}</p>
            <p className="mt-5 font-mono text-[9px] uppercase tracking-wider text-white/40">Controls: {game.controls}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-wider">
              <Link href={`/games/${game.id}`} className="text-system-green underline underline-offset-4">Play now</Link>
            </div>
          </article>
        ))}
      </section>
      <p className="mt-12 border-t border-white/10 pt-6 text-xs leading-6 text-white/40">
        Every game is a single self-contained page with no network calls and no saved scores. Progress and best scores last only for the session you are playing in.
      </p>
    </article>
  );
}
