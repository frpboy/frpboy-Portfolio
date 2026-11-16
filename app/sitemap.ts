import type { MetadataRoute } from "next";
import { projects } from "@/lib/data/projects";
import { allPosts } from "@/lib/blog";

const siteUrl = "https://frpboy.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await allPosts();
  return [
    { url: siteUrl + "/", changeFrequency: "weekly", priority: 1 },
    { url: siteUrl + "/about", changeFrequency: "monthly", priority: 0.9 },
    { url: siteUrl + "/resume", changeFrequency: "monthly", priority: 0.7 },
    { url: siteUrl + "/projects", changeFrequency: "weekly", priority: 0.9 },
    { url: siteUrl + "/open-source", changeFrequency: "monthly", priority: 0.7 },
    { url: siteUrl + "/blog", changeFrequency: "monthly", priority: 0.8 },
    { url: siteUrl + "/terms", changeFrequency: "yearly", priority: 0.3 },
    ...projects.map((project) => ({
      url: siteUrl + "/projects/" + project.id,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...posts.map((article) => ({
      url: siteUrl + "/blog/" + article.slug,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];
}
