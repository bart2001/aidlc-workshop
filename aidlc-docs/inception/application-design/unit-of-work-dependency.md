# 테이블오더 서비스 - 작업 단위 의존성

## 1. 의존성 매트릭스

| 단위 | Unit 1 (Backend) | Unit 2 (Frontend) | Unit 3 (Database) |
|---|---|---|---|
| **Unit 1 (Backend)** | - | | O (DB 필요) |
| **Unit 2 (Frontend)** | O (API 호출) | - | |
| **Unit 3 (Database)** | | | - |

- O = 의존 관계
- Unit 1 → Unit 3: 백엔드가 DB에 의존
- Unit 2 → Unit 1: 프론트엔드가 백엔드 API에 의존 (Mock으로 해소)

---

## 2. 개발 순서 및 통합 전략

### 동시 진행 타임라인

```
Week 1-2: 기반 설정
+------------------------------------------+
| Unit 3: DB 스키마 설계 + 마이그레이션     |
| Unit 1: 프로젝트 설정 + 공통 모듈        |
| Unit 2: 프로젝트 설정 + Mock API + 라우팅 |
+------------------------------------------+

Week 3-5: 핵심 기능 개발 (동시)
+------------------------------------------+
| Unit 1: 도메인별 API 구현                 |
|   개발자A: auth + store + table           |
|   개발자B: menu + order + SSE             |
| Unit 2: 페이지 개발 (Mock API 기반)       |
|   개발자C: 고객용 화면                    |
|   개발자D: 관리자용 화면                  |
+------------------------------------------+

Week 6: 통합 + 테스트
+------------------------------------------+
| Mock API → 실제 API 교체                  |
| SSE 실시간 통신 연동                      |
| 통합 테스트 + 버그 수정                   |
+------------------------------------------+
```

### 통합 포인트

| 통합 항목 | 시점 | 관련 단위 | 설명 |
|---|---|---|---|
| API 연동 | Phase 3 | Unit 1 + Unit 2 | Mock → 실제 API 교체 |
| SSE 연동 | Phase 3 | Unit 1 + Unit 2 | 실시간 주문 스트림 연결 |
| DB 연동 | Phase 1 | Unit 1 + Unit 3 | JPA 엔티티 ↔ DB 스키마 매핑 |
| 인증 연동 | Phase 3 | Unit 1 + Unit 2 | JWT 토큰 발급/검증 흐름 |

### 통합 리스크 및 완화

| 리스크 | 영향 | 완화 방안 |
|---|---|---|
| API 스펙 변경 | Mock과 실제 API 불일치 | component-methods.md를 단일 진실 소스(SSOT)로 사용 |
| SSE 연동 복잡도 | 실시간 통신 버그 | Phase 2 후반에 SSE 프로토타입 먼저 연동 |
| DB 스키마 변경 | 마이그레이션 충돌 | Flyway 버전 관리, 스키마 변경 시 팀 공유 |

---

## 3. CONSTRUCTION PHASE 단위별 실행 순서

AI-DLC CONSTRUCTION PHASE에서는 각 Unit을 순차적으로 설계/구현합니다:

| 순서 | Unit | CONSTRUCTION 단계 |
|---|---|---|
| 1 | Unit 3 (Database) | Functional Design → Code Generation |
| 2 | Unit 1 (Backend) | Functional Design → NFR Requirements → NFR Design → Infrastructure Design → Code Generation |
| 3 | Unit 2 (Frontend) | Functional Design → Code Generation |
| 4 | 전체 | Build and Test |

- Unit 3(DB)을 먼저 설계하여 데이터 모델 확정
- Unit 1(Backend)에서 보안/성능/인프라 설계 포함 (NFR + Infrastructure)
- Unit 2(Frontend)는 NFR/Infrastructure 불필요 (백엔드에서 처리)
