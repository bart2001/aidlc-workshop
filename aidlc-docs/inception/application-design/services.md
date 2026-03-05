# 테이블오더 서비스 - 서비스 레이어 설계

## 1. 서비스 정의 및 책임

### AuthService
- **책임**: 인증/인가 처리
- **주요 기능**:
  - 테이블 태블릿 로그인 (매장ID + 테이블번호 + 비밀번호)
  - 관리자 로그인 (매장ID + 사용자명 + 비밀번호)
  - JWT 토큰 발급 (16시간 만료)
  - JWT 토큰 검증 및 갱신
  - 로그인 시도 제한 (브루트포스 방지)
- **의존**: StoreRepository, AdminRepository, TableRepository, JwtTokenProvider

### StoreService
- **책임**: 매장 정보 관리
- **주요 기능**:
  - 매장 정보 조회
- **의존**: StoreRepository

### MenuService
- **책임**: 메뉴 및 카테고리 관리
- **주요 기능**:
  - 카테고리 CRUD
  - 메뉴 항목 CRUD
  - 메뉴 노출 순서 관리
  - 입력 검증 (필수 필드, 가격 범위)
- **의존**: MenuItemRepository, CategoryRepository

### TableService
- **책임**: 테이블 및 세션 라이프사이클 관리
- **주요 기능**:
  - 테이블 등록/수정
  - 세션 시작 (첫 주문 시 자동)
  - 세션 종료 (이용 완료 처리)
  - 세션 종료 시 OrderService와 협력하여 주문 이력 이동
- **의존**: TableRepository, TableSessionRepository, OrderService

### OrderService
- **책임**: 주문 처리 및 이력 관리
- **주요 기능**:
  - 주문 생성 (세션 확인, 주문번호 생성)
  - 주문 상태 변경 (PENDING → PREPARING → COMPLETED)
  - 주문 삭제 (총 주문액 재계산)
  - 과거 주문 이력 조회
  - 세션 종료 시 주문 이력 이동
- **의존**: OrderRepository, OrderItemRepository, OrderHistoryRepository, OrderSseService, TableService

### OrderSseService
- **책임**: SSE 실시간 이벤트 관리
- **주요 기능**:
  - 관리자용 매장 전체 주문 스트림 관리
  - 고객용 테이블별 주문 상태 스트림 관리
  - 주문 이벤트 발행 (신규, 상태변경, 삭제)
  - SSE 연결 관리 (연결/해제/타임아웃)
- **의존**: 없음 (이벤트 발행만 담당)

---

## 2. 서비스 오케스트레이션 패턴

### 2.1 주문 생성 흐름

```
고객 → OrderController.createOrder()
         → OrderService.createOrder()
            1. TableService.getActiveSession() - 활성 세션 확인
            2. 세션 없으면 TableService.startNewSession() - 새 세션 시작
            3. Order + OrderItem 저장
            4. 주문번호 생성
            5. OrderSseService.publishOrderEvent() - SSE 이벤트 발행
         ← OrderResponse (주문번호 포함)
```

### 2.2 주문 상태 변경 흐름

```
관리자 → OrderController.updateOrderStatus()
          → OrderService.updateOrderStatus()
             1. 주문 조회 및 상태 검증
             2. 상태 업데이트 (PENDING → PREPARING → COMPLETED)
             3. OrderSseService.publishOrderEvent() - SSE 이벤트 발행
          ← OrderResponse
```

### 2.3 테이블 이용 완료 흐름

```
관리자 → TableController.updateSession() (status: COMPLETED)
          → TableService.completeSession()
             1. 활성 세션 조회
             2. OrderService - 현재 세션 주문을 OrderHistory로 이동
             3. 세션 종료 (is_active = false, ended_at 기록)
             4. OrderSseService.publishOrderEvent() - 세션 종료 이벤트 발행
          ← 성공 응답
```

### 2.4 SSE 구독 흐름

```
관리자 → OrderController.subscribeStoreOrders() (GET /orders/stream)
          → OrderSseService.subscribeStoreOrders()
             1. SseEmitter 생성 (타임아웃 설정)
             2. 매장별 구독자 목록에 등록
             3. 연결 해제 시 자동 정리
          ← SseEmitter (지속 연결)

고객 → OrderController.subscribeTableOrders() (GET /tables/{id}/orders/stream)
       → OrderSseService.subscribeTableOrders()
          1. SseEmitter 생성
          2. 테이블별 구독자 목록에 등록
       ← SseEmitter (지속 연결)
```

---

## 3. 주문 상태 전이

```
PENDING (대기중) → PREPARING (준비중) → COMPLETED (완료)
```

- 역방향 전이 불가 (COMPLETED → PREPARING 불가)
- 삭제는 모든 상태에서 가능 (관리자 직권)
