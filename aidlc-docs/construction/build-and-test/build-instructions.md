# 테이블오더 서비스 - Build Instructions

## 1. 사전 요구사항

| 도구 | 버전 | 용도 |
|---|---|---|
| JDK | 17+ | Backend 빌드/실행 |
| Gradle | 8+ (Wrapper 포함) | Backend 빌드 |
| Node.js | 20+ | Frontend 빌드 |
| npm | 10+ | Frontend 패키지 관리 |
| Docker | 24+ | 컨테이너 빌드 |
| PostgreSQL | 15+ | 로컬 개발 DB |

---

## 2. Backend 빌드 (Gradle)

### 2.1 로컬 개발

```bash
# 프로젝트 루트에서
cd backend

# 의존성 다운로드
./gradlew dependencies

# 컴파일
./gradlew compileJava

# 테스트 실행
./gradlew test

# 실행 가능한 JAR 빌드
./gradlew bootJar

# 애플리케이션 실행 (dev 프로파일)
./gradlew bootRun --args='--spring.profiles.active=dev'
```

### 2.2 환경별 설정 파일

```
backend/src/main/resources/
├── application.yml          # 공통 설정
├── application-dev.yml      # 개발 환경
├── application-prod.yml     # 운영 환경
└── application-test.yml     # 테스트 환경
```

### 2.3 주요 설정 항목

```yaml
# application-dev.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/tableorder_dev
    username: dev_user
    password: dev_password
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

jwt:
  secret: dev-secret-key-minimum-32-characters-long
  expiration: 57600000  # 16시간 (ms)

server:
  port: 8080
```

---

## 3. Frontend 빌드 (Vite)

### 3.1 로컬 개발

```bash
cd frontend

# 의존성 설치
npm ci

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

### 3.2 환경변수

```bash
# frontend/.env.development
VITE_API_URL=http://localhost:8080
VITE_USE_MOCK=false

# frontend/.env.production
VITE_API_URL=https://tableorder.example.com
VITE_USE_MOCK=false
```

### 3.3 빌드 출력

```
frontend/dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
```

---

## 4. Docker 이미지 빌드

### 4.1 통합 빌드 (권장)

```bash
# 프로젝트 루트에서
docker build -t tableorder:latest .

# 실행
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=dev \
  -e DATABASE_URL=jdbc:postgresql://host.docker.internal:5432/tableorder_dev \
  -e DATABASE_USERNAME=dev_user \
  -e DATABASE_PASSWORD=dev_password \
  -e JWT_SECRET=dev-secret-key-minimum-32-characters-long \
  tableorder:latest
```

### 4.2 Docker Compose (로컬 개발)

```yaml
# docker-compose.yml
version: '3.8'
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: tableorder_dev
      POSTGRES_USER: dev_user
      POSTGRES_PASSWORD: dev_password
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: dev
      DATABASE_URL: jdbc:postgresql://db:5432/tableorder_dev
      DATABASE_USERNAME: dev_user
      DATABASE_PASSWORD: dev_password
      JWT_SECRET: dev-secret-key-minimum-32-characters-long
    depends_on:
      - db

volumes:
  pgdata:
```

```bash
# 실행
docker compose up -d

# 종료
docker compose down
```

---

## 5. 환경별 빌드 요약

| 환경 | Backend | Frontend | 실행 방식 |
|---|---|---|---|
| 로컬 개발 | `gradlew bootRun` | `npm run dev` | 별도 프로세스 |
| 로컬 Docker | `docker compose up` | Docker 내 포함 | Docker Compose |
| dev 서버 | Docker 이미지 | Docker 내 포함 | ECS Fargate |
| prod 서버 | Docker 이미지 | Docker 내 포함 | ECS Fargate |
