# 👤 담당자 A - Database + Backend 공통 모듈

## 담당 범위

- DB 스키마 전체 (Flyway 마이그레이션)
- Backend 공통 모듈 (common 패키지)
- Backend auth + store 도메인
- 프로젝트 초기 설정 (build.gradle, application.yml)

## Git 설정

```bash
echo "aidlc-docs/audit.md" >> .gitignore
git checkout -b construction/a-database-common
```

---

## 작업 목록

### 작업 1: DB 스키마 + 마이그레이션

Flyway 마이그레이션 스크립트를 생성합니다.

**생성할 파일**:

```
backend/src/main/resources/db/migration/
+-- V1__create_store.sql
+-- V2__create_admin.sql
+-- V3__create_store_table.sql
+-- V4__create_table_session.sql
+-- V5__create_category.sql
+-- V6__create_menu_item.sql
+-- V7__create_order.sql
+-- V8__create_order_item.sql
+-- V9__create_order_history.sql
+-- V10__seed_demo_data.sql
```

**프롬프트**:
```
테이블오더 서비스의 Database 마이그레이션 스크립트를 생성해주세요.

참조 문서:
- aidlc-docs/construction/database/functional-design/domain-entities.md (엔티티 상세)
- aidlc-docs/construction/database/functional-design/business-rules.md (제약조건)
- aidlc-docs/construction/database/functional-design/business-logic-model.md (시드 데이터, 마이그레이션 전략)

생성 위치: backend/src/main/resources/db/migration/
Flyway 네이밍: V1__ ~ V10__
PostgreSQL 문법으로 작성해주세요.
```

---

### 작업 2: Backend 프로젝트 초기 설정

Spring Boot 프로젝트 기반 파일을 생성합니다.

**생성할 파일**:

```
backend/
+-- build.gradle.kts
+-- settings.gradle.kts
+-- src/main/java/com/tableorder/TableOrderApplication.java
+-- src/main/resources/application.yml
+-- src/main/resources/application-dev.yml
+-- src/main/resources/application-test.yml
```

**프롬프트**:
```
Spring Boot 프로젝트 초기 설정을 생성해주세요.

기술 스택:
- Java 17, Spring Boot 3.x, Gradle (Kotlin DSL)
- 의존성: Spring Web, Spring Data JPA, Spring Security, PostgreSQL Driver, Flyway, Lombok, jjwt (JWT)

application.yml에 포함할 설정:
- PostgreSQL 연결 (환경변수로 관리)
- Flyway 활성화
- JWT 시크릿 (환경변수)
- CORS 설정 (localhost:5173 허용)
- 서버 포트: 8080

환경별 프로파일: dev, test, prod
생성 위치: backend/
```

---

### 작업 3: Backend common 패키지

공통 모듈을 생성합니다. 다른 담당자가 사용할 공유 코드입니다.

**생성할 파일**:

```
backend/src/main/java/com/tableorder/common/
+-- config/SecurityConfig.java
+-- config/CorsConfig.java
+-- security/JwtTokenProvider.java
+-- security/JwtAuthenticationFilter.java
+-- exception/GlobalExceptionHandler.java
+-- exception/BusinessException.java
+-- exception/ErrorCode.java
+-- dto/ApiResponse.java
```

**프롬프트**:
```
Backend 공통 모듈(common 패키지)을 생성해주세요.

포함 내용:
1. SecurityConfig - Spring Security 설정 (JWT 필터 등록, 엔드포인트별 권한)
2. CorsConfig - CORS 설정 (localhost:5173 허용)
3. JwtTokenProvider - JWT 토큰 생성/검증 (16시간 만료, 역할 구분: TABLE/ADMIN)
4. JwtAuthenticationFilter - 요청별 JWT 인증 필터
5. GlobalExceptionHandler - @RestControllerAdvice 전역 예외 처리
6. BusinessException + ErrorCode - 비즈니스 예외 enum
7. ApiResponse<T> - 공통 API 응답 래퍼 { success, data, error }

보안 규칙:
- 비밀번호는 bcrypt 해싱
- JWT 시크릿은 환경변수에서 로드
- /api/auth/** 는 인증 없이 접근 가능
- 나머지는 JWT 필수

참조: aidlc-docs/inception/application-design/component-methods.md (API 목록)
생성 위치: backend/src/main/java/com/tableorder/common/
```

---

### 작업 4: Backend auth + store 도메인

인증과 매장 도메인을 구현합니다.

**생성할 파일**:

```
backend/src/main/java/com/tableorder/
+-- auth/
|   +-- controller/AuthController.java
|   +-- service/AuthService.java
|   +-- dto/TableLoginRequest.java
|   +-- dto/TableLoginResponse.java
|   +-- dto/AdminLoginRequest.java
|   +-- dto/AdminLoginResponse.java
|   +-- dto/TokenResponse.java
+-- store/
|   +-- controller/StoreController.java
|   +-- service/StoreService.java
|   +-- repository/StoreRepository.java
|   +-- entity/Store.java
|   +-- dto/StoreResponse.java
```

**프롬프트**:
```
Backend auth 도메인과 store 도메인을 구현해주세요.

Auth 도메인:
- POST /api/auth/table/login - 테이블 로그인 (storeId + tableNumber + password)
- POST /api/auth/admin/login - 관리자 로그인 (storeId + username + password)
- POST /api/auth/token/refresh - JWT 갱신
- 로그인 실패 5회 시 30분 계정 잠금 (Admin만)
- JWT에 role(TABLE/ADMIN), storeId, tableId(테이블만) 포함

Store 도메인:
- GET /api/stores/{storeId} - 매장 정보 조회

참조:
- aidlc-docs/inception/application-design/component-methods.md (API 시그니처)
- aidlc-docs/construction/database/functional-design/domain-entities.md (엔티티)
- common 패키지의 JwtTokenProvider, ApiResponse 사용

생성 위치: backend/src/main/java/com/tableorder/
```

---

## 다른 담당자와의 인터페이스 약속

담당자 A가 만드는 코드 중 다른 담당자가 사용하는 것:

| 파일 | 사용하는 담당자 | 용도 |
| --- | --- | --- |
| `JwtTokenProvider` | B, C (간접) | JWT 토큰 검증 |
| `JwtAuthenticationFilter` | B, C (간접) | 요청 인증 |
| `ApiResponse<T>` | B, C | API 응답 래퍼 |
| `BusinessException` + `ErrorCode` | B, C | 예외 처리 |
| `SecurityConfig` | B, C (간접) | 엔드포인트 권한 설정 |
| `Store` entity | B | FK 참조 |
| DB 스키마 전체 | B, C (간접) | JPA 엔티티 매핑 기준 |

---

## 참조 문서

| 문서 | 경로 |
| --- | --- |
| DB 엔티티 | `aidlc-docs/construction/database/functional-design/domain-entities.md` |
| 비즈니스 규칙 | `aidlc-docs/construction/database/functional-design/business-rules.md` |
| 비즈니스 로직 | `aidlc-docs/construction/database/functional-design/business-logic-model.md` |
| API 시그니처 | `aidlc-docs/inception/application-design/component-methods.md` |
| 서비스 설계 | `aidlc-docs/inception/application-design/services.md` |
| 컴포넌트 정의 | `aidlc-docs/inception/application-design/components.md` |
