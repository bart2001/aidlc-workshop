-- OrderHistory (과거 주문 이력)
CREATE TABLE order_history (
    id BIGSERIAL PRIMARY KEY,
    store_id BIGINT NOT NULL REFERENCES store(id) ON DELETE RESTRICT,
    table_id BIGINT NOT NULL REFERENCES store_table(id) ON DELETE RESTRICT,
    session_id BIGINT NOT NULL,
    order_data_json JSONB NOT NULL,
    total_amount INT NOT NULL,
    completed_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_history_store_table_completed ON order_history (store_id, table_id, completed_at DESC);
