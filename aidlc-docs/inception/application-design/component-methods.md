# 테이블오더 서비스 - 컴포넌트 메서드 정의

## 1. REST API 엔드포인트 (RESTful 스타일)

### 1.1 Auth API

| Method | Endpoint | 설명 | 인증 |
|---|---|---|---|
| `POST` | `/api/auth/table/login` | 테이블 태블릿 로그인 | 없음 |
| `POST` | `/api/auth/admin/login` | 관리자 로그인 | 없음 |
| `POST` | `/api/auth/token/refresh` | JWT 토큰 갱신 | JWT |

### 1.2 Store API

| Method | Endpoint | 설명 | 인증 |
|---|---|---|---|
| `GET` | `/api/stores/{storeId}` | 매장 정보 조회 | JWT |

### 1.3 Menu API

| Method | Endpoint | 설명 | 인증 |
|---|---|---|---|
| `GET` | `/api/stores/{storeId}/categories` | 카테고리 목록 조회 | JWT (테이블/관리자) |
| `GET` | `/api/stores/{storeId}/menus` | 메뉴 목록 조회 (카테고리별 필터 가능) | JWT (테이블/관리자) |
| `GET` | `/api/stores/{storeId}/menus/{menuId}` | 메뉴 상세 조회 | JWT (테이블/관리자) |
| `POST` | `/api/stores/{storeId}/categories` | 카테고리 등록 | JWT (관리자) |
| `PUT` | `/api/stores/{storeId}/categories/{categoryId}` | 카테고리 수정 | JWT (관리자) |
| `DELETE` | `/api/stores/{storeId}/categories/{categoryId}` | 카테고리 삭제 | JWT (관리자) |
| `POST` | `/api/stores/{storeId}/menus` | 메뉴 등록 | JWT (관리자) |
| `PUT` | `/api/stores/{storeId}/menus/{menuId}` | 메뉴 수정 | JWT (관리자) |
| `DELETE` | `/api/stores/{storeId}/menus/{menuId}` | 메뉴 삭제 | JWT (관리자) |
| `PATCH` | `/api/stores/{storeId}/menus/{menuId}` | 메뉴 노출 순서 변경 | JWT (관리자) |

### 1.4 Table API

| Method | Endpoint | 설명 | 인증 |
|---|---|---|---|
| `GET` | `/api/stores/{storeId}/tables` | 테이블 목록 조회 | JWT (관리자) |
| `POST` | `/api/stores/{storeId}/tables` | 테이블 등록 (초기 설정) | JWT (관리자) |
| `PUT` | `/api/stores/{storeId}/tables/{tableId}` | 테이블 정보 수정 | JWT (관리자) |
| `GET` | `/api/stores/{storeId}/tables/{tableId}/sessions` | 테이블 세션 조회 | JWT (관리자) |
| `PATCH` | `/api/stores/{storeId}/tables/{tableId}/sessions/{sessionId}` | 테이블 세션 상태 변경 (이용 완료) | JWT (관리자) |

### 1.5 Order API

| Method | Endpoint | 설명 | 인증 |
|---|---|---|---|
| `POST` | `/api/stores/{storeId}/orders` | 주문 생성 | JWT (테이블) |
| `GET` | `/api/stores/{storeId}/orders` | 주문 목록 조회 (관리자: 전체, 테이블: 현재 세션) | JWT |
| `GET` | `/api/stores/{storeId}/orders/{orderId}` | 주문 상세 조회 | JWT |
| `PATCH` | `/api/stores/{storeId}/orders/{orderId}` | 주문 상태 변경 | JWT (관리자) |
| `DELETE` | `/api/stores/{storeId}/orders/{orderId}` | 주문 삭제 | JWT (관리자) |
| `GET` | `/api/stores/{storeId}/tables/{tableId}/order-history` | 테이블 과거 주문 이력 조회 | JWT (관리자) |

### 1.6 SSE API

| Method | Endpoint | 설명 | 인증 |
|---|---|---|---|
| `GET` | `/api/stores/{storeId}/orders/stream` | 관리자용 주문 실시간 스트림 | JWT (관리자) |
| `GET` | `/api/stores/{storeId}/tables/{tableId}/orders/stream` | 테이블용 주문 상태 실시간 스트림 | JWT (테이블) |

---

## 2. 서비스 레이어 메서드 시그니처

### 2.1 AuthService

```java
// 테이블 태블릿 로그인
TableLoginResponse loginTable(TableLoginRequest request);

// 관리자 로그인
AdminLoginResponse loginAdmin(AdminLoginRequest request);

// JWT 토큰 갱신
TokenResponse refreshToken(String refreshToken);

// JWT 토큰 검증
Authentication validateToken(String token);
```

### 2.2 StoreService

```java
// 매장 정보 조회
StoreResponse getStore(Long storeId);
```

### 2.3 MenuService

```java
// 카테고리 목록 조회
List<CategoryResponse> getCategories(Long storeId);

// 메뉴 목록 조회 (카테고리 필터 옵션)
List<MenuItemResponse> getMenuItems(Long storeId, Long categoryId);

// 메뉴 상세 조회
MenuItemResponse getMenuItem(Long storeId, Long menuId);

// 카테고리 등록
CategoryResponse createCategory(Long storeId, CategoryCreateRequest request);

// 카테고리 수정
CategoryResponse updateCategory(Long storeId, Long categoryId, CategoryUpdateRequest request);

// 카테고리 삭제
void deleteCategory(Long storeId, Long categoryId);

// 메뉴 등록
MenuItemResponse createMenuItem(Long storeId, MenuItemCreateRequest request);

// 메뉴 수정
MenuItemResponse updateMenuItem(Long storeId, Long menuId, MenuItemUpdateRequest request);

// 메뉴 삭제
void deleteMenuItem(Long storeId, Long menuId);

// 메뉴 노출 순서 변경
MenuItemResponse updateMenuItemOrder(Long storeId, Long menuId, int displayOrder);
```

### 2.4 TableService

```java
// 테이블 목록 조회
List<TableResponse> getTables(Long storeId);

// 테이블 등록 (초기 설정)
TableResponse createTable(Long storeId, TableCreateRequest request);

// 테이블 정보 수정
TableResponse updateTable(Long storeId, Long tableId, TableUpdateRequest request);

// 테이블 세션 조회
TableSessionResponse getActiveSession(Long storeId, Long tableId);

// 테이블 세션 종료 (이용 완료)
void completeSession(Long storeId, Long tableId, Long sessionId);

// 새 세션 시작 (첫 주문 시 자동)
TableSession startNewSession(Long storeId, Long tableId);
```

### 2.5 OrderService

```java
// 주문 생성
OrderResponse createOrder(Long storeId, OrderCreateRequest request);

// 주문 목록 조회 (관리자: 활성 세션 전체, 테이블: 현재 세션)
List<OrderResponse> getOrders(Long storeId, OrderQueryParams params);

// 주문 상세 조회
OrderResponse getOrder(Long storeId, Long orderId);

// 주문 상태 변경
OrderResponse updateOrderStatus(Long storeId, Long orderId, OrderStatus newStatus);

// 주문 삭제
void deleteOrder(Long storeId, Long orderId);

// 테이블 과거 주문 이력 조회
List<OrderHistoryResponse> getOrderHistory(Long storeId, Long tableId, OrderHistoryQueryParams params);
```

### 2.6 OrderSseService

```java
// 매장 전체 주문 스트림 구독 (관리자용)
SseEmitter subscribeStoreOrders(Long storeId);

// 테이블별 주문 스트림 구독 (고객용)
SseEmitter subscribeTableOrders(Long storeId, Long tableId);

// 주문 이벤트 발행 (신규 주문, 상태 변경, 삭제)
void publishOrderEvent(Long storeId, OrderEvent event);
```

---

## 3. 리포지토리 메서드 시그니처

### 3.1 StoreRepository
```java
Optional<Store> findById(Long id);
```

### 3.2 AdminRepository
```java
Optional<Admin> findByStoreIdAndUsername(Long storeId, String username);
```

### 3.3 TableRepository
```java
List<StoreTable> findByStoreId(Long storeId);
Optional<StoreTable> findByStoreIdAndTableNumber(Long storeId, int tableNumber);
```

### 3.4 TableSessionRepository
```java
Optional<TableSession> findByTableIdAndIsActiveTrue(Long tableId);
List<TableSession> findByTableIdOrderByStartedAtDesc(Long tableId);
```

### 3.5 CategoryRepository
```java
List<Category> findByStoreIdOrderByDisplayOrder(Long storeId);
```

### 3.6 MenuItemRepository
```java
List<MenuItem> findByStoreIdAndCategoryIdOrderByDisplayOrder(Long storeId, Long categoryId);
List<MenuItem> findByStoreIdOrderByDisplayOrder(Long storeId);
```

### 3.7 OrderRepository
```java
List<Order> findByStoreIdAndSessionIdOrderByCreatedAtAsc(Long storeId, Long sessionId);
List<Order> findByStoreIdAndStatusNotOrderByCreatedAtDesc(Long storeId, OrderStatus excludeStatus);
Optional<Order> findByStoreIdAndId(Long storeId, Long orderId);
```

### 3.8 OrderHistoryRepository
```java
List<OrderHistory> findByStoreIdAndTableIdOrderByCompletedAtDesc(Long storeId, Long tableId);
List<OrderHistory> findByStoreIdAndTableIdAndCompletedAtBetween(Long storeId, Long tableId, LocalDateTime from, LocalDateTime to);
```
