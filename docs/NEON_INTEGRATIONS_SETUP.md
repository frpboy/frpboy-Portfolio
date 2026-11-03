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

## 3. Neon Object Storage

Create a **private** bucket on the same Neon production branch, named `portfolio-knowledge` (or set the chosen name in `NEON_OBJECT_STORAGE_BUCKET`). The ingestion endpoint stores the original submitted text at `knowledge/{sourceId}/source.txt`; it does not expose the bucket to browsers.

Create a branch-scoped Neon credential with the `storage:write` scope. In Neon, this credential maps to S3 Access Key ID and Secret Access Key values. Copy the branch endpoint and signing region from the Object Storage Connect panel, then add these Vercel server-only variables:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_ENDPOINT_URL_S3`
- `AWS_REGION`
- `NEON_OBJECT_STORAGE_BUCKET=portfolio-knowledge`

The app signs path-style S3 requests and uploads the original source before embedding it. Keep the bucket private; do not enable public-read for RAG source material.

## 4. Neon AI Gateway

In Neon Console, keep the **production** branch selected. Use **Connect → AI Gateway** and create a credential scoped to AI Gateway invocation (`ai_gateway:invoke`). Copy the credential immediately; it is a secret.

**Plan gate:** the Neon project currently shown in the Console is on the Free plan. Neon’s current AI Gateway availability is restricted to Launch and Scale plans and uses prepaid credits. If the Console keeps showing “Upgrade to access AI models”, the gateway credential cannot be created on this plan. Either upgrade and add credits, or replace the gateway adapter with an alternative model provider before enabling the assistant. Do not add fake or placeholder credentials to Vercel.

Add these server-only Vercel variables:
- `NEON_AI_GATEWAY_BASE_URL` — copy the exact base URL shown in Neon’s AI Gateway connection snippet (preserve any path segment).
- `NEON_AI_GATEWAY_TOKEN` — the generated credential.
- `NEON_CHAT_MODEL=gpt-5-mini`
- `NEON_EMBEDDING_MODEL=qwen3-embedding-0-6b`

The selected embedding model produces 1,024-dimensional vectors. Do not change it without also changing the Pinecone index dimension and re-indexing all knowledge sources.

## 5. Pinecone RAG index

The portfolio backend currently generates embeddings outside Pinecone using `NEON_EMBEDDING_MODEL` and sends the resulting vectors to Pinecone's vector upsert/query endpoints. Create a **classic dense vector index with Bring Your Own Vectors**. Do not create an integrated-embedding/schema index that embeds `chunk_text` with Pinecone's hosted `llama-text-embed-v2` model; those are a different ingestion/search path and are not compatible with the current code.

Required configuration:
- Name: `frpboy-portfolio-knowledge`
- Vector type: dense
- Dimensions: `1024`
- Metric: cosine
- Capacity: serverless
- Read capacity: on-demand
- Namespace used by this app: `portfolio`

### Region and Starter-plan limit

Pinecone Starter currently includes AWS `us-east-1` only, up to five indexes, and 2 GB storage. The Singapore region (`ap-southeast-1`) is available on Builder ($20/month flat) and higher plans. The screenshot's **Upgrade to continue** message is caused by selecting Singapore, not by the three existing indexes.

For a no-subscription setup, use AWS `us-east-1`. If you deliberately choose Builder to keep Pinecone in Singapore, use `ap-southeast-1` instead. The current Vercel/Neon runtime is in Singapore, so the Starter option trades some cross-region latency for no monthly Pinecone plan charge.

### Create the Bring Your Own Vectors index

If the Console form only offers a schema field with Pinecone's hosted embedding model, cancel that form rather than creating the wrong index type. Use the Pinecone project API key and the documented index-creation API instead. This creates the exact classic vector index required by the application.

PowerShell example (the API key is entered as a hidden prompt and is not placed in command history):

```powershell
$secure = Read-Host "Pinecone API key" -AsSecureString
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)

try {
    $apiKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
    $headers = @{
        "Api-Key" = $apiKey
        "X-Pinecone-API-Version" = "2025-10"
        "Accept" = "application/json"
    }

    $name = "frpboy-portfolio-knowledge"
    $uri = "https://api.pinecone.io/indexes/$name"

    try {
        $index = Invoke-RestMethod -Method Get -Uri $uri -Headers $headers
        Write-Host "Index already exists; it was not modified."
    }
    catch {
        $status = 0
        if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
            $status = [int]$_.Exception.Response.StatusCode
        }
        if ($status -ne 404) { throw }

        $body = @{
            name = $name
            vector_type = "dense"
            dimension = 1024
            metric = "cosine"
            spec = @{
                serverless = @{
                    cloud = "aws"
                    region = "us-east-1"
                }
            }
            deletion_protection = "disabled"
            tags = @{
                application = "frpboy-portfolio"
                environment = "production"
            }
        } | ConvertTo-Json -Depth 8

        $index = Invoke-RestMethod -Method Post -Uri "https://api.pinecone.io/indexes" -Headers $headers -ContentType "application/json" -Body $body
        Write-Host "Created the Pinecone index."
    }

    $deadline = (Get-Date).AddMinutes(3)
    while (-not $index.status.ready -and (Get-Date) -lt $deadline) {
        Start-Sleep -Seconds 3
        $index = Invoke-RestMethod -Method Get -Uri $uri -Headers $headers
    }
    if (-not $index.status.ready) {
        throw "Pinecone index is not READY yet. Check its status in the Pinecone Console and rerun the script."
    }
    $index | Select-Object name, host, dimension, metric, status | Format-List
    Write-Host "Save the host value as PINECONE_INDEX_HOST in Vercel."
}
finally {
    if ($ptr -ne [IntPtr]::Zero) {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
    }
    $apiKey = $null
    $headers = $null
    $secure.Dispose()
}
```

If you choose the paid Singapore region, change the script's `region` value to `ap-southeast-1`.

Once the index exists, create or use a Pinecone project API key and configure these server-only Vercel variables:
- `PINECONE_API_KEY` — secret API key.
- `PINECONE_INDEX_HOST` — the returned HTTPS index host, without any path.
- `PINECONE_INDEX_NAME=frpboy-portfolio-knowledge`
- `PINECONE_NAMESPACE=portfolio`

The index dimension and metric must match the embedding model used for both ingestion and querying. Do not change the embedding model without re-indexing all knowledge sources.

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

Cal.com sends `X-Cal-Signature-256`; the endpoint validates the HMAC-SHA256 signature against the exact raw body before persisting the event. Duplicate deliveries are ignored.

## 8. Vercel environment variables

Open Vercel → **frpboy-portfolio** → Settings → Environment Variables.

Add all required values as **Sensitive** secrets where appropriate. Target **Production**, **Preview**, and **Development**. For development, use a separate Neon development branch/database if you do not want local or preview activity written into production.

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

The route chunks text, generates embeddings with Neon AI Gateway, and upserts the vectors into Pinecone. Re-ingesting the same source URL replaces its old vectors.

Only index content suitable for public visitors. Do not include private client data, credentials, personal contact details beyond those already intentionally public, or private source code.

## 10. Smoke tests

After environment variables and the migration are present:

- `GET https://www.frpboy.in/api/visitors` returns visitor analytics totals.
- Visit the portfolio and a second route; the Neon `portfolio_page_views` table should contain those paths.
- `POST /api/knowledge/ingest` with the bearer token returns `sourceId` and `chunkCount`.
- The portfolio assistant should answer questions grounded in the retrieved sources.
- `/book` should open the configured Cal.com event.
- A Cal.com test booking should appear in `portfolio_booking_events`.

## 11. Service boundaries

- Neon PostgreSQL, Neon AI Gateway, Pinecone and Cal.com are used by the application once their credentials and configuration are supplied.
- Neon Object Storage stores the original source text in a private bucket; Pinecone stores the searchable vector chunks.
- Neon Realtime is provisioned but not yet used for a live admin analytics screen.
- Better Auth remains intentionally unconfigured; anonymous visitor analytics and public portfolio chat do not require user accounts.
- Next.js Route Handlers execute as Vercel Functions, so the separately provisioned Neon Functions service is not required by this deployment.
