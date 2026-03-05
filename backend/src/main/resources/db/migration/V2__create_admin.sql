-- Admin (관리자)
CREATE TABLE admin (
    id BIGSERIAL PRIMARY KEY,
    store_id BIGINT NOT NULL REFERENCES store(id) ON DELETE RESTRICT,
    username VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    login_attempts INT NOT NULL DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (store_id, username)
);
