-- Run in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS community_listings (
  id            TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  source_url    TEXT        NOT NULL,
  title         TEXT        NOT NULL,
  description   TEXT,
  image_url     TEXT,
  raw_price     TEXT,
  bedrooms      INTEGER,
  neighborhood  TEXT,
  listing_type  TEXT        DEFAULT 'RENT',
  source_domain TEXT,
  submitted_by  TEXT        REFERENCES users(id) ON DELETE SET NULL,
  status        TEXT        DEFAULT 'PENDING',
  views         INTEGER     DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_community_listings_status ON community_listings(status);
CREATE INDEX IF NOT EXISTS idx_community_listings_type ON community_listings(listing_type);
