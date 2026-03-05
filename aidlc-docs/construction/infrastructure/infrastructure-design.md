# 테이블오더 서비스 - AWS Infrastructure Design

## 1. 아키텍처 개요

모놀리스 아키텍처 (Spring Boot + React SPA)를 AWS 위에 배포합니다.
MVP 규모로 비용 최적화를 우선하며, SSE 실시간 통신을 안정적으로 지원합니다.

```
[CloudFront] → [ALB] → [ECS Fargate] → [RDS PostgreSQL]
                              ↑
                        [S3: Frontend Static]
```

---

## 2. AWS 리소스 구성

### 2.1 컴퓨팅: ECS Fargate

| 항목 | 설정 |
|---|---|
| 서비스 | ECS Fargate |
| Task 수 | dev: 1, prod: 2 (최소) |
| CPU/Memory | 0.5 vCPU / 1GB (dev), 1 vCPU / 2GB (prod) |
| 컨테이너 | 단일 컨테이너 (Spring Boot + 내장 정적 파일) |
| Auto Scaling | prod: CPU 70% 기준, min 2 / max 4 |

선택 근거: Fargate는 서버 관리 불필요, MVP에 적합한 비용 구조.

### 2.2 로드밸런서: ALB (Application Load Balancer)

| 항목 | 설정 |
|---|---|
| 타입 | ALB |
| 리스너 | HTTPS:443 → Target Group |
| SSL | ACM 인증서 (무료) |
| Sticky Session | 활성화 (SSE 연결 유지용, duration: 1시간) |
| Health Check | `/actuator/health`, interval 30s |

SSE 지원: ALB sticky session으로 SSE 연결이 동일 인스턴스에 유지됩니다.
idle timeout을 300초로 설정하여 SSE 연결 유지.

### 2.3 데이터베이스: RDS PostgreSQL

| 항목 | 설정 |
|---|---|
| 엔진 | PostgreSQL 15 |
| 인스턴스 | db.t3.micro (dev), db.t3.small (prod) |
| 스토리지 | 20GB gp3 |
| Multi-AZ | dev: 비활성, prod: 활성 |
| 백업 | 자동 백업 7일 보존 |
| 암호화 | 활성화 (AWS KMS) |

### 2.4 CDN / 정적 파일: CloudFront + S3

| 항목 | 설정 |
|---|---|
| S3 | 프론트엔드 빌드 결과물 호스팅 (선택적) |
| CloudFront | HTTPS 종단, 캐싱, `/api/*` → ALB origin, `/*` → S3 origin |

MVP 단순화 옵션: Spring Boot에서 정적 파일을 직접 서빙하여 S3/CloudFront 없이 운영 가능.
이 경우 ALB만으로 모든 트래픽 처리.

---

## 3. VPC / 서브넷 / 보안그룹 설계

### 3.1 VPC

```
VPC: 10.0.0.0/16

Public Subnets (ALB):
  - 10.0.1.0/24 (AZ-a)
  - 10.0.2.0/24 (AZ-c)

Private Subnets (ECS Fargate):
  - 10.0.11.0/24 (AZ-a)
  - 10.0.12.0/24 (AZ-c)

Private Subnets (RDS):
  - 10.0.21.0/24 (AZ-a)
  - 10.0.22.0/24 (AZ-c)
```

### 3.2 보안그룹

| 보안그룹 | 인바운드 | 아웃바운드 |
|---|---|---|
| SG-ALB | 0.0.0.0/0:443 (HTTPS) | SG-ECS:8080 |
| SG-ECS | SG-ALB:8080 | SG-RDS:5432, 0.0.0.0/0:443 (외부 API) |
| SG-RDS | SG-ECS:5432 | 없음 |

### 3.3 NAT Gateway

- Private 서브넷의 ECS 태스크가 외부 통신 (ECR 이미지 풀 등)을 위해 NAT Gateway 필요
- 비용 절감: dev 환경은 NAT Gateway 1개, prod는 AZ별 1개

---

## 4. 환경 분리 (dev / prod)

| 항목 | dev | prod |
|---|---|---|
| ECS Task 수 | 1 | 2~4 (Auto Scaling) |
| ECS CPU/Mem | 0.5 vCPU / 1GB | 1 vCPU / 2GB |
| RDS 인스턴스 | db.t3.micro | db.t3.small |
| RDS Multi-AZ | 비활성 | 활성 |
| NAT Gateway | 1개 | 2개 |
| CloudFront | 선택적 | 활성 |
| 도메인 | dev.tableorder.example.com | tableorder.example.com |

환경별 설정은 ECS Task Definition의 환경변수로 관리:
- `SPRING_PROFILES_ACTIVE`: dev / prod
- `DATABASE_URL`: 환경별 RDS 엔드포인트
- `JWT_SECRET`: AWS Secrets Manager에서 주입

---

## 5. 배포 전략

### 5.1 CI/CD 파이프라인

```
GitHub Push → GitHub Actions → Docker Build → ECR Push → ECS Deploy
```

1. GitHub Actions 워크플로우:
   - Frontend 빌드 (Vite)
   - Backend 빌드 (Gradle)
   - Docker 이미지 빌드 & ECR 푸시
   - ECS 서비스 업데이트 (Rolling Update)

### 5.2 배포 방식

- dev: Rolling Update (다운타임 허용)
- prod: Rolling Update (minimum healthy percent: 100%, maximum percent: 200%)

### 5.3 롤백

- ECS 이전 Task Definition 리비전으로 즉시 롤백 가능
- RDS 자동 백업에서 특정 시점 복원 가능

---

## 6. 비용 추정 (월간, 서울 리전 기준)

### 6.1 dev 환경

| 리소스 | 사양 | 월 비용 (USD) |
|---|---|---|
| ECS Fargate | 0.5 vCPU, 1GB, 1 task, 24h | ~$15 |
| RDS PostgreSQL | db.t3.micro, 20GB | ~$15 |
| ALB | 1개 | ~$18 |
| NAT Gateway | 1개 | ~$35 |
| ECR | 이미지 저장 | ~$1 |
| **합계** | | **~$84/월** |

### 6.2 prod 환경

| 리소스 | 사양 | 월 비용 (USD) |
|---|---|---|
| ECS Fargate | 1 vCPU, 2GB, 2 tasks, 24h | ~$60 |
| RDS PostgreSQL | db.t3.small, Multi-AZ, 20GB | ~$50 |
| ALB | 1개 | ~$18 |
| NAT Gateway | 2개 | ~$70 |
| CloudFront | 기본 사용량 | ~$5 |
| ACM | SSL 인증서 | 무료 |
| Secrets Manager | 2개 시크릿 | ~$1 |
| **합계** | | **~$204/월** |

비용 절감 팁:
- dev 환경은 업무 시간만 운영 (Fargate Scheduled Scaling) → 약 60% 절감
- NAT Gateway 대신 VPC Endpoint 활용 (ECR, S3, CloudWatch)
- RDS Reserved Instance (1년) → 약 30% 절감

---

## 7. Dockerfile

### 7.1 Backend + Frontend 통합 빌드 (Multi-stage)

```dockerfile
# Stage 1: Frontend 빌드
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Backend 빌드
FROM gradle:8-jdk17 AS backend-build
WORKDIR /app
COPY backend/build.gradle backend/settings.gradle ./
COPY backend/gradle ./gradle
RUN gradle dependencies --no-daemon || true
COPY backend/ ./
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static
RUN gradle bootJar --no-daemon

# Stage 3: 실행 이미지
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=backend-build /app/build/libs/*.jar app.jar

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 7.2 환경변수

```yaml
# ECS Task Definition 환경변수
environment:
  - name: SPRING_PROFILES_ACTIVE
    value: prod
  - name: SERVER_PORT
    value: "8080"
secrets:
  - name: DATABASE_URL
    valueFrom: arn:aws:secretsmanager:ap-northeast-2:ACCOUNT:secret:tableorder/db-url
  - name: JWT_SECRET
    valueFrom: arn:aws:secretsmanager:ap-northeast-2:ACCOUNT:secret:tableorder/jwt-secret
```

---

## 8. 아키텍처 다이어그램

```
                    ┌─────────────┐
                    │ CloudFront  │
                    │  (HTTPS)    │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │     ALB     │
                    │ (Sticky     │
                    │  Session)   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────▼─────┐ ┌───▼───┐ ┌─────▼─────┐
        │ ECS Task  │ │  ...  │ │ ECS Task  │
        │ (Fargate) │ │       │ │ (Fargate) │
        └─────┬─────┘ └───┬───┘ └─────┬─────┘
              │            │            │
              └────────────┼────────────┘
                           │
                    ┌──────▼──────┐
                    │    RDS      │
                    │ PostgreSQL  │
                    │ (Multi-AZ)  │
                    └─────────────┘
```

---

## 9. 보안 고려사항

- HTTPS 필수 (ACM 인증서 + ALB/CloudFront)
- RDS는 Private 서브넷에만 배치, 퍼블릭 접근 차단
- ECS 태스크에 최소 권한 IAM Role 부여
- 시크릿은 AWS Secrets Manager로 관리
- 보안그룹으로 네트워크 레벨 접근 제어
- RDS 암호화 활성화 (at-rest + in-transit)
