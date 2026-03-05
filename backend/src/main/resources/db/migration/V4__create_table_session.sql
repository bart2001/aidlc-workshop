-- TableSession (테이블 세션)
CREATE TABLE table_session (
    id BIGSERIAL PRIMARY KEY,
    table_id BIGINT NOT NULL REFERENCES store_table(id) ON DELETE RESTRICT,
    store_id BIGINT NOT NULL REFERENCES store(id) ON DELETE RESTRICT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMP
);

CREATE INDEX idx_table_session_table_active ON table_session (table_id, is_active);
CREATE INDEX idx_table_session_store ON table_session (store_id);
