-- Disposable local fixtures ONLY. Never run against production.
INSERT OR IGNORE INTO licenses (id,password_hash,is_test) VALUES ('qa-local','bf84dfaae4ba9d26ed8149be3a5ab2bb3dd51cd39b63e2e8720116c6d3dd9269',1);
