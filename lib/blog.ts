import { readdirSync } from "node:fs";
import path from "node:path";
import { articles, type WritingArticle } from "@/lib/data/articles";

// Posts written as MDX live in content/blog/<slug>.mdx and export `meta`.
// The slug is the file name. Files starting with "_" are ignored (drafts/templates).
export type PostMeta = Omit<WritingArticle, "slug">;

const contentDir = path.join(process.cwd(), "content", "blog");

export function mdxSlugs(): string[] {
  try {
    return readdirSync(contentDir)
      .filter((file) => file.endsWith(".mdx") && !file.startsWith("_"))
      .map((file) => file.replace(/\.mdx$/, ""));
  } catch {
    return [];
  }
}

export async function loadMdx(slug: string) {
  if (!mdxSlugs().includes(slug)) return null;
  const mod = await import(`@/content/blog/${slug}.mdx`);
  return { Post: mod.default as React.ComponentType, meta: mod.meta as PostMeta };
}

export async function allPosts(): Promise<WritingArticle[]> {
  const mdx = await Promise.all(
    mdxSlugs().map(async (slug) => {
      const loaded = await loadMdx(slug);
      return loaded ? { slug, ...loaded.meta } : null;
    }),
  );
  return [...articles, ...mdx.filter((post): post is WritingArticle => post !== null)].sort(
    (a, b) => b.publishedAt.localeCompare(a.publishedAt),
  );
}
