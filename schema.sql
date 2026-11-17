CREATE TABLE IF NOT EXISTS licenses (
 id TEXT PRIMARY KEY,
 password_hash TEXT NOT NULL UNIQUE,
 is_test INTEGER NOT NULL DEFAULT 0 CHECK(is_test IN (0,1)),
 installation_hash TEXT,
 generation INTEGER NOT NULL DEFAULT 0,
 disabled INTEGER NOT NULL DEFAULT 0,
 activated_at INTEGER
);
CREATE TABLE IF NOT EXISTS attempts (
 key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS audit (
 id INTEGER PRIMARY KEY, license_id TEXT NOT NULL, action TEXT NOT NULL,
 reason TEXT NOT NULL, created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS test_sessions (
 token_hash TEXT PRIMARY KEY,
 license_id TEXT NOT NULL,
 installation_hash TEXT NOT NULL,
 generation INTEGER NOT NULL,
 expires INTEGER NOT NULL
);
