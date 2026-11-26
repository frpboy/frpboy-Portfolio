// FRPBOY YouTube data layer.
//
// Fetches the channel's public YouTube RSS feeds at request time (ISR,
// revalidated hourly by the pages that use this module), so new uploads
// and Shorts appear on frpboy.in automatically - no redeploy, no API key.
//
// YouTube exposes per-channel playlist feeds derived from the channel id
// (UC8WvBUoc8cxNbOaSDVgXsYg for FrpBoy @frpboyapps):
//   UU..   = all uploads
//   UULF.. = long-form videos only (no Shorts, no live)
//   UUSH.. = Shorts only
// Using the UULF / UUSH feeds is what lets /videos separate real videos
// from Shorts reliably. If both ever come back empty, we fall back to the
// uploads feed and classify by the #shorts marker.

import { cache } from "react";

export const YOUTUBE_CHANNEL_ID = "UC8WvBUoc8cxNbOaSDVgXsYg";
export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@frpboyapps";
export const YOUTUBE_SUBSCRIBE_URL =
  "https://www.youtube.com/@frpboyapps?sub_confirmation=1";

const CHANNEL_SUFFIX = YOUTUBE_CHANNEL_ID.slice(2); // drop the "UC" prefix
const FEED_BASE = "https://www.youtube.com/feeds/videos.xml?playlist_id=";
const UPLOADS_FEED = FEED_BASE + "UU" + CHANNEL_SUFFIX;
const VIDEOS_FEED = FEED_BASE + "UULF" + CHANNEL_SUFFIX;
const SHORTS_FEED = FEED_BASE + "UUSH" + CHANNEL_SUFFIX;

// Channel-level tags from the FrpBoy upload defaults (YouTube Studio).
export const CHANNEL_TAGS = [
  "frpboy",
  "rahul muraleedharan",
  "android tips",
  "android hidden features",
  "samsung hidden features",
  "free ai tools",
  "flutter tutorial",
  "python for beginners",
  "tech tips india",
  "smartphone tips",
];

export type VideoKind = "video" | "short";

export interface YoutubeVideo {
  id: string;
  kind: VideoKind;
  title: string;
  /** Full description exactly as published on YouTube. */
  description: string;
  /** Short, cleaned description safe for meta tags and cards (~160 chars). */
  summary: string;
  /** Topic tags: hashtags from the video itself first, then channel tags. */
  tags: string[];
  publishedAt: string; // ISO date from the feed
  updatedAt: string; // ISO date from the feed
  views: number | null;
  watchUrl: string;
  embedUrl: string;
  thumbnailUrl: string;
  /** Smaller 320px thumbnail for listing cards (faster page loads). */
  smallThumbnailUrl: string;
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
}

/** URL slug for a video page: "<kebab-title>-<videoId>". */
export function videoSlug(video: YoutubeVideo): string {
  const base = slugifyTitle(video.title);
  return base ? base + "-" + video.id : video.id;
}

/** A slug resolves by the 11-char YouTube id at its end (or the whole slug). */
export function videoIdFromSlug(slug: string): string | null {
  const match = slug.match(/([A-Za-z0-9_-]{11})$/);
  return match ? match[1] : null;
}

function decodeXml(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, "&")
    .trim();
}

function tagValue(block: string, tag: string): string {
  const match = block.match(
    new RegExp("<" + tag + "(?:\\s[^>]*)?>([\\s\\S]*?)</" + tag + ">")
  );
  return match ? decodeXml(match[1]) : "";
}

function deriveTags(title: string, description: string): string[] {
  const found: string[] = [];
  const hashtagPattern = /#([A-Za-z0-9_]+)/g;
  let match: RegExpExecArray | null;
  const haystack = title + " " + description;
  while ((match = hashtagPattern.exec(haystack)) !== null) {
    const tag = match[1].replace(/_/g, " ").toLowerCase();
    // Skip pure numbers - phone secret codes like *#4636# are not tags.
    if (tag && /[a-z]/.test(tag) && !found.includes(tag)) found.push(tag);
  }
  for (const tag of CHANNEL_TAGS) {
    if (!found.includes(tag)) found.push(tag);
  }
  return found.slice(0, 15);
}

function summarize(description: string, title: string): string {
  const lines = description
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(
      (line) =>
        line.length > 0 &&
        !line.startsWith("#") &&
        !line.startsWith("http") &&
        !/^#[\w\s#]+$/.test(line)
    );
  const text = (lines.join(" ") || title).replace(/\s+/g, " ").trim();
  if (text.length <= 160) return text;
  const cut = text.slice(0, 157);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut) + "...";
}

function parseFeed(xml: string, kind: VideoKind): YoutubeVideo[] {
  const videos: YoutubeVideo[] = [];
  const entryPattern = /<entry>([\s\S]*?)<\/entry>/g;
  let entry: RegExpExecArray | null;
  while ((entry = entryPattern.exec(xml)) !== null) {
    const block = entry[1];
    const id = tagValue(block, "yt:videoId");
    if (!id) continue;
    const title = tagValue(block, "title");
    const description = tagValue(block, "media:description");
    const publishedAt = tagValue(block, "published");
    const updatedAt = tagValue(block, "updated") || publishedAt;
    const viewsMatch = block.match(/<media:statistics\s+views="(\d+)"/);
    const isShort = kind === "short";
    videos.push({
      id,
      kind,
      title,
      description,
      summary: summarize(description, title),
      tags: deriveTags(title, description),
      publishedAt,
      updatedAt,
      views: viewsMatch ? Number(viewsMatch[1]) : null,
      watchUrl: isShort
        ? "https://www.youtube.com/shorts/" + id
        : "https://www.youtube.com/watch?v=" + id,
      embedUrl: "https://www.youtube-nocookie.com/embed/" + id,
      thumbnailUrl: "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg",
      smallThumbnailUrl: "https://i.ytimg.com/vi/" + id + "/mqdefault.jpg",
    });
  }
  return videos;
}

async function fetchFeed(url: string, kind: VideoKind): Promise<YoutubeVideo[]> {
  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "frpboy.in video section (RSS reader)" },
    });
    if (!response.ok) return [];
    const xml = await response.text();
    return parseFeed(xml, kind);
  } catch {
    return [];
  }
}

/**
 * All recent channel content: long-form videos and Shorts, newest first.
 * Never throws - an empty array just renders the section's fallback state.
 * Wrapped in React cache() so the metadata, page body and related-videos
 * lookups in a single request share one set of feed fetches instead of
 * repeating them (the feeds themselves are also ISR-cached for an hour).
 */
export const getAllVideos = cache(async (): Promise<YoutubeVideo[]> => {
  const [videos, shorts, uploads] = await Promise.all([
    fetchFeed(VIDEOS_FEED, "video"),
    fetchFeed(SHORTS_FEED, "short"),
    fetchFeed(UPLOADS_FEED, "video"),
  ]);
  const shortIds = new Set(shorts.map((video) => video.id));
  const byId = new Map<string, YoutubeVideo>();
  for (const video of shorts) byId.set(video.id, video);
  for (const video of videos) {
    if (!byId.has(video.id)) byId.set(video.id, video);
  }
  // Safety net: anything in the uploads feed that neither playlist feed
  // claimed still shows up - as a Short if the Shorts feed knows it,
  // otherwise as a long-form video (e.g. a brand-new Saturday upload).
  for (const video of uploads) {
    if (byId.has(video.id)) continue;
    const isShort =
      shortIds.has(video.id) ||
      /#shorts?\b/i.test(video.title + " " + video.description);
    byId.set(video.id, {
      ...video,
      kind: isShort ? ("short" as VideoKind) : ("video" as VideoKind),
      watchUrl: isShort
        ? "https://www.youtube.com/shorts/" + video.id
        : video.watchUrl,
    });
  }
  return [...byId.values()].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );
});

export async function getVideoById(id: string): Promise<YoutubeVideo | null> {
  const all = await getAllVideos();
  return all.find((video) => video.id === id) ?? null;
}

export function formatViews(views: number | null): string | null {
  if (views === null) return null;
  if (views >= 1000000) return (views / 1000000).toFixed(1).replace(/\.0$/, "") + "M views";
  if (views >= 1000) return (views / 1000).toFixed(1).replace(/\.0$/, "") + "K views";
  return views + " views";
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}
