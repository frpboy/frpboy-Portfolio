BEGIN;

-- Knowledge sources are indexed into Pinecone; Neon stores source metadata and
-- ingestion state so re-indexing is traceable and idempotent.
CREATE TABLE IF NOT EXISTS public.portfolio_knowledge_sources (
    source_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    source_url TEXT NOT NULL UNIQUE,
    source_type TEXT NOT NULL DEFAULT 'portfolio',
    status TEXT NOT NULL DEFAULT 'pending',
    chunk_count INTEGER NOT NULL DEFAULT 0,
    last_indexed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT portfolio_knowledge_status_check
      CHECK (status IN ('pending', 'processing', 'ready', 'failed')),
    CONSTRAINT portfolio_knowledge_chunk_count_check
      CHECK (chunk_count >= 0)
);

CREATE INDEX IF NOT EXISTS idx_portfolio_knowledge_sources_status
    ON public.portfolio_knowledge_sources(status, updated_at DESC);

-- Rate-limit keys are salted hashes, never raw IP addresses.
CREATE TABLE IF NOT EXISTS public.portfolio_ai_rate_limits (
    rate_key TEXT NOT NULL,
    window_start TIMESTAMPTZ NOT NULL,
    request_count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (rate_key, window_start),
    CONSTRAINT portfolio_ai_rate_limit_count_check CHECK (request_count >= 0)
);

CREATE INDEX IF NOT EXISTS idx_portfolio_ai_rate_limits_window
    ON public.portfolio_ai_rate_limits(window_start);

CREATE OR REPLACE FUNCTION public.consume_portfolio_ai_rate_limit(
    p_rate_key TEXT,
    p_limit INTEGER DEFAULT 12
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_window_start TIMESTAMPTZ := DATE_TRUNC('hour', NOW());
    v_request_count INTEGER;
BEGIN
    IF p_rate_key IS NULL OR LENGTH(p_rate_key) <> 64 THEN
        RAISE EXCEPTION 'Invalid rate limit key';
    END IF;

    IF p_limit < 1 OR p_limit > 100 THEN
        RAISE EXCEPTION 'Invalid rate limit threshold';
    END IF;

    INSERT INTO public.portfolio_ai_rate_limits (
        rate_key,
        window_start,
        request_count
    )
    VALUES (
        p_rate_key,
        v_window_start,
        1
    )
    ON CONFLICT (rate_key, window_start)
    DO UPDATE SET
        request_count = public.portfolio_ai_rate_limits.request_count + 1
    RETURNING request_count INTO v_request_count;

    RETURN v_request_count <= p_limit;
END;
$$;

-- Booking webhooks are idempotent by a hash of their exact signed body.
CREATE TABLE IF NOT EXISTS public.portfolio_booking_events (
    event_id TEXT PRIMARY KEY,
    booking_uid TEXT NOT NULL,
    event_type TEXT NOT NULL,
    booking_payload JSONB NOT NULL,
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_booking_events_booking
    ON public.portfolio_booking_events(booking_uid, received_at DESC);

CREATE INDEX IF NOT EXISTS idx_portfolio_booking_events_received
    ON public.portfolio_booking_events(received_at DESC);

COMMIT;
