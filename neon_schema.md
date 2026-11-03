CREATE SCHEMA "public";
CREATE ROLE "cloud_admin" WITH SUPERUSER CREATEDB CREATEROLE LOGIN REPLICATION BYPASSRLS;
CREATE ROLE "neon_service" WITH CREATEDB CREATEROLE LOGIN REPLICATION BYPASSRLS;
CREATE ROLE "neon_superuser" WITH CREATEDB CREATEROLE REPLICATION BYPASSRLS;
CREATE ROLE "neondb_owner" WITH CREATEDB CREATEROLE LOGIN REPLICATION BYPASSRLS;
CREATE ROLE "pg_checkpoint";
CREATE ROLE "pg_create_subscription";
CREATE ROLE "pg_database_owner";
CREATE ROLE "pg_execute_server_program";
CREATE ROLE "pg_maintain";
CREATE ROLE "pg_monitor";
CREATE ROLE "pg_read_all_data";
CREATE ROLE "pg_read_all_settings";
CREATE ROLE "pg_read_all_stats";
CREATE ROLE "pg_read_server_files";
CREATE ROLE "pg_signal_autovacuum_worker";
CREATE ROLE "pg_signal_backend";
CREATE ROLE "pg_stat_scan_tables";
CREATE ROLE "pg_use_reserved_connections";
CREATE ROLE "pg_write_all_data";
CREATE ROLE "pg_write_server_files";
CREATE ROLE "token_roles";
GRANT INSERT ON "portfolio_daily_stats" TO "neondb_owner" WITH GRANT OPTION;
GRANT TRIGGER ON "portfolio_daily_stats" TO "neondb_owner" WITH GRANT OPTION;
GRANT REFERENCES ON "portfolio_daily_stats" TO "neondb_owner" WITH GRANT OPTION;
GRANT TRUNCATE ON "portfolio_daily_stats" TO "neondb_owner" WITH GRANT OPTION;
GRANT DELETE ON "portfolio_daily_stats" TO "neondb_owner" WITH GRANT OPTION;
GRANT UPDATE ON "portfolio_daily_stats" TO "neondb_owner" WITH GRANT OPTION;
GRANT SELECT ON "portfolio_daily_stats" TO "neondb_owner" WITH GRANT OPTION;
GRANT INSERT ON "portfolio_page_views" TO "neondb_owner" WITH GRANT OPTION;
GRANT SELECT ON "portfolio_page_views" TO "neondb_owner" WITH GRANT OPTION;
GRANT UPDATE ON "portfolio_page_views" TO "neondb_owner" WITH GRANT OPTION;
GRANT DELETE ON "portfolio_page_views" TO "neondb_owner" WITH GRANT OPTION;
GRANT TRUNCATE ON "portfolio_page_views" TO "neondb_owner" WITH GRANT OPTION;
GRANT REFERENCES ON "portfolio_page_views" TO "neondb_owner" WITH GRANT OPTION;
GRANT TRIGGER ON "portfolio_page_views" TO "neondb_owner" WITH GRANT OPTION;
GRANT INSERT ON "portfolio_visitor_stats" TO "neondb_owner" WITH GRANT OPTION;
GRANT SELECT ON "portfolio_visitor_stats" TO "neondb_owner" WITH GRANT OPTION;
GRANT UPDATE ON "portfolio_visitor_stats" TO "neondb_owner" WITH GRANT OPTION;
GRANT DELETE ON "portfolio_visitor_stats" TO "neondb_owner" WITH GRANT OPTION;
GRANT TRUNCATE ON "portfolio_visitor_stats" TO "neondb_owner" WITH GRANT OPTION;
GRANT REFERENCES ON "portfolio_visitor_stats" TO "neondb_owner" WITH GRANT OPTION;
GRANT TRIGGER ON "portfolio_visitor_stats" TO "neondb_owner" WITH GRANT OPTION;
GRANT INSERT ON "portfolio_visitors" TO "neondb_owner" WITH GRANT OPTION;
GRANT TRIGGER ON "portfolio_visitors" TO "neondb_owner" WITH GRANT OPTION;
GRANT REFERENCES ON "portfolio_visitors" TO "neondb_owner" WITH GRANT OPTION;
GRANT TRUNCATE ON "portfolio_visitors" TO "neondb_owner" WITH GRANT OPTION;
GRANT DELETE ON "portfolio_visitors" TO "neondb_owner" WITH GRANT OPTION;
GRANT UPDATE ON "portfolio_visitors" TO "neondb_owner" WITH GRANT OPTION;
GRANT SELECT ON "portfolio_visitors" TO "neondb_owner" WITH GRANT OPTION;
CREATE TABLE "portfolio_page_views" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "portfolio_page_views_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"visitor_id" uuid NOT NULL,
	"page_path" text DEFAULT '/' NOT NULL,
	"referrer_host" text,
	"viewed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "portfolio_page_views_path_length" CHECK (((char_length(page_path) >= 1) AND (char_length(page_path) <= 512))),
	CONSTRAINT "portfolio_page_views_referrer_length" CHECK (((referrer_host IS NULL) OR (char_length(referrer_host) <= 255)))
);
CREATE TABLE "portfolio_visitors" (
	"visitor_id" uuid PRIMARY KEY,
	"first_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX "idx_portfolio_page_views_path" ON "portfolio_page_views" ("page_path");
CREATE INDEX "idx_portfolio_page_views_viewed_at" ON "portfolio_page_views" ("viewed_at");
CREATE INDEX "idx_portfolio_page_views_visitor" ON "portfolio_page_views" ("visitor_id");
CREATE INDEX "idx_portfolio_page_views_visitor_time" ON "portfolio_page_views" ("visitor_id","viewed_at");
CREATE UNIQUE INDEX "portfolio_page_views_pkey" ON "portfolio_page_views" ("id");
CREATE UNIQUE INDEX "portfolio_visitors_pkey" ON "portfolio_visitors" ("visitor_id");
ALTER TABLE "portfolio_page_views" ADD CONSTRAINT "portfolio_page_views_visitor_id_fkey" FOREIGN KEY ("visitor_id") REFERENCES "portfolio_visitors"("visitor_id");
CREATE VIEW "portfolio_daily_stats" TABLESPACE public AS (SELECT (viewed_at AT TIME ZONE 'Asia/Kolkata'::text)::date AS day, count(DISTINCT visitor_id) AS unique_visitors, count(*) AS page_views FROM portfolio_page_views WHERE viewed_at >= (now() - '30 days'::interval) GROUP BY ((viewed_at AT TIME ZONE 'Asia/Kolkata'::text)::date));
CREATE VIEW "portfolio_visitor_stats" TABLESPACE public AS (WITH time_bounds AS ( SELECT (date_trunc('day'::text, (now() AT TIME ZONE 'Asia/Kolkata'::text)) AT TIME ZONE 'Asia/Kolkata'::text) AS start_today ) SELECT ( SELECT count(*) AS count FROM portfolio_visitors) AS total_unique_visitors, ( SELECT count(*) AS count FROM portfolio_page_views) AS total_page_views, ( SELECT count(DISTINCT pv.visitor_id) AS count FROM portfolio_page_views pv CROSS JOIN time_bounds tb WHERE pv.viewed_at >= tb.start_today) AS unique_visitors_today, ( SELECT count(*) AS count FROM portfolio_page_views pv CROSS JOIN time_bounds tb WHERE pv.viewed_at >= tb.start_today) AS page_views_today, ( SELECT max(portfolio_page_views.viewed_at) AS max FROM portfolio_page_views) AS last_page_view_at);