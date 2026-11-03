BEGIN;

-- Anonymous, first-party visitor identity. This is a browser identifier,
-- not a verified person identity and not a device fingerprint.
CREATE TABLE IF NOT EXISTS public.portfolio_visitors (
    visitor_id UUID PRIMARY KEY,
    first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One event per successfully recorded page view.
CREATE TABLE IF NOT EXISTS public.portfolio_page_views (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    visitor_id UUID NOT NULL
        REFERENCES public.portfolio_visitors(visitor_id),
    page_path TEXT NOT NULL DEFAULT '/',
    referrer_host TEXT,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT portfolio_page_views_path_length
        CHECK (CHAR_LENGTH(page_path) BETWEEN 1 AND 512),
    CONSTRAINT portfolio_page_views_referrer_length
        CHECK (referrer_host IS NULL OR CHAR_LENGTH(referrer_host) <= 255)
);

CREATE INDEX IF NOT EXISTS idx_portfolio_page_views_visitor
    ON public.portfolio_page_views(visitor_id);

CREATE INDEX IF NOT EXISTS idx_portfolio_page_views_viewed_at
    ON public.portfolio_page_views(viewed_at DESC);

CREATE INDEX IF NOT EXISTS idx_portfolio_page_views_path
    ON public.portfolio_page_views(page_path);

CREATE INDEX IF NOT EXISTS idx_portfolio_page_views_visitor_time
    ON public.portfolio_page_views(visitor_id, viewed_at DESC);

-- Atomically upsert a visitor and append one page view.
CREATE OR REPLACE FUNCTION public.record_portfolio_page_view(
    p_visitor_id UUID,
    p_path TEXT DEFAULT '/',
    p_referrer_host TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_now TIMESTAMPTZ := CLOCK_TIMESTAMP();
    v_path TEXT := COALESCE(NULLIF(LEFT(BTRIM(p_path), 512), ''), '/');
    v_referrer TEXT := NULLIF(LEFT(BTRIM(p_referrer_host), 255), '');
BEGIN
    IF p_visitor_id IS NULL THEN
        RAISE EXCEPTION 'Visitor ID cannot be NULL';
    END IF;

    INSERT INTO public.portfolio_visitors (
        visitor_id,
        first_seen_at,
        last_seen_at
    )
    VALUES (p_visitor_id, v_now, v_now)
    ON CONFLICT (visitor_id)
    DO UPDATE SET
        last_seen_at = GREATEST(
            public.portfolio_visitors.last_seen_at,
            EXCLUDED.last_seen_at
        );

    INSERT INTO public.portfolio_page_views (
        visitor_id,
        page_path,
        referrer_host,
        viewed_at
    )
    VALUES (p_visitor_id, v_path, v_referrer, v_now);
END;
$$;

-- Aggregate visitor and page-view totals. Daily boundaries use IST.
CREATE OR REPLACE VIEW public.portfolio_visitor_stats AS
WITH time_bounds AS (
    SELECT (
        DATE_TRUNC('day', NOW() AT TIME ZONE 'Asia/Kolkata')
        AT TIME ZONE 'Asia/Kolkata'
    ) AS start_today
)
SELECT
    (SELECT COUNT(*) FROM public.portfolio_visitors)::BIGINT
        AS total_unique_visitors,
    (SELECT COUNT(*) FROM public.portfolio_page_views)::BIGINT
        AS total_page_views,
    (
        SELECT COUNT(DISTINCT pv.visitor_id)
        FROM public.portfolio_page_views pv
        CROSS JOIN time_bounds tb
        WHERE pv.viewed_at >= tb.start_today
    )::BIGINT AS unique_visitors_today,
    (
        SELECT COUNT(*)
        FROM public.portfolio_page_views pv
        CROSS JOIN time_bounds tb
        WHERE pv.viewed_at >= tb.start_today
    )::BIGINT AS page_views_today,
    (SELECT MAX(viewed_at) FROM public.portfolio_page_views)
        AS last_page_view_at;

CREATE OR REPLACE VIEW public.portfolio_daily_stats AS
SELECT
    (viewed_at AT TIME ZONE 'Asia/Kolkata')::DATE AS day,
    COUNT(DISTINCT visitor_id)::BIGINT AS unique_visitors,
    COUNT(*)::BIGINT AS page_views
FROM public.portfolio_page_views
WHERE viewed_at >= NOW() - INTERVAL '30 days'
GROUP BY 1;

COMMIT;
