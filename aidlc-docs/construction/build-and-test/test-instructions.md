# 테이블오더 서비스 - Test Instructions

## 1. Backend 단위 테스트 (JUnit 5 + Mockito)

### 1.1 테스트 구조

```
backend/src/test/java/com/tableorder/
├── auth/
│   ├── AuthControllerTest.java
│   └── AuthServiceTest.java
├── menu/
│   ├── MenuControllerTest.java
│   └── MenuServiceTest.java
├── order/
│   ├── OrderControllerTest.java
│   ├── OrderServiceTest.java
│   └── OrderSseServiceTest.java
├── table/
│   ├── TableControllerTest.java
│   └── TableServiceTest.java
└── store/
    └── StoreServiceTest.java
```

### 1.2 실행 명령

```bash
cd backend

# 전체 테스트
./gradlew test

# 특정 클래스
./gradlew test --tests "com.tableorder.order.OrderServiceTest"

# 테스트 리포트 확인
# build/reports/tests/test/index.html
```

### 1.3 테스트 패턴

```java
// Service 테스트 예시
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private OrderSseService orderSseService;
    @InjectMocks private OrderService orderService;

    @Test
    @DisplayName("주문 상태 변경 - PENDING → PREPARING 성공")
    void updateOrderStatus_success() {
        // Given
        Order order = createTestOrder(OrderStatus.PENDING);
        when(orderRepository.findByStoreIdAndId(1L, 1L))
            .thenReturn(Optional.of(order));

        // When
        OrderResponse result = orderService.updateOrderStatus(1L, 1L, OrderStatus.PREPARING);

        // Then
        assertThat(result.getStatus()).isEqualTo(OrderStatus.PREPARING);
        verify(orderSseService).publishOrderEvent(eq(1L), any(OrderEvent.class));
    }

    @Test
    @DisplayName("주문 상태 변경 - 역방향 전이 불가")
    void updateOrderStatus_invalidTransition() {
        // Given
        Order order = createTestOrder(OrderStatus.COMPLETED);
        when(orderRepository.findByStoreIdAndId(1L, 1L))
            .thenReturn(Optional.of(order));

        // When & Then
        assertThrows(InvalidStatusTransitionException.class,
            () -> orderService.updateOrderStatus(1L, 1L, OrderStatus.PREPARING));
    }
}
```

```java
// Controller 테스트 예시
@WebMvcTest(OrderController.class)
class OrderControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private OrderService orderService;

    @Test
    @DisplayName("POST /api/stores/{storeId}/orders - 주문 생성 성공")
    @WithMockUser(roles = "TABLE")
    void createOrder_success() throws Exception {
        // Given
        OrderResponse response = createTestOrderResponse();
        when(orderService.createOrder(eq(1L), any())).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/stores/1/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.data.orderNumber").exists());
    }
}
```

### 1.4 주요 테스트 케이스

| 서비스 | 테스트 케이스 | 우선순위 |
|---|---|---|
| AuthService | 관리자 로그인 성공/실패, 로그인 시도 제한, JWT 발급/검증 | Must |
| OrderService | 주문 생성, 상태 변경 (정방향/역방향), 주문 삭제, 이력 이동 | Must |
| MenuService | 메뉴 CRUD, 카테고리 CRUD, 필수 필드 검증, 가격 범위 검증 | Must |
| TableService | 테이블 등록/수정, 세션 시작/종료 | Must |
| OrderSseService | SSE 구독/해제, 이벤트 발행 | Must |

---

## 2. Frontend 단위 테스트 (Vitest + React Testing Library)

### 2.1 테스트 구조

```
frontend/src/
├── __tests__/
│   ├── pages/admin/
│   │   ├── AdminLoginPage.test.tsx
│   │   ├── DashboardPage.test.tsx
│   │   ├── MenuManagementPage.test.tsx
│   │   └── TableManagementPage.test.tsx
│   ├── components/admin/
│   │   ├── TableCard.test.tsx
│   │   ├── OrderDetailModal.test.tsx
│   │   ├── MenuForm.test.tsx
│   │   ├── CategoryForm.test.tsx
│   │   ├── TableForm.test.tsx
│   │   └── OrderHistoryModal.test.tsx
│   └── stores/
│       ├── useAuthStore.test.ts
│       ├── useOrderStore.test.ts
│       └── useMenuStore.test.ts
```

### 2.2 실행 명령

```bash
cd frontend

# 전체 테스트 (단일 실행)
npx vitest --run

# 특정 파일
npx vitest --run src/__tests__/pages/admin/AdminLoginPage.test.tsx

# 커버리지
npx vitest --run --coverage
```

### 2.3 테스트 패턴

```tsx
// 페이지 테스트 예시
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import AdminLoginPage from '../../../pages/admin/AdminLoginPage';

// API Mock
vi.mock('../../../api/auth', () => ({
  adminLogin: vi.fn(),
}));

describe('AdminLoginPage', () => {
  it('모든 입력 필드가 렌더링된다', () => {
    render(
      <MemoryRouter>
        <AdminLoginPage />
      </MemoryRouter>
    );
    expect(screen.getByLabelText('매장 ID')).toBeInTheDocument();
    expect(screen.getByLabelText('사용자명')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
  });

  it('빈 필드로 제출 시 에러 메시지 표시', async () => {
    render(
      <MemoryRouter>
        <AdminLoginPage />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('로그인'));
    expect(await screen.findByText('모든 필드를 입력해주세요.')).toBeInTheDocument();
  });

  it('5회 실패 시 잠금 안내 표시', async () => {
    const { adminLogin } = await import('../../../api/auth');
    (adminLogin as any).mockRejectedValue({ response: { data: { error: '인증 실패' } } });

    render(
      <MemoryRouter>
        <AdminLoginPage />
      </MemoryRouter>
    );

    for (let i = 0; i < 5; i++) {
      fireEvent.change(screen.getByLabelText('매장 ID'), { target: { value: '1' } });
      fireEvent.change(screen.getByLabelText('사용자명'), { target: { value: 'admin' } });
      fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'wrong' } });
      fireEvent.click(screen.getByText('로그인'));
      await waitFor(() => {});
    }

    expect(await screen.findByText(/로그인 시도 횟수를 초과/)).toBeInTheDocument();
  });
});
```

```tsx
// 컴포넌트 테스트 예시
import { render, screen } from '@testing-library/react';
import TableCard from '../../../components/admin/TableCard';

describe('TableCard', () => {
  const mockOrders = [
    { id: 1, orderNumber: 1, status: 'PENDING', totalAmount: 15000, items: [], /* ... */ },
  ];

  it('테이블 번호와 총 주문액을 표시한다', () => {
    render(<TableCard tableNumber={1} tableId={1} orders={mockOrders} onClick={() => {}} />);
    expect(screen.getByText('테이블 1')).toBeInTheDocument();
    expect(screen.getByText('15,000원')).toBeInTheDocument();
  });

  it('신규 주문 시 하이라이트 클래스가 적용된다', () => {
    const { container } = render(
      <TableCard tableNumber={1} tableId={1} orders={mockOrders} isNewOrder onClick={() => {}} />
    );
    expect(container.querySelector('.table-card--highlight')).toBeInTheDocument();
  });
});
```

### 2.4 주요 테스트 케이스

| 컴포넌트 | 테스트 케이스 | 우선순위 |
|---|---|---|
| AdminLoginPage | 필드 렌더링, 빈 필드 검증, 로그인 성공/실패, 5회 잠금 | Must |
| DashboardPage | 테이블 카드 렌더링, 주문 상태 변경, 주문 삭제, 이용 완료 | Must |
| MenuManagementPage | 카테고리 CRUD, 메뉴 CRUD, 필수 필드 검증, 순서 변경 | Must |
| TableManagementPage | 테이블 목록, 등록/수정, 과거 내역 모달 | Must |
| MenuForm | 필수 필드 검증, 가격 범위 검증, 수정 모드 초기값 | Must |
| OrderDetailModal | 주문 목록, 상태 변경 버튼, 삭제 확인 팝업 | Must |
| useAuthStore | login/logout, localStorage 연동, initialize | Must |
| useOrderStore | SSE 이벤트 처리, 주문 CRUD | Must |

---

## 3. 테스트 커버리지 기준

| 영역 | 목표 커버리지 |
|---|---|
| Backend Service 레이어 | 80% 이상 |
| Backend Controller 레이어 | 70% 이상 |
| Frontend 페이지 컴포넌트 | 70% 이상 |
| Frontend 공통 컴포넌트 | 80% 이상 |
| Zustand 스토어 | 90% 이상 |
| 전체 | 75% 이상 |
