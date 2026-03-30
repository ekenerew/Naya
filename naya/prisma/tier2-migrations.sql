-- Escrow Transactions
CREATE TABLE IF NOT EXISTS escrow_transactions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  reference TEXT UNIQUE NOT NULL,
  buyer_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  listing_id TEXT REFERENCES listings(id) ON DELETE SET NULL,
  buyer_name TEXT, buyer_email TEXT NOT NULL, buyer_phone TEXT,
  landlord_name TEXT, landlord_phone TEXT,
  property_address TEXT NOT NULL, transaction_type TEXT NOT NULL,
  amount BIGINT NOT NULL, fee BIGINT DEFAULT 0,
  status TEXT DEFAULT 'INITIATED',
  paystack_ref TEXT, notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_escrow_buyer  ON escrow_transactions(buyer_email);
CREATE INDEX IF NOT EXISTS idx_escrow_status ON escrow_transactions(status);
CREATE INDEX IF NOT EXISTS idx_escrow_ref    ON escrow_transactions(reference);

-- Viewing Requests
CREATE TABLE IF NOT EXISTS viewing_requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  visitor_name TEXT, visitor_phone TEXT, visitor_email TEXT,
  preferred_day TEXT, preferred_time TEXT,
  status TEXT DEFAULT 'PENDING', agent_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_viewing_listing ON viewing_requests(listing_id);
