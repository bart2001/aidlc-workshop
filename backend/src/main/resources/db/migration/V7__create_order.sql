-- Order (주문)
CREATE TABLE "order" (
    id BIGSERIAL PRIMARY KEY,
    store_id BIGINT NOT NULL REFERENCES store(id) ON DELETE RESTRICT,
    table_id BIGINT NOT NULL REFERENCES store_table(id) ON DELETE RESTRICT,
    session_id BIGINT NOT NULL REFERENCES table_session(id) ON DELETE RESTRICT,
    order_number INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    total_amount INT NOT NULL CHECK (total_amount >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_order_status CHECK (status IN ('PENDING', 'PREPARING', 'COMPLETED'))
);

CREATE INDEX idx_order_store_session ON "order" (store_id, session_id, created_at);
CREATE INDEX idx_order_store_status ON "order" (store_id, status);
CREATE UNIQUE INDEX idx_order_store_number_date ON "order" (store_id, order_number, (DATE(created_at)));
