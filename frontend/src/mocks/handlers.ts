/**
 * Mock API 핸들러
 * 환경변수 VITE_USE_MOCK=true 시 활성화
 * 실제 백엔드 없이 프론트엔드 개발/테스트 가능
 */
import type { ApiResponse, LoginResponse, Order, Category, MenuItem } from '../types';
import {
  mockStore,
  mockCategories,
  mockMenuItems,
  mockTables,
  getMockOrders,
  createMockOrder,
  updateMockOrderStatus,
  deleteMockOrder,
} from './data';

// Mock 응답 헬퍼
function ok<T>(data: T): ApiResponse<T> {
  return { success: true, data, error: null };
}

function err<T>(message: string): ApiResponse<T> {
  return { success: false, data: null, error: message };
}

// 지연 시뮬레이션 (200~500ms)
function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300));
}

type MockHandler = (url: string, options?: { data?: unknown }) => Promise<unknown>;

// URL 패턴 매칭
const handlers: { method: string; pattern: RegExp; handler: MockHandler }[] = [
  // 테이블 로그인
  {
    method: 'POST',
    pattern: /\/api\/auth\/table\/login$/,
    handler: async (_url, options) => {
      await delay();
      const body = options?.data as { storeId: number; tableNumber: number; password: string } | undefined;
      if (!body) return { data: err('요청 데이터가 없습니다.') };
      const table = mockTables.find((t) => t.storeId === body.storeId && t.tableNumber === body.tableNumber);
      if (!table) return { data: err('테이블을 찾을 수 없습니다.') };
      const response: LoginResponse = {
        accessToken: 'mock-jwt-token-table',
        storeId: body.storeId,
        tableId: table.id,
        role: 'TABLE',
      };
      return { data: ok(response) };
    },
  },
  // 관리자 로그인
  {
    method: 'POST',
    pattern: /\/api\/auth\/admin\/login$/,
    handler: async (_url, options) => {
      await delay();
      const body = options?.data as { storeId: number; username: string; password: string } | undefined;
      if (!body) return { data: err('요청 데이터가 없습니다.') };
      const response: LoginResponse = {
        accessToken: 'mock-jwt-token-admin',
        storeId: body.storeId,
        role: 'ADMIN',
      };
      return { data: ok(response) };
    },
  },
  // 매장 정보
  {
    method: 'GET',
    pattern: /\/api\/stores\/(\d+)$/,
    handler: async () => {
      await delay();
      return { data: ok(mockStore) };
    },
  },
  // 카테고리 목록
  {
    method: 'GET',
    pattern: /\/api\/stores\/(\d+)\/categories$/,
    handler: async () => {
      await delay();
      return { data: ok<Category[]>(mockCategories) };
    },
  },
  // 메뉴 목록
  {
    method: 'GET',
    pattern: /\/api\/stores\/(\d+)\/menus$/,
    handler: async (url) => {
      await delay();
      const categoryMatch = url.match(/categoryId=(\d+)/);
      let items: MenuItem[] = mockMenuItems;
      if (categoryMatch) {
        items = mockMenuItems.filter((m) => m.categoryId === Number(categoryMatch[1]));
      }
      return { data: ok<MenuItem[]>(items) };
    },
  },
  // 주문 생성
  {
    method: 'POST',
    pattern: /\/api\/stores\/(\d+)\/orders$/,
    handler: async (url, options) => {
      await delay();
      const storeIdMatch = url.match(/\/api\/stores\/(\d+)\/orders$/);
      const storeId = storeIdMatch ? Number(storeIdMatch[1]) : 1;
      const body = options?.data as {
        tableId: number;
        sessionId: number;
        items: { menuItemId: number; menuName: string; quantity: number; unitPrice: number }[];
        totalAmount: number;
      };
      const order = createMockOrder(storeId, body.tableId, body.sessionId, body.items, body.totalAmount);
      return { data: ok<Order>(order) };
    },
  },
  // 주문 목록
  {
    method: 'GET',
    pattern: /\/api\/stores\/(\d+)\/orders$/,
    handler: async () => {
      await delay();
      return { data: ok<Order[]>(getMockOrders()) };
    },
  },
  // 주문 상태 변경
  {
    method: 'PATCH',
    pattern: /\/api\/stores\/(\d+)\/orders\/(\d+)$/,
    handler: async (url, options) => {
      await delay();
      const match = url.match(/\/orders\/(\d+)$/);
      const orderId = match ? Number(match[1]) : 0;
      const body = options?.data as { status: Order['status'] };
      const order = updateMockOrderStatus(orderId, body.status);
      if (!order) return { data: err('주문을 찾을 수 없습니다.') };
      return { data: ok<Order>(order) };
    },
  },
  // 주문 삭제
  {
    method: 'DELETE',
    pattern: /\/api\/stores\/(\d+)\/orders\/(\d+)$/,
    handler: async (url) => {
      await delay();
      const match = url.match(/\/orders\/(\d+)$/);
      const orderId = match ? Number(match[1]) : 0;
      const success = deleteMockOrder(orderId);
      if (!success) return { data: err('주문을 찾을 수 없습니다.') };
      return { data: ok(null) };
    },
  },
  // 테이블 목록
  {
    method: 'GET',
    pattern: /\/api\/stores\/(\d+)\/tables$/,
    handler: async () => {
      await delay();
      return { data: ok(mockTables) };
    },
  },
];

/**
 * Mock 인터셉터 설정
 * axios 인스턴스에 요청 인터셉터를 추가하여 Mock 응답 반환
 */
export function findMockHandler(method: string, url: string): MockHandler | null {
  const entry = handlers.find((h) => h.method === method.toUpperCase() && h.pattern.test(url));
  return entry ? entry.handler : null;
}
