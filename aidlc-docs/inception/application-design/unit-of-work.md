# 테이블오더 서비스 - 작업 단위 정의 (Unit of Work)

## 배포 모델
- **모놀리스**: 프론트엔드 1개 + 백엔드 1개
- **개발 방식**: 프론트엔드/백엔드 동시 진행 (Mock API 활용)
- **팀 구성**: 4명 (백엔드 2명, 프론트엔드 2명)

---

## 작업 단위 목록

### Unit 1: Backend API (백엔드)

| 항목 | 내용 |
|---|---|
| **기술 스택** | Java + Spring Boot + PostgreSQL + JPA |
| **패키지 구조** | DDD (도메인별 패키지) |
| **담당 인원** | 백엔드 2명 |

**책임 범위**:
- REST API 전체 (22개 엔드포인트 + SSE 2개)
- JWT 인증/인가 (테이블 로그인, 관리자 로그인)
- 비즈니스 로직 (주문 처리, 세션 관리, 메뉴 관리)
- 데이터베이스 스키마 및 마이그레이션
- SSE 실시간 이벤트 발행

**도메인 분업 (백엔드 2명)**:
- 개발자 A: auth + store + table 도메인 (인증, 매장, 테이블/세션 관리)
- 개발자 B: menu + order 도메인 (메뉴 관리, 주문 처리, SSE)

**코드 구조**:
```
backend/
+-- src/main/java/com/tableorder/
|   +-- store/
|   +-- auth/
|   +-- table/
|   +-- menu/
|   +-- order/
|   +-- common/
+-- src/main/resources/
|   +-- application.yml
|   +-- db/migration/
+-- build.gradle (또는 pom.xml)
```

---

### Unit 2: Frontend App (프론트엔드)

| 항목 | 내용 |
|---|---|
| **기술 스택** | React + Vite + TypeScript + Zustand |
| **프로젝트 구조** | 단일 프로젝트, 라우팅으로 고객/관리자 분리 |
| **담당 인원** | 프론트엔드 2명 |

**책임 범위**:
- 고객용 UI (메뉴 조회, 장바구니, 주문, 주문 내역)
- 관리자용 UI (로그인, 대시보드, 테이블 관리, 메뉴 관리)
- Zustand 상태 관리 (인증, 장바구니, 주문, 메뉴)
- SSE 클라이언트 (실시간 주문 업데이트)
- Mock API (백엔드 완성 전 개발용)

**역할 분업 (프론트엔드 2명)**:
- 개발자 C: 고객용 화면 (TableLoginPage, MenuPage, CartPage, OrderConfirmPage, OrderResultPage, OrderHistoryPage)
- 개발자 D: 관리자용 화면 (AdminLoginPage, DashboardPage, MenuManagementPage, TableManagementPage)

**코드 구조**:
```
frontend/
+-- src/
|   +-- pages/
|   |   +-- customer/
|   |   +-- admin/
|   +-- components/
|   |   +-- common/
|   |   +-- customer/
|   |   +-- admin/
|   +-- stores/
|   +-- api/
|   +-- mocks/
|   +-- types/
|   +-- hooks/
|   +-- utils/
+-- index.html
+-- vite.config.ts
+-- tsconfig.json
+-- package.json
```

---

### Unit 3: Database Schema (데이터베이스)

| 항목 | 내용 |
|---|---|
| **기술 스택** | PostgreSQL |
| **담당** | 백엔드 팀 (Unit 1과 함께 진행) |

**책임 범위**:
- 데이터베이스 스키마 설계 및 생성
- 마이그레이션 스크립트 (Flyway 또는 Liquibase)
- 시드 데이터 (초기 매장 + 관리자 계정)
- 인덱스 설계

**엔티티 목록**:
- Store, Admin, StoreTable, TableSession
- Category, MenuItem
- Order, OrderItem, OrderHistory

---

## 개발 전략: 동시 진행 (Mock API)

### Phase 1: 공통 기반 (동시)
- 백엔드: 프로젝트 초기 설정, DB 스키마, 공통 모듈(보안, 예외처리)
- 프론트엔드: 프로젝트 초기 설정, 라우팅, 공통 컴포넌트, Mock API 정의

### Phase 2: 핵심 기능 (동시)
- 백엔드: 도메인별 API 구현 (auth → menu → order → table)
- 프론트엔드: Mock API 기반 페이지 개발 (고객용 + 관리자용 동시)

### Phase 3: 통합
- Mock API를 실제 API로 교체
- SSE 실시간 통신 연동
- 통합 테스트

### Mock API 전략
- 프론트엔드 `src/mocks/` 디렉토리에 API 응답 Mock 정의
- API 클라이언트에서 환경 변수로 Mock/실제 전환
- component-methods.md의 API 시그니처를 기준으로 Mock 응답 생성
