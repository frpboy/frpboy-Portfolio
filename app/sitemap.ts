import type { MetadataRoute } from "next";
import { projects } from "@/lib/data/projects";
import { games } from "@/lib/data/games";
import { getAllVideos, videoSlug } from "@/lib/data/youtube";
import { allPosts } from "@/lib/blog";

const siteUrl = "https://frpboy.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await allPosts();
  let videos: Awaited<ReturnType<typeof getAllVideos>> = [];
  try {
    videos = await getAllVideos();
  } catch {
    videos = [];
  }
  return [
    { url: siteUrl + "/", changeFrequency: "weekly", priority: 1 },
    { url: siteUrl + "/about", changeFrequency: "monthly", priority: 0.9 },
    { url: siteUrl + "/resume", changeFrequency: "monthly", priority: 0.7 },
    { url: siteUrl + "/projects", changeFrequency: "weekly", priority: 0.9 },
    { url: siteUrl + "/games", changeFrequency: "weekly", priority: 0.9 },
    { url: siteUrl + "/videos", changeFrequency: "daily", priority: 0.9 },
    { url: siteUrl + "/open-source", changeFrequency: "monthly", priority: 0.7 },
    { url: siteUrl + "/blog", changeFrequency: "monthly", priority: 0.8 },
    { url: siteUrl + "/terms", changeFrequency: "yearly", priority: 0.3 },
    ...projects.map((project) => ({
      url: siteUrl + "/projects/" + project.id,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...games.map((game) => ({
      url: siteUrl + "/games/" + game.id,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...videos.map((video) => ({
      url: siteUrl + "/videos/" + videoSlug(video),
      lastModified: video.updatedAt ? new Date(video.updatedAt) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...posts.map((article) => ({
      url: siteUrl + "/blog/" + article.slug,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];
}
