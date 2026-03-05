# Application Design Plan

## 계획 개요

요구사항과 사용자 스토리를 기반으로 테이블오더 서비스의 컴포넌트 구조, 메서드 시그니처, 서비스 레이어, 컴포넌트 의존성을 설계합니다.

### 참조 문서
- `aidlc-docs/inception/requirements/requirements.md`
- `aidlc-docs/inception/user-stories/stories.md`

---

## 질문 (Questions)

### Question 1
백엔드 API 설계 스타일로 어떤 것을 선호하십니까?

A) RESTful API - 리소스 중심 URL 설계 (예: GET /api/stores/{storeId}/menus)
B) RESTful API + 일부 RPC 스타일 혼합 (예: POST /api/orders/{orderId}/complete)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
프론트엔드 상태 관리(State Management) 방식으로 어떤 것을 선호하십니까?

A) Zustand - 가볍고 간단한 상태 관리 (소규모~중규모 프로젝트에 적합)
B) Redux Toolkit - 구조화된 상태 관리 (대규모 프로젝트, 팀 협업에 적합)
C) React Context + useReducer - 별도 라이브러리 없이 React 내장 기능 사용
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
백엔드 프로젝트 구조(패키지 구성)로 어떤 것을 선호하십니까?

A) 레이어드 아키텍처 (Layered) - controller/service/repository 계층별 분리 (Spring Boot 표준)
B) 도메인 주도 설계 (DDD) - 도메인별 패키지 분리 (예: order/, menu/, table/)
C) 헥사고날 아키텍처 (Hexagonal) - 포트/어댑터 패턴으로 외부 의존성 격리
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## 설계 실행 계획

### Step 1: 컴포넌트 정의
- [ ] 프론트엔드 컴포넌트 식별 (페이지, 공통 컴포넌트)
- [ ] 백엔드 컴포넌트 식별 (컨트롤러, 서비스, 리포지토리)
- [ ] 데이터베이스 엔티티 식별
- [ ] `aidlc-docs/inception/application-design/components.md` 생성

### Step 2: 컴포넌트 메서드 정의
- [ ] 백엔드 API 엔드포인트 시그니처 정의
- [ ] 서비스 레이어 메서드 시그니처 정의
- [ ] 리포지토리 메서드 시그니처 정의
- [ ] `aidlc-docs/inception/application-design/component-methods.md` 생성

### Step 3: 서비스 레이어 설계
- [ ] 서비스 정의 및 책임 할당
- [ ] 서비스 간 오케스트레이션 패턴 정의
- [ ] `aidlc-docs/inception/application-design/services.md` 생성

### Step 4: 컴포넌트 의존성 설계
- [ ] 의존성 매트릭스 작성
- [ ] 통신 패턴 정의 (REST, SSE)
- [ ] 데이터 흐름 다이어그램 작성
- [ ] `aidlc-docs/inception/application-design/component-dependency.md` 생성
