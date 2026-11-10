import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://frpboy.in/sitemap.xml",
    host: "https://frpboy.in",
  };
}
