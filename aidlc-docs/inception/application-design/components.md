# 테이블오더 서비스 - 컴포넌트 정의

## 1. 프론트엔드 컴포넌트 (React + TypeScript + Vite)

### 1.1 페이지 컴포넌트

| 컴포넌트 | 경로 | 설명 | 페르소나 |
|---|---|---|---|
| `TableLoginPage` | `/login` | 태블릿 초기 설정 (매장ID, 테이블번호, 비밀번호) | 관리자(초기설정) |
| `MenuPage` | `/menu` | 카테고리별 메뉴 조회 및 장바구니 추가 (기본 화면) | 고객 |
| `CartPage` | `/cart` | 장바구니 확인, 수량 조절, 주문 확정 | 고객 |
| `OrderConfirmPage` | `/order/confirm` | 주문 최종 확인 | 고객 |
| `OrderResultPage` | `/order/result/:orderId` | 주문 결과 (성공/실패), 5초 후 메뉴로 리다이렉트 | 고객 |
| `OrderHistoryPage` | `/orders` | 현재 세션 주문 내역 및 실시간 상태 | 고객 |
| `AdminLoginPage` | `/admin/login` | 관리자 로그인 | 관리자 |
| `DashboardPage` | `/admin/dashboard` | 테이블별 주문 모니터링 (그리드 레이아웃, SSE) | 관리자 |
| `MenuManagementPage` | `/admin/menus` | 메뉴 CRUD 관리 | 관리자 |
| `TableManagementPage` | `/admin/tables` | 테이블 설정, 세션 관리, 과거 내역 | 관리자 |

### 1.2 공통 컴포넌트

| 컴포넌트 | 설명 |
|---|---|
| `MenuCard` | 메뉴 카드 (이미지, 이름, 가격, 설명, 추가 버튼) |
| `CategoryTabs` | 카테고리 탭 네비게이션 |
| `CartItem` | 장바구니 항목 (수량 조절, 삭제) |
| `CartSummary` | 장바구니 요약 (총 금액, 주문 버튼) |
| `OrderCard` | 주문 카드 (주문번호, 시각, 상태, 메뉴 목록) |
| `TableCard` | 관리자 대시보드 테이블 카드 (테이블번호, 총 주문액, 최신 주문) |
| `OrderStatusBadge` | 주문 상태 뱃지 (대기중/준비중/완료) |
| `ConfirmDialog` | 확인 팝업 (삭제, 이용 완료 등) |
| `LoadingSpinner` | 로딩 인디케이터 |
| `ErrorMessage` | 에러 메시지 표시 |
| `Layout` | 공통 레이아웃 (고객용/관리자용 분리) |

### 1.3 Zustand 스토어

| 스토어 | 설명 |
|---|---|
| `useAuthStore` | 인증 상태 (테이블 로그인, 관리자 로그인, JWT 토큰) |
| `useCartStore` | 장바구니 상태 (메뉴 항목, 수량, 총 금액) - persist 미들웨어로 로컬 저장 |
| `useOrderStore` | 주문 상태 (SSE 실시간 업데이트 데이터) |
| `useMenuStore` | 메뉴 데이터 캐시 |

---

## 2. 백엔드 컴포넌트 (Java + Spring Boot, DDD 구조)

### 2.1 도메인 패키지 구조

```
com.tableorder/
+-- store/          # 매장 도메인
|   +-- controller/
|   +-- service/
|   +-- repository/
|   +-- entity/
|   +-- dto/
+-- auth/           # 인증 도메인
|   +-- controller/
|   +-- service/
|   +-- security/
+-- table/          # 테이블 도메인
|   +-- controller/
|   +-- service/
|   +-- repository/
|   +-- entity/
|   +-- dto/
+-- menu/           # 메뉴 도메인
|   +-- controller/
|   +-- service/
|   +-- repository/
|   +-- entity/
|   +-- dto/
+-- order/          # 주문 도메인
|   +-- controller/
|   +-- service/
|   +-- repository/
|   +-- entity/
|   +-- dto/
|   +-- sse/
+-- common/         # 공통 모듈
    +-- config/
    +-- exception/
    +-- security/
    +-- dto/
```

### 2.2 도메인별 컴포넌트

#### Store 도메인
| 컴포넌트 | 타입 | 책임 |
|---|---|---|
| `StoreController` | Controller | 매장 정보 API |
| `StoreService` | Service | 매장 비즈니스 로직 |
| `StoreRepository` | Repository | 매장 데이터 접근 |
| `Store` | Entity | 매장 엔티티 |

#### Auth 도메인
| 컴포넌트 | 타입 | 책임 |
|---|---|---|
| `AuthController` | Controller | 인증 API (관리자 로그인, 테이블 로그인) |
| `AuthService` | Service | 인증 로직 (JWT 발급/검증) |
| `JwtTokenProvider` | Security | JWT 토큰 생성/검증 유틸리티 |
| `JwtAuthenticationFilter` | Security | 요청별 JWT 인증 필터 |

#### Table 도메인
| 컴포넌트 | 타입 | 책임 |
|---|---|---|
| `TableController` | Controller | 테이블 관리 API |
| `TableService` | Service | 테이블/세션 비즈니스 로직 |
| `TableRepository` | Repository | 테이블 데이터 접근 |
| `TableSessionRepository` | Repository | 테이블 세션 데이터 접근 |
| `StoreTable` | Entity | 테이블 엔티티 |
| `TableSession` | Entity | 테이블 세션 엔티티 |

#### Menu 도메인
| 컴포넌트 | 타입 | 책임 |
|---|---|---|
| `MenuController` | Controller | 메뉴 관리 API |
| `MenuService` | Service | 메뉴 비즈니스 로직 |
| `MenuItemRepository` | Repository | 메뉴 항목 데이터 접근 |
| `CategoryRepository` | Repository | 카테고리 데이터 접근 |
| `MenuItem` | Entity | 메뉴 항목 엔티티 |
| `Category` | Entity | 카테고리 엔티티 |

#### Order 도메인
| 컴포넌트 | 타입 | 책임 |
|---|---|---|
| `OrderController` | Controller | 주문 API |
| `OrderService` | Service | 주문 비즈니스 로직 |
| `OrderRepository` | Repository | 주문 데이터 접근 |
| `OrderItemRepository` | Repository | 주문 항목 데이터 접근 |
| `OrderHistoryRepository` | Repository | 과거 주문 이력 접근 |
| `OrderSseService` | SSE | SSE 이벤트 발행/구독 관리 |
| `Order` | Entity | 주문 엔티티 |
| `OrderItem` | Entity | 주문 항목 엔티티 |
| `OrderHistory` | Entity | 과거 주문 이력 엔티티 |

#### Common 모듈
| 컴포넌트 | 타입 | 책임 |
|---|---|---|
| `SecurityConfig` | Config | Spring Security 설정 |
| `CorsConfig` | Config | CORS 설정 |
| `GlobalExceptionHandler` | Exception | 전역 예외 처리 |
| `ApiResponse` | DTO | 공통 API 응답 래퍼 |

---

## 3. 데이터베이스 엔티티 (PostgreSQL)

| 엔티티 | 설명 | 주요 필드 |
|---|---|---|
| `Store` | 매장 | id, name, created_at |
| `Admin` | 관리자 | id, store_id, username, password_hash |
| `StoreTable` | 테이블 | id, store_id, table_number, password_hash |
| `TableSession` | 테이블 세션 | id, table_id, store_id, session_token, started_at, ended_at, is_active |
| `Category` | 메뉴 카테고리 | id, store_id, name, display_order |
| `MenuItem` | 메뉴 항목 | id, store_id, category_id, name, price, description, image_url, display_order |
| `Order` | 주문 | id, store_id, table_id, session_id, order_number, status, total_amount, created_at |
| `OrderItem` | 주문 항목 | id, order_id, menu_item_id, menu_name, quantity, unit_price |
| `OrderHistory` | 과거 주문 이력 | id, store_id, table_id, session_id, order_data_json, completed_at |
