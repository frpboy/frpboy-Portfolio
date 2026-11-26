import { getAllVideos, videoSlug } from "@/lib/data/youtube";

const siteUrl = "https://frpboy.in";

export const revalidate = 3600;

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Google video sitemap: one entry per video page, with the video metadata
// Google Video search needs (thumbnail, title, description, player, tags).
// Referenced from robots.txt alongside the main sitemap.
export async function GET() {
  let videos: Awaited<ReturnType<typeof getAllVideos>> = [];
  try {
    videos = await getAllVideos();
  } catch {
    videos = [];
  }

  const entries = videos
    .map((video) => {
      const pageUrl = siteUrl + "/videos/" + videoSlug(video);
      const tags = video.tags
        .slice(0, 32)
        .map((tag) => "      <video:tag>" + escapeXml(tag) + "</video:tag>")
        .join("\n");
      return [
        "  <url>",
        "    <loc>" + escapeXml(pageUrl) + "</loc>",
        "    <video:video>",
        "      <video:thumbnail_loc>" + escapeXml(video.thumbnailUrl) + "</video:thumbnail_loc>",
        "      <video:title>" + escapeXml(video.title.slice(0, 100)) + "</video:title>",
        "      <video:description>" + escapeXml(video.summary.slice(0, 2048)) + "</video:description>",
        '      <video:player_loc allow_embed="yes">' + escapeXml(video.embedUrl) + "</video:player_loc>",
        "      <video:publication_date>" + escapeXml(video.publishedAt) + "</video:publication_date>",
        "      <video:family_friendly>yes</video:family_friendly>",
        "      <video:live>no</video:live>",
        tags,
        "    </video:video>",
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n' +
    entries +
    "\n</urlset>\n";

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
