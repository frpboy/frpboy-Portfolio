import { neon } from "@neondatabase/serverless";

let client: ReturnType<typeof neon> | undefined;

/**
 * Lazily create the Neon HTTP SQL client so a deployment can still build
 * without production secrets configured. Requests fail with a clear 503 at
 * runtime until DATABASE_URL has been added to the deployment environment.
 */
export function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured");
  }

  client ??= neon(connectionString);
  return client;
}
