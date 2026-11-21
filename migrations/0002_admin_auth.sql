-- Additive administrative authentication only. No existing license row is changed.
CREATE TABLE IF NOT EXISTS admin_auth_state (
  credential_id TEXT PRIMARY KEY,
  last_counter INTEGER NOT NULL DEFAULT -1
);
CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash TEXT PRIMARY KEY,
  credential_id TEXT NOT NULL,
  csrf TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS admin_sessions_expiry ON admin_sessions(expires_at);
CREATE TABLE IF NOT EXISTS admin_login_limits (
  bucket TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS admin_auth_events (
  id INTEGER PRIMARY KEY,
  action TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
