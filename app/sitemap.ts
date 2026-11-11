import type { MetadataRoute } from "next";
import { projects } from "@/lib/data/projects";
import { articles } from "@/lib/data/articles";

const siteUrl = "https://www.frpboy.in";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl + "/", changeFrequency: "weekly", priority: 1 },
    { url: siteUrl + "/about", changeFrequency: "monthly", priority: 0.9 },
    { url: siteUrl + "/resume", changeFrequency: "monthly", priority: 0.7 },
    { url: siteUrl + "/projects", changeFrequency: "weekly", priority: 0.9 },
    { url: siteUrl + "/open-source", changeFrequency: "monthly", priority: 0.7 },
    { url: siteUrl + "/writing", changeFrequency: "monthly", priority: 0.8 },
    ...projects.map((project) => ({
      url: siteUrl + "/projects/" + project.id,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...articles.map((article) => ({
      url: siteUrl + "/writing/" + article.slug,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];
}
