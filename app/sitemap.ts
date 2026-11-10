import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://frpboy.in/", changeFrequency: "weekly", priority: 1 },
    { url: "https://frpboy.in/about", changeFrequency: "monthly", priority: 0.9 },
  ];
}
