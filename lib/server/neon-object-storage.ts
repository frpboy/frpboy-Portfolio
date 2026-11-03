import { AwsClient } from "aws4fetch";

let s3Client: AwsClient | undefined;

function getObjectStorageConfig() {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const endpointValue = process.env.AWS_ENDPOINT_URL_S3;
  const region = process.env.AWS_REGION;
  const bucket = process.env.NEON_OBJECT_STORAGE_BUCKET;

  if (!accessKeyId || !secretAccessKey || !endpointValue || !region || !bucket) {
    throw new Error("Neon Object Storage is not fully configured");
  }

  const endpoint = new URL(endpointValue);
  if (endpoint.protocol !== "https:") {
    throw new Error("AWS_ENDPOINT_URL_S3 must use HTTPS");
  }

  return {
    accessKeyId,
    secretAccessKey,
    endpoint: endpoint.toString().replace(/\/+$/, ""),
    region,
    bucket,
  };
}

function getS3Client(config: ReturnType<typeof getObjectStorageConfig>) {
  s3Client ??= new AwsClient({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    service: "s3",
    region: config.region,
    retries: 2,
  });

  return s3Client;
}

/**
 * Save the original source text in a private Neon Object Storage bucket.
 * Neon Object Storage is S3-compatible and requires path-style requests.
 */
export async function storeKnowledgeSource(
  sourceId: string,
  content: string,
): Promise<string> {
  const config = getObjectStorageConfig();
  const key = `knowledge/${sourceId}/source.txt`;
  const encodedKey = key.split("/").map(encodeURIComponent).join("/");
  const url = `${config.endpoint}/${encodeURIComponent(config.bucket)}/${encodedKey}`;

  const response = await getS3Client(config).fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "private, no-store",
    },
    body: content,
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    const detail = (await response.text().catch(() => "")).slice(0, 300);
    throw new Error(
      `Neon Object Storage returned HTTP ${response.status}${detail ? `: ${detail}` : ""}`,
    );
  }

  return key;
}
