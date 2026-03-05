# 테이블오더 서비스 - 스토리-단위 매핑

## 매핑 테이블

| 스토리 ID | 스토리명 | 우선순위 | Unit 1 (Backend) | Unit 2 (Frontend) | Unit 3 (Database) |
|---|---|---|---|---|---|
| US-C01 | 테이블 태블릿 자동 로그인 | Must | O (auth API) | O (TableLoginPage) | O (StoreTable, TableSession) |
| US-C02 | 메뉴 조회 및 탐색 | Must | O (menu API) | O (MenuPage, MenuCard) | O (Category, MenuItem) |
| US-C03 | 장바구니 관리 | Must | | O (CartPage, CartStore) | |
| US-C04 | 주문 생성 | Must | O (order API) | O (OrderConfirmPage, OrderResultPage) | O (Order, OrderItem) |
| US-C05 | 주문 내역 조회 | Must | O (order API, SSE) | O (OrderHistoryPage) | O (Order) |
| US-A01 | 매장 인증 | Must | O (auth API) | O (AdminLoginPage) | O (Admin) |
| US-A02 | 실시간 주문 모니터링 | Must | O (order API, SSE) | O (DashboardPage, TableCard) | O (Order) |
| US-A03-1 | 테이블 초기 설정 | Must | O (table API) | O (TableManagementPage) | O (StoreTable) |
| US-A03-2 | 주문 삭제 | Must | O (order API) | O (DashboardPage) | O (Order) |
| US-A03-3 | 테이블 세션 처리 | Must | O (table API, order API) | O (DashboardPage) | O (TableSession, OrderHistory) |
| US-A03-4 | 과거 주문 내역 조회 | Should | O (order API) | O (TableManagementPage) | O (OrderHistory) |
| US-A04 | 메뉴 관리 | Must | O (menu API) | O (MenuManagementPage) | O (Category, MenuItem) |

## 단위별 스토리 수

| Unit | Must | Should | 합계 |
|---|---|---|---|
| Unit 1 (Backend) | 10 | 1 | 11 |
| Unit 2 (Frontend) | 10 | 1 | 11 |
| Unit 3 (Database) | 9 | 1 | 10 |

- US-C03(장바구니)은 클라이언트 전용 기능으로 Unit 2에만 해당
- 나머지 스토리는 모두 3개 Unit에 걸쳐 있음

## 미할당 스토리 검증

미할당 스토리: **없음** - 12개 스토리 모두 최소 1개 이상의 Unit에 할당됨
