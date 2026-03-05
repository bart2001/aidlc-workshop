-- OrderItem (주문 항목)
CREATE TABLE order_item (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id BIGINT REFERENCES menu_item(id) ON DELETE SET NULL,
    menu_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price INT NOT NULL CHECK (unit_price >= 0)
);

CREATE INDEX idx_order_item_order ON order_item (order_id);
