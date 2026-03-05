# 요구사항 검증 질문서

아래 질문들에 답변해 주세요. 각 질문의 `[Answer]:` 태그 뒤에 선택지 알파벳을 입력해 주시면 됩니다.
선택지에 맞는 항목이 없으면 마지막 옵션(X 또는 Other)을 선택하고 설명을 추가해 주세요.

---

## 의도 분석 요약

- **요청 유형**: 신규 프로젝트 (New Project)
- **요청 명확도**: 명확 (Clear) - 상세한 요구사항 문서 제공됨
- **범위 추정**: 다중 컴포넌트 (Multiple Components) - 고객용 UI, 관리자 UI, 서버, 데이터 저장소
- **복잡도 추정**: 보통~복잡 (Moderate-Complex) - 실시간 통신(SSE), 세션 관리, 다중 사용자 유형

---

## Question 1
프론트엔드(Frontend) 기술 스택으로 어떤 것을 사용하시겠습니까?

A) React (Vite 기반)
B) Next.js
C) Vue.js
D) 순수 HTML/CSS/JavaScript (Vanilla)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 2
백엔드(Backend) 기술 스택으로 어떤 것을 사용하시겠습니까?

A) Node.js + Express
B) Node.js + NestJS
C) Python + FastAPI
D) Java + Spring Boot
X) Other (please describe after [Answer]: tag below)

[Answer]: D

## Question 3
데이터베이스(Database)로 어떤 것을 사용하시겠습니까?

A) PostgreSQL
B) MySQL
C) MongoDB
D) DynamoDB
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 4
배포 환경(Deployment Target)은 어디입니까?

A) AWS 클라우드 (EC2, ECS, Lambda 등)
B) 로컬 개발 환경만 (Docker Compose 등)
C) 온프레미스 서버
D) 다른 클라우드 (Azure, GCP 등)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 5
하나의 서버 시스템이 여러 매장을 지원하는 멀티테넌트(Multi-tenant) 구조입니까, 아니면 매장당 독립 배포입니까?

A) 멀티테넌트 - 하나의 시스템에서 여러 매장 지원
B) 싱글테넌트 - 매장당 독립 배포
C) 현재는 단일 매장만 지원하되, 추후 멀티테넌트 확장 고려
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 6
관리자 계정은 어떻게 생성됩니까?

A) 시스템 초기 설정 시 시드(seed) 데이터로 생성
B) 별도의 슈퍼 관리자가 관리자 계정을 생성
C) 자체 회원가입 기능 제공
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 7
메뉴 이미지는 어떻게 관리됩니까? (요구사항에 "이미지 URL"로 명시되어 있습니다)

A) 외부 이미지 URL을 직접 입력 (별도 업로드 없음)
B) 서버에 이미지 파일 업로드 후 URL 자동 생성
C) 클라우드 스토리지(S3 등)에 업로드 후 URL 자동 생성
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 8
프로젝트의 언어(프로그래밍 언어 기준)는 어떻게 통일하시겠습니까?

A) TypeScript (프론트엔드 + 백엔드 모두)
B) 프론트엔드는 TypeScript, 백엔드는 다른 언어
C) JavaScript (프론트엔드 + 백엔드 모두)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 9
테이블 태블릿의 자동 로그인에서 "테이블 비밀번호"는 어떤 용도입니까?

A) 태블릿 초기 설정 시 관리자가 입력하는 인증 수단 (태블릿-테이블 매핑 확인용)
B) 고객이 테이블에 앉을 때 입력하는 인증 수단
C) 관리자가 원격으로 태블릿을 관리하기 위한 보안 수단
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 10
고객용 인터페이스와 관리자용 인터페이스는 같은 프론트엔드 프로젝트에서 관리합니까?

A) 하나의 프로젝트에서 라우팅으로 분리
B) 완전히 별도의 프론트엔드 프로젝트로 분리
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 11
주문 상태 실시간 업데이트(고객 화면)는 MVP에 포함합니까?

A) 포함 - SSE로 고객 화면에서도 주문 상태 실시간 업데이트
B) 제외 - 고객은 페이지 새로고침으로 상태 확인 (관리자 화면만 SSE)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 12: Security Extensions
이 프로젝트에 보안 확장 규칙(Security Extension Rules)을 적용하시겠습니까?

A) 예 - 모든 SECURITY 규칙을 차단 제약 조건으로 적용 (프로덕션 수준 애플리케이션에 권장)
B) 아니오 - 모든 SECURITY 규칙 건너뛰기 (PoC, 프로토타입, 실험적 프로젝트에 적합)
X) Other (please describe after [Answer]: tag below)

[Answer]: A
