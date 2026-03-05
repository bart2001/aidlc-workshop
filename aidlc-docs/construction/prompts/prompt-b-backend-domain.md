# 👤 담당자 B - Backend 비즈니스 도메인

## 담당 범위

- Backend menu 도메인 (카테고리 + 메뉴 CRUD)
- Backend order 도메인 (주문 처리 + SSE)
- Backend table 도메인 (테이블 + 세션 관리)

## Git 설정

```bash
echo "aidlc-docs/audit.md" >> .gitignore
git checkout -b construction/b-backend-domain
```

---

## 전제 조건

담당자 A가 만드는 다음 파일을 import하여 사용합니다:
- `com.tableorder.common.dto.ApiResponse` - API 응답 래퍼
- `com.tableorder.common.exception.BusinessException` - 비즈니스 예외
- `com.tableorder.common.exception.ErrorCode` - 에러 코드 enum
- `com.tableorder.store.entity.Store` - 매장 엔티티 (FK 참조)

**병렬 작업 팁**: 담당자 A의 코드가 아직 없어도, 위 클래스의 시그니처만 알면 독립적으로 개발 가능합니다. 머지 시점에 import 경로만 맞추면 됩니다.

---

## 작업 목록

### 작업 1: menu 도메인

**생성할 파일**:

```
backend/src/main/java/com/tableorder/menu/
+-- controller/MenuController.java
+-- service/MenuService.java
+-- repository/MenuItemRepository.java
+-- repository/CategoryRepository.java
+-- entity/MenuItem.java
+-- entity/Category.java
+-- dto/MenuItemResponse.java
+-- dto/MenuItemCreateRequest.java
+-- dto/MenuItemUpdateRequest.java
+-- dto/CategoryResponse.java
+-- dto/CategoryCreateRequest.java
+-- dto/CategoryUpdateRequest.java
```

**프롬프트**:
```
Backend menu 도메인을 구현해주세요.

API 엔드포인트:
- GET /api/stores/{storeId}/categories - 카테고리 목록 조회
- POST /api/stores/{storeId}/categories - 카테고리 등록 (관리자)
- PUT /api/stores/{storeId}/categories/{categoryId} - 카테고리 수정 (관리자)
- DELETE /api/stores/{storeId}/categories/{categoryId} - 카테고리 삭제 (관리자)
- GET /api/stores/{storeId}/menus - 메뉴 목록 조회 (categoryId 필터 옵션)
- GET /api/stores/{storeId}/menus/{menuId} - 메뉴 상세 조회
- POST /api/stores/{storeId}/menus - 메뉴 등록 (관리자)
- PUT /api/stores/{storeId}/menus/{menuId} - 메뉴 수정 (관리자)
- DELETE /api/stores/{storeId}/menus/{menuId} - 메뉴 삭제 (관리자)
- PATCH /api/stores/{storeId}/menus/{menuId} - 노출 순서 변경 (관리자)

비즈니스 규칙:
- 메뉴명 필수 1~100자, 가격 0~10,000,000원
- 카테고리 삭제 시 하위 메뉴 있으면 RESTRICT
- 메뉴 삭제 시 OrderItem.menu_item_id = NULL (SET NULL)
- display_order로 노출 순서 관리

공통 모듈 사용: ApiResponse<T>, BusinessException, ErrorCode
참조: aidlc-docs/inception/application-design/component-methods.md
생성 위치: backend/src/main/java/com/tableorder/menu/
```

---

### 작업 2: table 도메인

**생성할 파일**:

```
backend/src/main/java/com/tableorder/table/
+-- controller/TableController.java
+-- service/TableService.java
+-- repository/TableRepository.java
+-- repository/TableSessionRepository.java
+-- entity/StoreTable.java
+-- entity/TableSession.java
+-- dto/TableResponse.java
+-- dto/TableCreateRequest.java
+-- dto/TableUpdateRequest.java
+-- dto/TableSessionResponse.java
```

**프롬프트**:
```
Backend table 도메인을 구현해주세요.

API 엔드포인트:
- GET /api/stores/{storeId}/tables - 테이블 목록 조회 (관리자)
- POST /api/stores/{storeId}/tables - 테이블 등록 (관리자)
- PUT /api/stores/{storeId}/tables/{tableId} - 테이블 수정 (관리자)
- GET /api/stores/{storeId}/tables/{tableId}/sessions - 세션 조회 (관리자)
- PATCH /api/stores/{storeId}/tables/{tableId}/sessions/{sessionId} - 이용 완료 (관리자)

비즈니스 규칙:
- 테이블 번호는 매장 내 고유 (UNIQUE store_id + table_number)
- 테이블당 활성 세션 최대 1개
- 세션 시작: 첫 주문 시 자동 (OrderService에서 호출)
- 세션 종료(이용 완료): Order→OrderHistory 이동, Order/OrderItem 삭제, is_active=false

세션 종료 시 OrderService와 협력:
- OrderService.archiveSessionOrders(sessionId) 호출하여 주문 이력 이동
- 이 메서드는 order 도메인에서 구현 (아래 작업 3)

공통 모듈 사용: ApiResponse<T>, BusinessException, ErrorCode
참조: aidlc-docs/inception/application-design/component-methods.md
생성 위치: backend/src/main/java/com/tableorder/table/
```

---

### 작업 3: order 도메인 + SSE

**생성할 파일**:

```
backend/src/main/java/com/tableorder/order/
+-- controller/OrderController.java
+-- service/OrderService.java
+-- service/OrderSseService.java
+-- repository/OrderRepository.java
+-- repository/OrderItemRepository.java
+-- repository/OrderHistoryRepository.java
+-- entity/Order.java
+-- entity/OrderItem.java
+-- entity/OrderHistory.java
+-- entity/OrderStatus.java
+-- dto/OrderResponse.java
+-- dto/OrderCreateRequest.java
+-- dto/OrderItemRequest.java
+-- dto/OrderHistoryResponse.java
+-- dto/OrderEvent.java
```

**프롬프트**:
```
Backend order 도메인과 SSE를 구현해주세요.

API 엔드포인트:
- POST /api/stores/{storeId}/orders - 주문 생성 (테이블)
- GET /api/stores/{storeId}/orders - 주문 목록 조회
- GET /api/stores/{storeId}/orders/{orderId} - 주문 상세
- PATCH /api/stores/{storeId}/orders/{orderId} - 상태 변경 (관리자)
- DELETE /api/stores/{storeId}/orders/{orderId} - 주문 삭제 (관리자)
- GET /api/stores/{storeId}/tables/{tableId}/order-history - 과거 이력 조회 (관리자)
- GET /api/stores/{storeId}/orders/stream - 관리자용 SSE 스트림
- GET /api/stores/{storeId}/tables/{tableId}/orders/stream - 테이블용 SSE 스트림

비즈니스 규칙:
- 주문번호: 매장별 매일 리셋 (1부터 시작), 낙관적 재시도 (최대 3회)
- 상태 전이: PENDING → PREPARING → COMPLETED (역방향 불가)
- 삭제: 모든 상태에서 관리자만 가능
- 주문 생성 시 활성 세션 없으면 자동 생성 (TableService.startNewSession 호출)
- archiveSessionOrders(sessionId): 세션 주문을 JSON으로 직렬화하여 OrderHistory에 저장 후 삭제

SSE:
- SseEmitter 타임아웃 30분
- 이벤트 타입: ORDER_CREATED, ORDER_STATUS_CHANGED, ORDER_DELETED, SESSION_COMPLETED
- 매장별/테이블별 구독자 관리 (ConcurrentHashMap)

공통 모듈 사용: ApiResponse<T>, BusinessException, ErrorCode
참조:
- aidlc-docs/inception/application-design/component-methods.md
- aidlc-docs/inception/application-design/services.md (오케스트레이션 패턴)
- aidlc-docs/construction/database/functional-design/business-logic-model.md (JSON 구조)
생성 위치: backend/src/main/java/com/tableorder/order/
```

---

## 다른 담당자와의 인터페이스 약속

| 의존 대상 | 내용 | 해소 방법 |
| --- | --- | --- |
| 담당자 A의 common 패키지 | ApiResponse, ErrorCode, BusinessException | 시그니처 약속으로 독립 개발, 머지 시 연결 |
| 담당자 A의 Store 엔티티 | FK 참조 | JPA @ManyToOne 매핑, 머지 시 연결 |
| 담당자 A의 DB 스키마 | 테이블 구조 | domain-entities.md를 SSOT로 사용 |

---

## 참조 문서

| 문서 | 경로 |
| --- | --- |
| API 시그니처 | `aidlc-docs/inception/application-design/component-methods.md` |
| 서비스 설계 | `aidlc-docs/inception/application-design/services.md` |
| DB 엔티티 | `aidlc-docs/construction/database/functional-design/domain-entities.md` |
| 비즈니스 규칙 | `aidlc-docs/construction/database/functional-design/business-rules.md` |
| 비즈니스 로직 | `aidlc-docs/construction/database/functional-design/business-logic-model.md` |
