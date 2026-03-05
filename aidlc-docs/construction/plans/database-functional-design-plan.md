# Database Functional Design Plan

## 대상 Unit
- **Unit 3: Database (PostgreSQL)**
- 참조: `aidlc-docs/inception/application-design/components.md` (엔티티 목록)

---

## 질문 (Questions)

### Question 1
주문번호(order_number) 생성 규칙은 어떻게 하시겠습니까?

A) 매장별 일련번호 (예: 001, 002, 003... 매일 리셋)
B) 매장별 일련번호 (리셋 없이 계속 증가)
C) UUID (고유 식별자)
D) 날짜+일련번호 조합 (예: 20260305-001)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
과거 주문 이력(OrderHistory) 저장 방식은 어떻게 하시겠습니까?

A) 주문 데이터를 JSON으로 직렬화하여 단일 컬럼에 저장 (단순, 조회 유연)
B) 별도 이력 테이블에 원본 구조 그대로 복사 (정규화, 쿼리 용이)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## 생성 실행 계획

### Step 1: 도메인 엔티티 상세 설계
- [ ] 각 엔티티의 컬럼, 타입, 제약조건 정의
- [ ] 엔티티 간 관계(FK) 정의
- [ ] 인덱스 설계
- [ ] `domain-entities.md` 생성

### Step 2: 비즈니스 규칙 정의
- [ ] 데이터 검증 규칙 (필수 필드, 범위, 형식)
- [ ] 참조 무결성 규칙
- [ ] 상태 전이 규칙 (주문 상태)
- [ ] `business-rules.md` 생성

### Step 3: 비즈니스 로직 모델
- [ ] 시드 데이터 구조 정의
- [ ] 마이그레이션 전략 정의
- [ ] `business-logic-model.md` 생성
