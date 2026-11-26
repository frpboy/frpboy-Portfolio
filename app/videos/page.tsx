import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllVideos,
  videoSlug,
  formatViews,
  formatDate,
  CHANNEL_TAGS,
  YOUTUBE_CHANNEL_URL,
  YOUTUBE_SUBSCRIBE_URL,
  type YoutubeVideo,
} from "@/lib/data/youtube";

const siteUrl = "https://frpboy.in";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Videos",
  description:
    "Watch FRPBOY on YouTube: Android and Samsung hidden features, secret codes, free AI tools, Flutter and Python tutorials and tech news - new Shorts daily and a long-form video every Saturday, by Rahul Muraleedharan (FrpBoy).",
  keywords: CHANNEL_TAGS,
  alternates: { canonical: "/videos" },
  openGraph: {
    type: "website",
    url: siteUrl + "/videos",
    title: "Videos — Rahul Muraleedharan",
    description:
      "FRPBOY videos and Shorts: phone secrets, free AI tools, coding tutorials and tech news. New Short daily, long-form every Saturday.",
  },
};

function VideoCard({ video }: { video: YoutubeVideo }) {
  const views = formatViews(video.views);
  return (
    <article className="flex h-full flex-col border border-white/10 bg-white/[0.02] transition-colors hover:border-system-green/30">
      <Link href={`/videos/${videoSlug(video)}`} className="block" aria-label={video.title}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          loading="lazy"
          className="aspect-video w-full object-cover"
          width={480}
          height={360}
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em]">
          <span className="text-system-green">Video</span>
          <span className="text-white/40">{formatDate(video.publishedAt)}</span>
          {views ? <span className="text-white/40">{views}</span> : null}
        </div>
        <h3 className="mt-3 text-lg font-bold leading-snug text-white">
          <Link href={`/videos/${videoSlug(video)}`} className="transition-colors hover:text-system-green">
            {video.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-white/60">{video.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {video.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="border border-white/10 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-white/45">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-wider">
          <Link href={`/videos/${videoSlug(video)}`} className="text-system-green underline underline-offset-4">
            Watch here
          </Link>
          <a href={video.watchUrl} className="text-white/55 underline underline-offset-4 transition-colors hover:text-system-green">
            On YouTube
          </a>
        </div>
      </div>
    </article>
  );
}

function ShortCard({ video }: { video: YoutubeVideo }) {
  const views = formatViews(video.views);
  return (
    <article className="flex h-full flex-col border border-white/10 bg-white/[0.02] transition-colors hover:border-system-green/30">
      <Link href={`/videos/${videoSlug(video)}`} className="block" aria-label={video.title}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          loading="lazy"
          className="aspect-[9/16] w-full object-cover"
          width={480}
          height={360}
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em]">
          <span className="text-system-green">Short</span>
          {views ? <span className="text-white/40">{views}</span> : null}
        </div>
        <h3 className="mt-2 text-sm font-bold leading-snug text-white">
          <Link href={`/videos/${videoSlug(video)}`} className="transition-colors hover:text-system-green">
            {video.title}
          </Link>
        </h3>
        <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-white/40">
          {formatDate(video.publishedAt)}
        </p>
      </div>
    </article>
  );
}

export default async function VideosPage() {
  const all = await getAllVideos();
  const videos = all.filter((video) => video.kind === "video");
  const shorts = all.filter((video) => video.kind === "short");

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": siteUrl + "/videos#page",
    url: siteUrl + "/videos",
    name: "FRPBOY Videos",
    description:
      "Videos and Shorts from the FrpBoy YouTube channel (@frpboyapps): Android and Samsung secrets, free AI tools, Flutter and Python tutorials, tech news.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: all.map((video, index) => ({
        "@type": "VideoObject",
        position: index + 1,
        name: video.title,
        description: video.summary,
        thumbnailUrl: video.thumbnailUrl,
        uploadDate: video.publishedAt,
        embedUrl: video.embedUrl,
        url: siteUrl + "/videos/" + videoSlug(video),
        contentUrl: video.watchUrl,
      })),
    },
  };

  return (
    <article className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 sm:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <nav aria-label="Breadcrumb" className="font-mono text-[10px] uppercase tracking-wider text-white/45">
        <Link className="transition-colors hover:text-system-green" href="/">Portfolio</Link>
        <span aria-hidden="true"> / </span>
        <span className="text-system-green">Videos</span>
      </nav>
      <header className="mt-7 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-system-green">Watch // FRPBOY on YouTube</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-6xl">Videos</h1>
        <p className="mt-6 text-base leading-8 text-white/65">
          Phone secrets, free AI tools, coding made simple and the tech news that matters - from the
          FrpBoy YouTube channel. A new Short every day and a long-form video every Saturday. This page
          updates itself from YouTube, so the latest uploads and Shorts show up here automatically.
        </p>
        <div className="mt-7 flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-wider">
          <a href={YOUTUBE_SUBSCRIBE_URL} className="border border-system-green/50 px-4 py-2 text-system-green transition-colors hover:bg-system-green/10">
            Subscribe on YouTube
          </a>
          <a href={YOUTUBE_CHANNEL_URL} className="border border-white/15 px-4 py-2 text-white/65 transition-colors hover:text-system-green">
            @frpboyapps channel
          </a>
        </div>
      </header>

      {all.length === 0 ? (
        <p className="mt-12 border border-white/10 bg-white/[0.02] p-6 text-sm leading-7 text-white/65">
          The video feed could not be loaded right now. Watch everything on the{" "}
          <a href={YOUTUBE_CHANNEL_URL} className="text-system-green underline underline-offset-4">
            FrpBoy YouTube channel
          </a>{" "}
          instead - new Shorts daily, long-form every Saturday.
        </p>
      ) : null}

      {videos.length > 0 ? (
        <section aria-label="Latest videos" className="mt-14">
          <h2 className="text-2xl font-bold text-white">Latest videos</h2>
          <p className="mt-2 text-sm text-white/50">Long-form tutorials, reviews and explainers.</p>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>
      ) : null}

      {shorts.length > 0 ? (
        <section aria-label="Latest Shorts" className="mt-16">
          <h2 className="text-2xl font-bold text-white">Shorts</h2>
          <p className="mt-2 text-sm text-white/50">One phone secret, AI tool or coding tip in under a minute.</p>
          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {shorts.map((video) => (
              <ShortCard key={video.id} video={video} />
            ))}
          </div>
        </section>
      ) : null}

      <p className="mt-12 border-t border-white/10 pt-6 text-xs leading-6 text-white/40">
        Every video above is published on YouTube under FrpBoy (@frpboyapps) and embedded here. Watching
        here still counts on YouTube - subscribing, liking and commenting happens on the channel.
      </p>
    </article>
  );
}
