import { readFile } from "node:fs/promises";

const DEFAULT_ENDPOINT = "https://www.frpboy.in/api/knowledge/ingest";
const DEFAULT_SOURCE_URL =
  "https://github.com/frpboy/frpboy-Portfolio/blob/main/KNOWLEDGE_BASE.md";
const MAX_SOURCE_CHARACTERS = 80_000;

async function main() {
  const token = process.env.KNOWLEDGE_INGEST_TOKEN?.trim();
  if (!token) {
    throw new Error("Set KNOWLEDGE_INGEST_TOKEN before running this script.");
  }

  const endpoint = new URL(
    process.env.KNOWLEDGE_INGEST_URL || DEFAULT_ENDPOINT,
  );
  if (
    endpoint.protocol !== "https:" &&
    !(endpoint.protocol === "http:" &&
      ["localhost", "127.0.0.1"].includes(endpoint.hostname))
  ) {
    throw new Error("KNOWLEDGE_INGEST_URL must use HTTPS (HTTP is allowed only for localhost).");
  }

  const sourceUrl =
    process.env.KNOWLEDGE_BASE_SOURCE_URL || DEFAULT_SOURCE_URL;
  const parsedSourceUrl = new URL(sourceUrl);
  if (parsedSourceUrl.protocol !== "https:") {
    throw new Error("KNOWLEDGE_BASE_SOURCE_URL must use HTTPS.");
  }

  const knowledgeBaseUrl = new URL("../KNOWLEDGE_BASE.md", import.meta.url);
  const text = await readFile(knowledgeBaseUrl, "utf8");

  if (!text.trim()) {
    throw new Error("KNOWLEDGE_BASE.md is empty.");
  }
  if (text.length > MAX_SOURCE_CHARACTERS) {
    throw new Error(
      `KNOWLEDGE_BASE.md contains ${text.length} characters; the ingestion API limit is ${MAX_SOURCE_CHARACTERS}.`,
    );
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      title: "Rahul Muraleedharan — Public Portfolio Knowledge Base",
      sourceUrl,
      sourceType: "portfolio-profile",
      text,
    }),
    signal: AbortSignal.timeout(120_000),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      result && typeof result === "object" && "error" in result
        ? String(result.error)
        : "Knowledge ingestion failed.";
    throw new Error(`Ingestion API returned HTTP ${response.status}: ${message}`);
  }

  console.log("Knowledge base ingested successfully.");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(
    error instanceof Error ? error.message : "Unknown knowledge ingestion error.",
  );
  process.exitCode = 1;
});
