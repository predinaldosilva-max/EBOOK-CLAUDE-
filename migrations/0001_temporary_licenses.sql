-- Additive only. Never ALTER, UPDATE, DELETE or reseed the existing licenses.
CREATE TABLE IF NOT EXISTS license_batches (
 id TEXT PRIMARY KEY,
 request_id TEXT NOT NULL UNIQUE,
 label TEXT NOT NULL DEFAULT '',
 requested_count INTEGER NOT NULL CHECK(requested_count BETWEEN 1 AND 2000),
 next_index INTEGER NOT NULL DEFAULT 0,
 status TEXT NOT NULL DEFAULT 'generating' CHECK(status IN ('generating','ready')),
 created_at INTEGER NOT NULL,
 created_by TEXT NOT NULL,
 seed_iv TEXT NOT NULL,
 seed_cipher TEXT NOT NULL,
 CHECK(next_index BETWEEN 0 AND requested_count)
);
CREATE INDEX IF NOT EXISTS idx_license_batches_created ON license_batches(created_at DESC);
CREATE TABLE IF NOT EXISTS license_terms (
 license_id TEXT PRIMARY KEY REFERENCES licenses(id),
 batch_id TEXT NOT NULL REFERENCES license_batches(id),
 batch_index INTEGER NOT NULL,
 created_at INTEGER NOT NULL,
 first_activated_at INTEGER,
 expires_at INTEGER,
 data_owner TEXT,
 UNIQUE(batch_id,batch_index),
 CHECK((first_activated_at IS NULL AND expires_at IS NULL AND data_owner IS NULL) OR
       (first_activated_at IS NOT NULL AND expires_at=first_activated_at+2592000000 AND data_owner IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS idx_license_terms_expiry ON license_terms(expires_at);
CREATE TABLE IF NOT EXISTS admin_events (
 id INTEGER PRIMARY KEY,
 operation_id TEXT NOT NULL UNIQUE,
 actor TEXT NOT NULL,
 action TEXT NOT NULL,
 target TEXT NOT NULL,
 reason TEXT NOT NULL DEFAULT '',
 created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_admin_events_created ON admin_events(created_at DESC);
-- Explicit, audited recovery to a new key; never a client-supplied owner alias.
CREATE TABLE IF NOT EXISTS license_recovery_links (
 license_id TEXT PRIMARY KEY REFERENCES license_terms(license_id),
 source_license_id TEXT NOT NULL REFERENCES licenses(id),
 data_owner TEXT NOT NULL,
 approved_at INTEGER NOT NULL,
 approved_by TEXT NOT NULL,
 reason TEXT NOT NULL
);
