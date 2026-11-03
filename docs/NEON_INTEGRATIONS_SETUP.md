# Neon, Pinecone, Cal.com and Vercel setup

This guide covers the portfolio backend integrations. Do not commit any real credentials to Git.

## 1. Neon PostgreSQL

The production Neon project and visitor analytics schema already exist.

In Neon Console, select project **frpboy**, branch **production**, database **neondb**. Open **Connect** and copy the pooled connection string for the production environment. Add it as the secret environment variable:

- `DATABASE_URL`

Use the pooled connection string for the Next.js serverless runtime. Never use a `NEXT_PUBLIC_` prefix for database credentials.

The Vercel Functions in this project are pinned to `sin1` (Singapore) to stay close to the Neon AWS Asia Pacific 1 region.

## 2. Apply the additional SQL migration

Open Neon SQL Editor on the same production branch/database and execute the complete file:

`database/migrations/002_portfolio_integrations.sql`

It adds:
- knowledge-source ingestion status and source metadata;
- a per-hour assistant rate-limit table and atomic function;
- a Cal.com booking-event table with webhook idempotency.

The initial visitor tables and views are not recreated or modified.

## 3. Neon AI Gateway

In Neon Console, keep the **production** branch selected. Use **Connect → AI Gateway** and create a credential scoped to AI Gateway invocation (`ai_gateway:invoke`). Copy the credential immediately; it is a secret.

Add these server-only Vercel variables:
- `NEON_AI_GATEWAY_BASE_URL` — copy the exact base URL shown in Neon’s AI Gateway connection snippet (preserve any path segment).
- `NEON_AI_GATEWAY_TOKEN` — the generated credential.
- `NEON_CHAT_MODEL=gpt-5-mini`
- `NEON_EMBEDDING_MODEL=qwen3-embedding-0-6b`

The selected embedding model produces 1,024-dimensional vectors. Do not change it without also changing the Pinecone index dimension and re-indexing all knowledge sources.

## 4. Pinecone RAG index

Create a Pinecone serverless index with:
- Name: `frpboy-portfolio-knowledge`
- Vector type: dense
- Dimensions: `1024`
- Metric: cosine
- Namespace used by this app: `portfolio`

Choose the closest region available to the Singapore Vercel/Neon runtime. Once the index is ready, copy its HTTPS index host and create an API key with access to that index.

Add:
- `PINECONE_API_KEY` — secret API key.
- `PINECONE_INDEX_HOST` — the exact index host from Pinecone, without any path.
- `PINECONE_INDEX_NAME=frpboy-portfolio-knowledge`
- `PINECONE_NAMESPACE=portfolio`

The application uses Pinecone's server-side data-plane REST endpoints. The index must be 1,024 dimensions and compatible with dense cosine similarity.

## 5. Protect ingestion and assistant requests

Generate two independent high-entropy secrets (at least 32 random bytes each) and add:
- `KNOWLEDGE_INGEST_TOKEN`
- `PORTFOLIO_RATE_LIMIT_SECRET`

The first protects `POST /api/knowledge/ingest`. The second salts the hourly rate-limit key. Raw visitor IP addresses are not stored by the assistant.

The assistant is limited to 12 questions per client hash per hour. This is an abuse-control baseline, not a substitute for a full WAF/rate-limit service.

## 6. Cal.com

Create a Cal.com event type, for example a 30-minute introductory call. Copy the public booking link and add:

- `CALCOM_BOOKING_URL`

The portfolio contact section and `/book` route will then show a scheduling link.

To persist booking lifecycle events in Neon, create a Cal.com webhook:
- Subscriber URL: `https://www.frpboy.in/api/webhooks/calcom`
- Events: booking created, booking cancelled, booking rescheduled (and any other events you need)
- Set a strong webhook secret and copy it to `CALCOM_WEBHOOK_SECRET`

Cal.com sends `X-Cal-Signature-256`; the endpoint validates the HMAC-SHA256 signature against the exact raw body before persisting the event. Duplicate deliveries are ignored.

## 7. Vercel environment variables

Open Vercel → **frpboy-portfolio** → Settings → Environment Variables.

Add all required values as **Sensitive** secrets where appropriate. Target **Production**, **Preview**, and **Development**. For development, use a separate Neon development branch/database if you do not want local or preview activity written into production.

Never add credentials to `.env.example` values or commit `.env.local`.

After adding the values, redeploy the Preview branch, then Production after the pull request is reviewed and merged.

## 8. Index portfolio knowledge

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

The route chunks text, generates embeddings with Neon AI Gateway, and upserts the vectors into Pinecone. Re-ingesting the same source URL replaces its old vectors.

Only index content suitable for public visitors. Do not include private client data, credentials, personal contact details beyond those already intentionally public, or private source code.

## 9. Smoke tests

After environment variables and the migration are present:

- `GET https://www.frpboy.in/api/visitors` returns visitor analytics totals.
- Visit the portfolio and a second route; the Neon `portfolio_page_views` table should contain those paths.
- `POST /api/knowledge/ingest` with the bearer token returns `sourceId` and `chunkCount`.
- The portfolio assistant should answer questions grounded in the retrieved sources.
- `/book` should open the configured Cal.com event.
- A Cal.com test booking should appear in `portfolio_booking_events`.

## 10. Service boundaries

- Neon PostgreSQL, Neon AI Gateway, Pinecone and Cal.com are used by the application once their credentials and configuration are supplied.
- Neon Object Storage is already provisioned in the Neon project but this code does not yet upload documents into it; the first RAG path accepts curated text and indexes it in Pinecone.
- Neon Realtime is provisioned but not yet used for a live admin analytics screen.
- Better Auth remains intentionally unconfigured; anonymous visitor analytics and public portfolio chat do not require user accounts.
- Next.js Route Handlers execute as Vercel Functions, so the separately provisioned Neon Functions service is not required by this deployment.
