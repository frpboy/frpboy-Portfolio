import "server-only";

import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_API_KEY;
const host = process.env.PINECONE_INDEX_HOST;
const name = process.env.PINECONE_INDEX_NAME;
const namespace = process.env.PINECONE_NAMESPACE;

if (!apiKey || !host || !name || !namespace) {
  throw new Error("Missing required Pinecone environment variables.");
}

export const portfolioKnowledgeIndex = new Pinecone({ apiKey }).index({
  host,
  name,
  namespace,
});
