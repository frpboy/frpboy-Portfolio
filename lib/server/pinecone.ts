type PineconeMatch = {
  id: string;
  score?: number;
  metadata?: Record<string, unknown>;
};

type PineconeQueryResponse = {
  matches?: PineconeMatch[];
};

function getPineconeConfig() {
  const apiKey = process.env.PINECONE_API_KEY;
  const rawHost = process.env.PINECONE_INDEX_HOST;

  if (!apiKey || !rawHost) {
    throw new Error("Pinecone is not configured");
  }

  const host = rawHost.startsWith("https://") ? rawHost : `https://${rawHost}`;
  const parsed = new URL(host);
  if (parsed.protocol !== "https:" || !parsed.hostname.endsWith(".pinecone.io")) {
    throw new Error("PINECONE_INDEX_HOST must be a valid Pinecone HTTPS index host");
  }

  return {
    apiKey,
    baseUrl: parsed.origin,
    namespace: process.env.PINECONE_NAMESPACE || "portfolio",
  };
}

async function pineconeRequest<T>(path: string, body: unknown): Promise<T> {
  const { apiKey, baseUrl } = getPineconeConfig();
  const response = await fetch(new URL(path, baseUrl), {
    method: "POST",
    headers: {
      "Api-Key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(25_000),
  });

  const payload = (await response.json().catch(() => null)) as T | null;
  if (!response.ok || !payload) {
    throw new Error(`Pinecone returned HTTP ${response.status}`);
  }

  return payload;
}

export async function searchKnowledge(embedding: number[]): Promise<PineconeMatch[]> {
  const { namespace } = getPineconeConfig();
  const payload = await pineconeRequest<PineconeQueryResponse>("/query", {
    namespace,
    vector: embedding,
    topK: 6,
    includeMetadata: true,
  });

  return (payload.matches ?? []).filter(
    (match) => typeof match.score === "number" && match.score >= 0.25,
  );
}

export async function deleteKnowledgeSource(sourceId: string): Promise<void> {
  const { namespace } = getPineconeConfig();
  await pineconeRequest("/vectors/delete", {
    namespace,
    filter: { sourceId: { $eq: sourceId } },
  });
}

export async function upsertKnowledgeVectors(
  vectors: Array<{
    id: string;
    values: number[];
    metadata: Record<string, string | number>;
  }>,
): Promise<void> {
  const { namespace } = getPineconeConfig();

  for (let offset = 0; offset < vectors.length; offset += 100) {
    await pineconeRequest("/vectors/upsert", {
      namespace,
      vectors: vectors.slice(offset, offset + 100),
    });
  }
}
