# 👤 담당자 D - Frontend 관리자용 화면 + Infra + Test

## 담당 범위

- 관리자용 페이지 전체 (AdminLoginPage, DashboardPage, MenuManagementPage, TableManagementPage)
- Infrastructure Design (AWS 배포 설계)
- Build and Test 지침

## Git 설정

```bash
echo "aidlc-docs/audit.md" >> .gitignore
git checkout -b construction/d-frontend-admin
```

---

## 전제 조건

담당자 C가 만드는 다음 파일을 import하여 사용합니다:
- `types/index.ts` - 공통 타입
- `api/client.ts` - axios 인스턴스
- `api/*.ts` - API 함수
- `stores/*` - Zustand 스토어
- `components/common/*` - 공통 UI 컴포넌트

**병렬 작업 팁**: 담당자 C의 코드가 아직 없어도, types와 API 시그니처는 component-methods.md에서 확인 가능합니다. 타입 정의를 먼저 작성하고 머지 시 통합하면 됩니다.

---

## 작업 목록

### 작업 1: 관리자용 페이지

**생성할 파일**:

```
frontend/src/
+-- pages/admin/AdminLoginPage.tsx
+-- pages/admin/DashboardPage.tsx
+-- pages/admin/MenuManagementPage.tsx
+-- pages/admin/TableManagementPage.tsx
+-- components/admin/TableCard.tsx
+-- components/admin/OrderDetailModal.tsx
+-- components/admin/MenuForm.tsx
+-- components/admin/CategoryForm.tsx
+-- components/admin/TableForm.tsx
+-- components/admin/OrderHistoryModal.tsx
```

**프롬프트**:
```
관리자용 페이지와 컴포넌트를 구현해주세요.

페이지:
1. AdminLoginPage (/admin/login)
   - 매장ID, 사용자명, 비밀번호 입력
   - 로그인 성공 → 대시보드 이동
   - 로그인 실패 → 에러 메시지 (5회 초과 시 잠금 안내)

2. DashboardPage (/admin/dashboard)
   - 테이블별 카드 그리드 레이아웃
   - 각 카드: 테이블번호, 총 주문액, 최신 주문 미리보기
   - SSE로 실시간 주문 업데이트 (관리자용 스트림)
   - 신규 주문 시각적 강조 (색상 변경)
   - 카드 클릭 → OrderDetailModal (전체 주문 상세)
   - 주문 상태 변경 버튼 (PENDING→PREPARING→COMPLETED)
   - 주문 삭제 버튼 (ConfirmDialog)
   - 이용 완료 버튼 (ConfirmDialog)

3. MenuManagementPage (/admin/menus)
   - 카테고리 목록 + CRUD (CategoryForm)
   - 메뉴 목록 + CRUD (MenuForm)
   - 카테고리별 필터
   - 노출 순서 조정

4. TableManagementPage (/admin/tables)
   - 테이블 목록 + 등록/수정 (TableForm)
   - 과거 주문 내역 조회 (OrderHistoryModal)
   - 날짜 필터

컴포넌트:
- TableCard: 테이블번호, 총 주문액, 최신 주문, 상태 표시
- OrderDetailModal: 테이블 전체 주문 목록, 상태 변경/삭제 버튼
- MenuForm: 메뉴 등록/수정 폼 (메뉴명, 가격, 설명, 카테고리, 이미지URL)
- CategoryForm: 카테고리 등록/수정 폼
- TableForm: 테이블 등록/수정 폼 (테이블번호, 비밀번호)
- OrderHistoryModal: 과거 주문 이력 목록, 날짜 필터

Zustand 스토어 사용: useAuthStore, useOrderStore, useMenuStore
SSE 연결: DashboardPage에서 관리자용 SSE 스트림 구독

참조: aidlc-docs/inception/user-stories/stories.md (US-A01~A04 수용 기준)
참조: aidlc-docs/inception/application-design/components.md
생성 위치: frontend/src/pages/admin/, frontend/src/components/admin/
```

---

### 작업 2: Infrastructure Design

**생성할 파일**:

```
aidlc-docs/construction/infrastructure/
+-- infrastructure-design.md
```

**프롬프트**:
```
테이블오더 서비스의 AWS Infrastructure Design을 작성해주세요.

요구사항:
- 모놀리스 아키텍처 (Spring Boot + React)
- PostgreSQL 데이터베이스
- SSE 실시간 통신 지원 (ALB sticky session 또는 NLB)
- MVP 규모 (비용 최적화 우선)
- HTTPS 필수

설계 포함 내용:
1. AWS 리소스 구성 (ECS Fargate or EC2, RDS, ALB, S3, CloudFront)
2. VPC/서브넷/보안그룹 설계
3. 환경 분리 (dev/prod)
4. 배포 전략
5. 비용 추정 (월간)
6. Dockerfile (backend + frontend)

참조:
- aidlc-docs/inception/requirements/requirements.md (NFR, 제약사항)
- aidlc-docs/inception/application-design/components.md (컴포넌트 구조)

생성 위치: aidlc-docs/construction/infrastructure/
```

---

### 작업 3: Build and Test 지침

**생성할 파일**:

```
aidlc-docs/construction/build-and-test/
+-- build-instructions.md
+-- test-instructions.md
+-- integration-test-instructions.md
```

**프롬프트**:
```
테이블오더 서비스의 Build and Test 지침을 작성해주세요.

포함 내용:

1. build-instructions.md:
   - Backend 빌드 (Gradle)
   - Frontend 빌드 (Vite)
   - Docker 이미지 빌드
   - 환경별 설정

2. test-instructions.md:
   - Backend 단위 테스트 (JUnit 5 + Mockito)
   - Frontend 단위 테스트 (Vitest + React Testing Library)
   - 테스트 커버리지 기준

3. integration-test-instructions.md:
   - Frontend ↔ Backend API 연동 테스트
   - SSE 실시간 통신 테스트
   - 보안 테스트 (JWT 인증, 멀티테넌트 격리)
   - 사용자 스토리별 인수 테스트 시나리오 (12개)

참조:
- aidlc-docs/inception/user-stories/stories.md (인수 기준)
- aidlc-docs/inception/requirements/requirements.md (NFR)

생성 위치: aidlc-docs/construction/build-and-test/
```

---

## 다른 담당자와의 인터페이스 약속

| 의존 대상 | 내용 | 해소 방법 |
| --- | --- | --- |
| 담당자 C의 공통 모듈 | types, api, stores, common 컴포넌트 | component-methods.md 기반으로 독립 개발, 머지 시 통합 |
| 담당자 A의 Backend | API 엔드포인트 | Mock API 사용 (담당자 C가 생성) |
| 담당자 B의 Backend | 비즈니스 도메인 API | Mock API 사용 |

---

## 참조 문서

| 문서 | 경로 |
| --- | --- |
| 컴포넌트 정의 | `aidlc-docs/inception/application-design/components.md` |
| API 시그니처 | `aidlc-docs/inception/application-design/component-methods.md` |
| 사용자 스토리 | `aidlc-docs/inception/user-stories/stories.md` |
| 요구사항 | `aidlc-docs/inception/requirements/requirements.md` |
| DB 엔티티 | `aidlc-docs/construction/database/functional-design/domain-entities.md` |
| 서비스 설계 | `aidlc-docs/inception/application-design/services.md` |
