# Neon, Pinecone, Cal.com and Vercel setup

This guide covers the portfolio backend integrations. Do not commit any real credentials to Git.

## 1. Neon PostgreSQL

The production Neon project is provisioned. The visitor analytics tables and views were initially created in Neon SQL Editor; the same schema is now captured in a repeatable, idempotent migration for fresh branches.

In Neon Console, select project **frpboy**, branch **production**, database **neondb**. Open **Connect** and copy the pooled connection string for the production environment. Add it as the secret environment variable:

- `DATABASE_URL`

Use the pooled connection string for the Next.js serverless runtime. Never use a `NEXT_PUBLIC_` prefix for database credentials.

The Vercel Functions in this project are pinned to `sin1` (Singapore) to stay close to the Neon AWS Asia Pacific 1 region.

## 2. Apply the versioned SQL migrations

Open Neon SQL Editor on the target branch/database and execute these files in order:

1. `database/migrations/001_visitor_analytics.sql` — visitor identities, page views, indexes, `record_portfolio_page_view()`, and IST aggregate views.
2. `database/migrations/002_portfolio_integrations.sql` — knowledge-source metadata and active version, per-hour assistant rate limiting, and Cal.com booking-event storage.

The first migration uses `IF NOT EXISTS` for tables/indexes and `CREATE OR REPLACE` for views/functions, so it can also be applied to the production database where the original SQL was pasted manually. Always apply both migrations to a new Preview/Development Neon branch before using it.

## 3. Neon Object Storage

Create a **private** bucket on the same Neon production branch, named `portfolio-knowledge` (or set the chosen name in `NEON_OBJECT_STORAGE_BUCKET`). The ingestion endpoint stores each import attempt at a unique key, `knowledge/{sourceId}/{sourceVersion}/source.txt`; it does not expose the bucket to browsers.

Create a branch-scoped Neon credential with the `storage:write` scope. In Neon, this credential maps to S3 Access Key ID and Secret Access Key values. Copy the branch endpoint and signing region from the Object Storage Connect panel, then add these Vercel server-only variables:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_ENDPOINT_URL_S3`
- `AWS_REGION`
- `NEON_OBJECT_STORAGE_BUCKET=portfolio-knowledge`

The app signs path-style S3 requests and uploads the original source before indexing it. Each import gets a unique archive key; the previous active source remains available until the replacement is fully indexed. Keep the bucket private; do not enable public-read for RAG source material.

## 4. Neon AI Gateway

The portfolio uses Neon AI Gateway only to generate the assistant's final answer. Pinecone performs both document and query embedding itself through the integrated `llama-text-embed-v2` model, so an embedding endpoint or `NEON_EMBEDDING_MODEL` variable is not required.

In Neon Console, keep the **production** branch selected. Use **Connect → AI Gateway** and create a credential scoped to AI Gateway invocation (`ai_gateway:invoke`). Copy the credential immediately; it is a secret.

**Plan gate:** the Neon project currently shown in the Console is on the Free plan. Neon’s current AI Gateway availability is restricted to Launch and Scale plans and uses prepaid credits. If the Console keeps showing “Upgrade to access AI models”, the gateway credential cannot be created on this plan. The portfolio RAG index and retrieval can still be created and tested through Pinecone Starter, but the final chatbot answer requires a chat model provider. Either upgrade Neon and add credits, or replace the chat adapter with another model provider before enabling public chat. Do not add fake or placeholder credentials to Vercel.

Add these server-only Vercel variables:
- `NEON_AI_GATEWAY_BASE_URL` — copy the exact base URL shown in Neon’s AI Gateway connection snippet (preserve any path segment).
- `NEON_AI_GATEWAY_TOKEN` — the generated credential.
- `NEON_CHAT_MODEL=gpt-5-mini`


## 5. Pinecone RAG index

The current application uses Pinecone's schema-based **Documents API with integrated embedding**. This matches the Pinecone Console form showing `llama-text-embed-v2` on the `chunk_text` field. Pinecone embeds source chunks on upsert and embeds each user question on search, so the app does not send external vectors.

Create the index with exactly these settings:

- Name: `frpboy-portfolio-knowledge`
- Capacity: serverless
- Cloud provider: AWS
- Region: `us-east-1` for the Starter plan
- Read capacity: on-demand
- Schema field `chunk_text`: String, Dense embedding `llama-text-embed-v2`, 1,024 dimensions, cosine metric, Full-text search English
- Schema field `title`: String, Full-text search English
- Namespace used by this app: `portfolio`

The region shown as **Included in the Starter plan** in the Console is the correct no-subscription option. Pinecone Starter uses AWS `us-east-1`; Singapore (`ap-southeast-1`) requires the Builder plan. The Starter plan supports up to five indexes, so the existing three indexes are not a blocker.

Do not remove the `chunk_text` embedding configuration or change its field name. The API code writes and searches that exact field. Keep `title` as a full-text field; source identifiers and URLs are stored as filterable metadata on each document.

### API compatibility

This index is a Documents API index, not a classic vector-only index. The application uses:
- `POST /namespaces/{namespace}/documents/upsert`
- `POST /namespaces/{namespace}/documents/search`
- `POST /namespaces/{namespace}/documents/delete`

The requests include `X-Pinecone-API-Version: 2026-07`. Do not use the vector-only `/vectors/upsert` or `/query` endpoints with this index. Pinecone's integrated embedding model is used on both write and query, keeping the embedding model consistent. <https://docs.pinecone.io/guides/index-data/create-an-index>

Once the index is created and ready, copy its HTTPS host and configure these server-only Vercel variables:
- `PINECONE_API_KEY` — project API key.
- `PINECONE_INDEX_HOST` — exact index host, without a path.
- `PINECONE_INDEX_NAME=frpboy-portfolio-knowledge`
- `PINECONE_NAMESPACE=portfolio`

Never use the index name in place of its host. Do not share the API key or commit it to Git.

## 6. Protect ingestion and assistant requests

Generate two independent high-entropy secrets (at least 32 random bytes each) and add:
- `KNOWLEDGE_INGEST_TOKEN`
- `PORTFOLIO_RATE_LIMIT_SECRET`

The first protects `POST /api/knowledge/ingest`. The second salts the hourly rate-limit key. Raw visitor IP addresses are not stored by the assistant.

The assistant is limited to 12 questions per client hash per hour. This is an abuse-control baseline, not a substitute for a full WAF/rate-limit service.

## 7. Cal.com

Create a Cal.com event type, for example a 30-minute introductory call. Copy the public booking link and add:

- `CALCOM_BOOKING_URL`

The portfolio contact section and `/book` route will then show a scheduling link.

To persist booking lifecycle events in Neon, create a Cal.com webhook:
- Subscriber URL: `https://www.frpboy.in/api/webhooks/calcom`
- Events: booking created, booking cancelled, booking rescheduled (and any other events you need)
- Set a strong webhook secret and copy it to `CALCOM_WEBHOOK_SECRET`

Cal.com sends `X-Cal-Signature-256` as the lowercase hexadecimal HMAC-SHA256 digest of the exact raw request body (without a `sha256=` prefix). The endpoint validates the signature before parsing or persisting the event. Duplicate deliveries are ignored.

## 8. Vercel environment variables

Open Vercel → **frpboy-portfolio** → Settings → Environment Variables.

Add the Production connection string and production provider credentials to the **Production** target only. For **Preview** and **Development**, use a separate Neon branch/database with both migrations applied and configure its own `DATABASE_URL` and branch-scoped Object Storage/AI Gateway credentials. Do not point Preview or Development at the production database: preview visits and test imports would otherwise alter production visitor totals and knowledge-source records.

Never add credentials to `.env.example` values or commit `.env.local`.

After adding the values, redeploy the Preview branch, then Production after the pull request is reviewed and merged.

## 9. Index portfolio knowledge

After deployment and configuration, send curated, public portfolio content to the protected ingest route. Example:

```bash
curl -X POST "https://www.frpboy.in/api/knowledge/ingest" \
  -H "Authorization: Bearer $KNOWLEDGE_INGEST_TOKEN" \
  -H "Content-Type: application/json" \
  --data-binary @portfolio-source.json
```

Example JSON body:

```json
{
  "title": "Portfolio profile and verified experience",
  "sourceUrl": "https://www.frpboy.in/",
  "sourceType": "portfolio",
  "text": "Public, verified portfolio material goes here."
}
```

The route archives each import under a unique source-version key, chunks it, and upserts versioned text documents into Pinecone. Pinecone embeds each chunk with its integrated model. Neon switches the active source version only after the new documents are indexed. The assistant filters Pinecone matches against the active, `ready` version, so stale or partially indexed versions are not used. Old vector versions are retained for now; add a controlled cleanup job before long-term high-volume re-ingestion.

Only index content suitable for public visitors. Do not include private client data, credentials, personal contact details beyond those already intentionally public, or private source code.

## 10. Smoke tests

After environment variables and migrations 001 and 002 are present:

- `GET https://www.frpboy.in/api/visitors` returns visitor analytics totals.
- Visit the portfolio and a second route; the Neon `portfolio_page_views` table should contain those paths.
- `POST /api/knowledge/ingest` with the bearer token returns `sourceId` and `chunkCount`.
- The portfolio assistant should answer questions grounded in the retrieved sources.
- `/book` should open the configured Cal.com event.
- A Cal.com test booking should appear in `portfolio_booking_events`.

## 11. Service boundaries

- Neon PostgreSQL, Neon AI Gateway (chat completions only), Pinecone integrated embedding/retrieval, and Cal.com are used by the application once their credentials and configuration are supplied.
- Neon Object Storage stores the original source text in a private bucket; Pinecone stores the searchable vector chunks.
- Neon Realtime is provisioned but not yet used for a live admin analytics screen.
- Better Auth remains intentionally unconfigured; anonymous visitor analytics and public portfolio chat do not require user accounts.
- Next.js Route Handlers execute as Vercel Functions, so the separately provisioned Neon Functions service is not required by this deployment.
