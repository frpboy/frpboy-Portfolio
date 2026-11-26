import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllVideos,
  getVideoById,
  videoIdFromSlug,
  videoSlug,
  formatViews,
  formatDate,
  YOUTUBE_SUBSCRIBE_URL,
} from "@/lib/data/youtube";
import YoutubeEmbed from "@/components/YoutubeEmbed";

const siteUrl = "https://frpboy.in";
type PageProps = { params: Promise<{ slug: string }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const id = videoIdFromSlug(slug);
  const video = id ? await getVideoById(id) : null;
  if (!video) return { title: "Video not found" };
  const url = siteUrl + "/videos/" + videoSlug(video);
  const isShort = video.kind === "short";
  return {
    title: video.title + " — Videos",
    description: video.summary,
    keywords: video.tags,
    alternates: { canonical: "/videos/" + videoSlug(video) },
    openGraph: {
      type: "video.other",
      url,
      title: video.title + " — FrpBoy",
      description: video.summary,
      images: [{ url: video.thumbnailUrl, width: 480, height: 360, alt: video.title }],
      videos: [
        {
          url: video.embedUrl,
          width: isShort ? 405 : 1280,
          height: isShort ? 720 : 720,
          type: "text/html",
        },
      ],
    },
    twitter: {
      card: "player",
      title: video.title + " — FrpBoy",
      description: video.summary,
      images: [video.thumbnailUrl],
      players: [
        {
          playerUrl: video.embedUrl,
          streamUrl: video.watchUrl,
          width: isShort ? 405 : 1280,
          height: 720,
        },
      ],
    },
  };
}

export default async function VideoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const id = videoIdFromSlug(slug);
  const video = id ? await getVideoById(id) : null;
  if (!video) notFound();

  const isShort = video.kind === "short";
  const pageUrl = siteUrl + "/videos/" + videoSlug(video);
  const views = formatViews(video.views);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": pageUrl + "#video",
    name: video.title,
    description: video.summary,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.publishedAt,
    embedUrl: video.embedUrl,
    contentUrl: video.watchUrl,
    url: pageUrl,
    inLanguage: "en",
    isFamilyFriendly: true,
    keywords: video.tags.join(", "),
    author: {
      "@type": "Person",
      name: "Rahul Muraleedharan",
      url: siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: "Rahul Muraleedharan",
      url: siteUrl,
    },
    ...(views && video.views !== null
      ? {
          interactionStatistic: {
            "@type": "InteractionCounter",
            interactionType: { "@type": "WatchAction" },
            userInteractionCount: video.views,
          },
        }
      : {}),
  };

  const all = await getAllVideos();
  const related = [
    ...all.filter((other) => other.id !== video.id && other.kind === video.kind),
    ...all.filter((other) => other.id !== video.id && other.kind !== video.kind),
  ].slice(0, 3);

  return (
    <article className="mx-auto w-full max-w-4xl flex-1 px-6 py-16 sm:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <nav aria-label="Breadcrumb" className="font-mono text-[10px] uppercase tracking-wider text-white/45">
        <Link href="/" className="transition-colors hover:text-system-green">Portfolio</Link>
        <span aria-hidden="true"> / </span>
        <Link href="/videos" className="transition-colors hover:text-system-green">Videos</Link>
        <span aria-hidden="true"> / </span>
        <span className="text-system-green">{isShort ? "Short" : "Video"}</span>
      </nav>

      <header className="mt-8 border-b border-white/10 pb-8">
        <div className="flex flex-wrap items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em]">
          <span className="text-system-green">{isShort ? "YouTube Short" : "YouTube Video"}</span>
          <span className="text-white/25">/</span>
          <span className="text-white/45">{formatDate(video.publishedAt)}</span>
          {views ? (
            <>
              <span className="text-white/25">/</span>
              <span className="text-white/45">{views}</span>
            </>
          ) : null}
        </div>
        <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-5xl">{video.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-white/70">{video.summary}</p>
      </header>

      <section aria-label={video.title}>
        {isShort ? (
          <div className="mx-auto mt-8 aspect-[9/16] w-full max-w-sm border border-white/10 bg-black">
            <YoutubeEmbed embedUrl={video.embedUrl} thumbnailUrl={video.thumbnailUrl} title={video.title} isShort />
          </div>
        ) : (
          <div className="mt-8 aspect-video w-full border border-white/10 bg-black">
            <YoutubeEmbed embedUrl={video.embedUrl} thumbnailUrl={video.thumbnailUrl} title={video.title} />
          </div>
        )}
        <div className="mt-5 flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-wider">
          <a href={video.watchUrl} className="border border-system-green/50 px-4 py-2 text-system-green transition-colors hover:bg-system-green/10">
            Watch on YouTube
          </a>
          <a href={YOUTUBE_SUBSCRIBE_URL} className="border border-white/15 px-4 py-2 text-white/65 transition-colors hover:text-system-green">
            Subscribe — @frpboyapps
          </a>
        </div>
      </section>

      {video.description ? (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-white">About this {isShort ? "Short" : "video"}</h2>
          <p className="mt-3 whitespace-pre-line leading-8 text-white/65">{video.description}</p>
        </section>
      ) : null}

      <section aria-label="Tags" className="mt-10">
        <h2 className="text-xl font-bold text-white">Tags</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {video.tags.map((tag) => (
            <li key={tag}>
              <a
                href={"https://www.youtube.com/results?search_query=" + encodeURIComponent(tag)}
                className="inline-block border border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white/55 transition-colors hover:border-system-green/30 hover:text-system-green"
              >
                {tag}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {related.length > 0 ? (
        <section aria-label="More videos" className="mt-12 border-t border-white/10 pt-7">
          <h2 className="text-xl font-bold text-white">Watch next</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-3">
            {related.map((other) => (
              <li key={other.id} className="border border-white/10 bg-white/[0.02] transition-colors hover:border-system-green/30">
                <Link href={`/videos/${videoSlug(other)}`} className="block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={other.smallThumbnailUrl} alt={other.title} loading="lazy" decoding="async" className="aspect-video w-full object-cover" width={320} height={180} />
                </Link>
                <div className="p-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-system-green">
                    {other.kind === "short" ? "Short" : "Video"}
                  </p>
                  <Link href={`/videos/${videoSlug(other)}`} className="mt-2 block text-sm font-bold leading-snug text-white transition-colors hover:text-system-green">
                    {other.title}
                  </Link>
                  <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-white/40">{formatDate(other.publishedAt)}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-5 font-mono text-[10px] uppercase tracking-wider">
            <Link href="/videos" className="text-system-green underline underline-offset-4">All videos</Link>
          </div>
        </section>
      ) : null}
    </article>
  );
}
