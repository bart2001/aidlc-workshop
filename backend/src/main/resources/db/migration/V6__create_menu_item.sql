-- MenuItem (메뉴 항목)
CREATE TABLE menu_item (
    id BIGSERIAL PRIMARY KEY,
    store_id BIGINT NOT NULL REFERENCES store(id) ON DELETE RESTRICT,
    category_id BIGINT NOT NULL REFERENCES category(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    price INT NOT NULL CHECK (price >= 0 AND price <= 10000000),
    description TEXT,
    image_url VARCHAR(500),
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_menu_item_store_category_order ON menu_item (store_id, category_id, display_order);
