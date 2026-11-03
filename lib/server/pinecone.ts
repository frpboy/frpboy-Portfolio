type PineconeDocument = {
  _id: string;
  title: string;
  chunk_text: string;
  sourceId: string;
  sourceVersion: string;
  sourceUrl: string;
  sourceType: string;
  chunkIndex: number;
};

export type PineconeMatch = {
  _id: string;
  _score?: number;
  title?: string;
  chunk_text?: string;
  sourceId?: string;
  sourceVersion?: string;
  sourceUrl?: string;
  sourceType?: string;
};

type PineconeSearchResponse = {
  matches?: PineconeMatch[];
  usage?: {
    embed_total_tokens?: number;
  };
};

function getPineconeConfig() {
  const apiKey = process.env.PINECONE_API_KEY;
  const rawHost = process.env.PINECONE_INDEX_HOST;

  if (!apiKey || !rawHost) {
    throw new Error("Pinecone is not configured");
  }

  const host = rawHost.startsWith("https://") ? rawHost : `https://${rawHost}`;
  const parsed = new URL(host);

  if (
    parsed.protocol !== "https:" ||
    !parsed.hostname.endsWith(".pinecone.io") ||
    parsed.pathname !== "/" ||
    parsed.search ||
    parsed.hash
  ) {
    throw new Error("PINECONE_INDEX_HOST must be the HTTPS host only, without a path");
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
      "X-Pinecone-API-Version": "2026-07",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
  });

  if (response.status === 204) return {} as T;

  const raw = await response.text();
  let payload: unknown = null;

  if (raw) {
    try {
      payload = JSON.parse(raw);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const detail =
      payload && typeof payload === "object" && "message" in payload
        ? String((payload as { message?: unknown }).message ?? "")
        : raw.slice(0, 300);

    throw new Error(
      `Pinecone Documents API returned HTTP ${response.status}${detail ? `: ${detail}` : ""}`,
    );
  }

  return (payload ?? {}) as T;
}

/**
 * Pinecone's integrated embedding field accepts query text. Pinecone embeds
 * the question with the same model used when the source chunks were upserted.
 */
export async function searchKnowledge(query: string): Promise<PineconeMatch[]> {
  const { namespace } = getPineconeConfig();
  const encodedNamespace = encodeURIComponent(namespace);

  const payload = await pineconeRequest<PineconeSearchResponse>(
    `/namespaces/${encodedNamespace}/documents/search`,
    {
      score_by: [
        {
          type: "embed",
          field: "chunk_text",
          query,
        },
      ],
      top_k: 6,
      include_fields: ["title", "chunk_text", "sourceId", "sourceVersion", "sourceUrl", "sourceType"],
    },
  );

  return payload.matches ?? [];
}

/**
 * Delete only documents belonging to the source being re-indexed.
 * Pinecone applies document deletion asynchronously.
 */
export async function deleteKnowledgeSource(sourceId: string): Promise<void> {
  const { namespace } = getPineconeConfig();
  const encodedNamespace = encodeURIComponent(namespace);

  await pineconeRequest(
    `/namespaces/${encodedNamespace}/documents/delete`,
    {
      filter: { sourceId: { $eq: sourceId } },
    },
  );
}

/**
 * Upsert integrated-embedding documents. Pinecone embeds chunk_text itself.
 * Integrated embedding limits each request to 96 documents.
 */
export async function upsertKnowledgeDocuments(
  documents: PineconeDocument[],
): Promise<void> {
  if (documents.length === 0) return;

  const { namespace } = getPineconeConfig();
  const encodedNamespace = encodeURIComponent(namespace);

  for (let offset = 0; offset < documents.length; offset += 96) {
    await pineconeRequest(
      `/namespaces/${encodedNamespace}/documents/upsert`,
      {
        documents: documents.slice(offset, offset + 96),
      },
    );
  }
}
