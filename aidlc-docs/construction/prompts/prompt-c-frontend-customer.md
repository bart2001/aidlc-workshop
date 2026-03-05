# 👤 담당자 C - Frontend 고객용 화면

## 담당 범위

- Frontend 프로젝트 초기 설정 (Vite, 라우팅, 공통 컴포넌트)
- 고객용 페이지 전체 (TableLoginPage, MenuPage, CartPage, OrderConfirmPage, OrderResultPage, OrderHistoryPage)
- Zustand 스토어 (useAuthStore, useCartStore, useOrderStore, useMenuStore)
- Mock API (전체 - 담당자 D도 사용)
- API 클라이언트 (axios 설정, 인터셉터)

## Git 설정

```bash
echo "aidlc-docs/audit.md" >> .gitignore
git checkout -b construction/c-frontend-customer
```

---

## 작업 목록

### 작업 1: Frontend 프로젝트 초기 설정

**생성할 파일**:

```
frontend/
+-- package.json
+-- vite.config.ts
+-- tsconfig.json
+-- tsconfig.node.json
+-- index.html
+-- src/
|   +-- main.tsx
|   +-- App.tsx
|   +-- vite-env.d.ts
```

**프롬프트**:
```
React + Vite + TypeScript 프로젝트 초기 설정을 생성해주세요.

의존성:
- react, react-dom, react-router-dom
- zustand (상태 관리)
- axios (HTTP 클라이언트)
- typescript

App.tsx에 라우팅 설정:
- /login → TableLoginPage
- /menu → MenuPage (기본 화면)
- /cart → CartPage
- /order/confirm → OrderConfirmPage
- /order/result/:orderId → OrderResultPage
- /orders → OrderHistoryPage
- /admin/login → AdminLoginPage
- /admin/dashboard → DashboardPage
- /admin/menus → MenuManagementPage
- /admin/tables → TableManagementPage

생성 위치: frontend/
```

---

### 작업 2: 공통 모듈 (타입, API 클라이언트, Mock)

**생성할 파일**:

```
frontend/src/
+-- types/index.ts          (전체 타입 정의)
+-- api/client.ts           (axios 인스턴스, JWT 인터셉터)
+-- api/auth.ts             (인증 API)
+-- api/menu.ts             (메뉴 API)
+-- api/order.ts            (주문 API)
+-- api/table.ts            (테이블 API)
+-- mocks/handlers.ts       (Mock API 핸들러 - 전체)
+-- mocks/data.ts           (Mock 데이터)
+-- stores/useAuthStore.ts
+-- stores/useCartStore.ts
+-- stores/useOrderStore.ts
+-- stores/useMenuStore.ts
+-- components/common/Layout.tsx
+-- components/common/LoadingSpinner.tsx
+-- components/common/ErrorMessage.tsx
+-- components/common/ConfirmDialog.tsx
+-- components/common/OrderStatusBadge.tsx
```

**프롬프트**:
```
Frontend 공통 모듈을 생성해주세요.

1. types/index.ts - 전체 타입 정의:
   - Store, Admin, StoreTable, TableSession, Category, MenuItem
   - Order, OrderItem, OrderHistory, OrderStatus(PENDING/PREPARING/COMPLETED)
   - API 요청/응답 타입, ApiResponse<T>

2. api/client.ts - axios 인스턴스:
   - baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080'
   - JWT 토큰 자동 첨부 (Authorization: Bearer)
   - 401 응답 시 로그인 페이지로 리다이렉트

3. api/*.ts - 도메인별 API 함수:
   - component-methods.md의 모든 엔드포인트를 함수로 래핑

4. mocks/ - Mock API (환경변수 VITE_USE_MOCK=true 시 활성화):
   - 시드 데이터 기반 Mock 응답 (3개 카테고리, 9개 메뉴, 5개 테이블)
   - 주문 생성/상태변경/삭제 Mock

5. stores/ - Zustand 스토어:
   - useAuthStore: JWT 토큰, storeId, tableId, role, login/logout
   - useCartStore: 장바구니 항목, 수량 조절, 총 금액 계산, persist 미들웨어
   - useOrderStore: 주문 목록, SSE 연결 관리
   - useMenuStore: 카테고리/메뉴 데이터 캐시

6. components/common/ - 공통 UI 컴포넌트

참조: aidlc-docs/inception/application-design/component-methods.md (API 시그니처)
참조: aidlc-docs/inception/application-design/components.md (컴포넌트 목록)
생성 위치: frontend/src/
```

---

### 작업 3: 고객용 페이지

**생성할 파일**:

```
frontend/src/
+-- pages/customer/TableLoginPage.tsx
+-- pages/customer/MenuPage.tsx
+-- pages/customer/CartPage.tsx
+-- pages/customer/OrderConfirmPage.tsx
+-- pages/customer/OrderResultPage.tsx
+-- pages/customer/OrderHistoryPage.tsx
+-- components/customer/MenuCard.tsx
+-- components/customer/CategoryTabs.tsx
+-- components/customer/CartItem.tsx
+-- components/customer/CartSummary.tsx
+-- components/customer/OrderCard.tsx
```

**프롬프트**:
```
고객용 페이지와 컴포넌트를 구현해주세요.

페이지 흐름:
1. TableLoginPage (/login) - 매장ID, 테이블번호, 비밀번호 입력 → 로그인 → 메뉴로 이동
2. MenuPage (/menu) - 카테고리 탭 + 메뉴 카드 그리드, 장바구니 추가 버튼
3. CartPage (/cart) - 장바구니 항목 목록, 수량 조절, 총 금액, 주문하기 버튼
4. OrderConfirmPage (/order/confirm) - 주문 내역 최종 확인, 주문 확정 버튼
5. OrderResultPage (/order/result/:orderId) - 성공: 주문번호 표시 + 5초 후 메뉴 리다이렉트 / 실패: 에러 메시지
6. OrderHistoryPage (/orders) - 현재 세션 주문 목록, SSE 실시간 상태 업데이트

컴포넌트:
- MenuCard: 이미지, 메뉴명, 가격, 설명, 추가 버튼 (44x44px 이상)
- CategoryTabs: 카테고리 탭 네비게이션
- CartItem: 메뉴명, 수량 +/- 버튼, 소계, 삭제
- CartSummary: 총 금액, 주문하기 버튼
- OrderCard: 주문번호, 시각, 상태 뱃지, 메뉴 목록

Zustand 스토어 사용: useAuthStore, useCartStore, useOrderStore, useMenuStore
SSE 연결: OrderHistoryPage에서 테이블용 SSE 스트림 구독

참조: aidlc-docs/inception/user-stories/stories.md (US-C01~C05 수용 기준)
참조: aidlc-docs/inception/application-design/components.md
생성 위치: frontend/src/pages/customer/, frontend/src/components/customer/
```

---

## 다른 담당자와의 인터페이스 약속

담당자 C가 만드는 코드 중 다른 담당자가 사용하는 것:

| 파일 | 사용하는 담당자 | 용도 |
| --- | --- | --- |
| `types/index.ts` | D | 공통 타입 정의 |
| `api/client.ts` | D | axios 인스턴스 |
| `api/*.ts` | D | API 함수 |
| `mocks/*` | D | Mock API |
| `stores/*` | D | Zustand 스토어 |
| `components/common/*` | D | 공통 UI 컴포넌트 |

---

## 참조 문서

| 문서 | 경로 |
| --- | --- |
| 컴포넌트 정의 | `aidlc-docs/inception/application-design/components.md` |
| API 시그니처 | `aidlc-docs/inception/application-design/component-methods.md` |
| 사용자 스토리 | `aidlc-docs/inception/user-stories/stories.md` |
| 페르소나 | `aidlc-docs/inception/user-stories/personas.md` |
| DB 엔티티 | `aidlc-docs/construction/database/functional-design/domain-entities.md` |
