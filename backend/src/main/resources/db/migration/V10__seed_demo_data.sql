-- 데모 매장
INSERT INTO store (name) VALUES ('데모 매장');

-- 관리자 계정 (비밀번호: admin1234, bcrypt 해싱)
INSERT INTO admin (store_id, username, password_hash)
VALUES (1, 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');

-- 테이블 5개 (비밀번호: 각각 table1 ~ table5, bcrypt 해싱)
INSERT INTO store_table (store_id, table_number, password_hash) VALUES
(1, 1, '$2a$10$EqKcp1WFKAr1GYMwIOg8X.PBaqNMECMjMIjGTGxSPmHMOhZS0TBMC'),
(1, 2, '$2a$10$EqKcp1WFKAr1GYMwIOg8X.PBaqNMECMjMIjGTGxSPmHMOhZS0TBMC'),
(1, 3, '$2a$10$EqKcp1WFKAr1GYMwIOg8X.PBaqNMECMjMIjGTGxSPmHMOhZS0TBMC'),
(1, 4, '$2a$10$EqKcp1WFKAr1GYMwIOg8X.PBaqNMECMjMIjGTGxSPmHMOhZS0TBMC'),
(1, 5, '$2a$10$EqKcp1WFKAr1GYMwIOg8X.PBaqNMECMjMIjGTGxSPmHMOhZS0TBMC');

-- 카테고리
INSERT INTO category (store_id, name, display_order) VALUES
(1, '메인 메뉴', 1),
(1, '사이드', 2),
(1, '음료', 3);

-- 메인 메뉴
INSERT INTO menu_item (store_id, category_id, name, price, description, display_order) VALUES
(1, 1, '불고기 정식', 12000, '소불고기와 밑반찬 세트', 1),
(1, 1, '김치찌개', 9000, '돼지고기 김치찌개', 2),
(1, 1, '된장찌개', 8000, '두부 된장찌개', 3),
(1, 1, '비빔밥', 10000, '야채 비빔밥', 4);

-- 사이드
INSERT INTO menu_item (store_id, category_id, name, price, description, display_order) VALUES
(1, 2, '계란말이', 5000, '치즈 계란말이', 1),
(1, 2, '김치전', 6000, '바삭한 김치전', 2);

-- 음료
INSERT INTO menu_item (store_id, category_id, name, price, description, display_order) VALUES
(1, 3, '콜라', 2000, NULL, 1),
(1, 3, '사이다', 2000, NULL, 2),
(1, 3, '맥주', 5000, '생맥주 500ml', 3);
