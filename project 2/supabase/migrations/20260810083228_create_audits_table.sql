/*
# Create audits table for URL audit analytics

1. New Tables
- `audits` — stores results of URL audits performed by users
  - `id` (uuid, primary key)
  - `url` (text, not null) — the audited URL
  - `overall_score` (integer) — 0-100 overall audit score
  - `seo_score` (integer) — 0-100 SEO category score
  - `social_score` (integer) — 0-100 social meta score
  - `ai_readiness_score` (integer) — 0-100 AI readiness score (the moat metric)
  - `accessibility_score` (integer) — 0-100 accessibility score
  - `title` (text, nullable) — page title found during audit
  - `has_structured_data` (boolean) — whether JSON-LD was detected
  - `has_llms_txt` (boolean, nullable) — whether llms.txt was found
  - `word_count` (integer) — body content word count
  - `created_at` (timestamptz, default now)

2. Security
- Enable RLS on `audits`.
- Allow anon + authenticated INSERT only (users submit audits but cannot read others' data).
- Allow anon + authenticated SELECT for aggregate analytics only via a future function.
- For now, INSERT-only to prevent reading other users' audit URLs.

3. Notes
- This table is write-heavy (every audit creates a row) and read-light (analytics only).
- No user_id column — this is a no-auth public tool. Audits are anonymous.
- The edge function uses the service role key to insert, bypassing RLS.
*/

CREATE TABLE IF NOT EXISTS audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  overall_score integer NOT NULL DEFAULT 0,
  seo_score integer NOT NULL DEFAULT 0,
  social_score integer NOT NULL DEFAULT 0,
  ai_readiness_score integer NOT NULL DEFAULT 0,
  accessibility_score integer NOT NULL DEFAULT 0,
  title text,
  has_structured_data boolean NOT NULL DEFAULT false,
  has_llms_txt boolean,
  word_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audits_created_at ON audits (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audits_url ON audits (url);

ALTER TABLE audits ENABLE ROW LEVEL SECURITY;

-- Allow anon to insert (edge function uses service role, but anon path is available too)
DROP POLICY IF EXISTS "anon_insert_audits" ON audits;
CREATE POLICY "anon_insert_audits"
ON audits FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- No SELECT policy: audit data is private, only accessible via service role for analytics
