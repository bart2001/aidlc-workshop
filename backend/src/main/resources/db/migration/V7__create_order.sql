-- Order (주문) - 테이블명 orders 사용 (order는 PostgreSQL 예약어)
CREATE TABLE orders (
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

CREATE INDEX idx_order_store_session ON orders (store_id, session_id, created_at);
CREATE INDEX idx_order_store_status ON orders (store_id, status);
CREATE UNIQUE INDEX idx_order_store_number_date ON orders (store_id, order_number, (DATE(created_at)));
