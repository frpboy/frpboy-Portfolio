export interface WritingArticle {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  dateLabel: string;
  readingMinutes: number;
  tags: string[];
}

export const articles: WritingArticle[] = [
  {
    slug: "scrobblix-unknown-submissions",
    title: "When a scrobble's result is unknown: designing a safer delivery queue",
    excerpt: "A source-backed look at local idempotency, durable leases, bounded retries, and the difference between a provider acknowledgement and a user's local confirmation.",
    publishedAt: "2026-11-11",
    updatedAt: "2026-11-11",
    dateLabel: "11 November 2026",
    readingMinutes: 7,
    tags: ["C#", ".NET", "SQLite", "Reliability", "Scrobblix"],
  },
];
