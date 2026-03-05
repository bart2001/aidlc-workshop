-- StoreTable (테이블)
CREATE TABLE store_table (
    id BIGSERIAL PRIMARY KEY,
    store_id BIGINT NOT NULL REFERENCES store(id) ON DELETE RESTRICT,
    table_number INT NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (store_id, table_number)
);
