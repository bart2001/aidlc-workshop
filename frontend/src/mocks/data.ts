import type { Store, Category, MenuItem, StoreTable, Order, OrderItem } from '../types';

// 매장 시드 데이터
export const mockStore: Store = {
  id: 1,
  name: '맛있는 식당',
  createdAt: '2026-01-01T00:00:00',
};

// 카테고리 시드 데이터 (3개)
export const mockCategories: Category[] = [
  { id: 1, storeId: 1, name: '메인 메뉴', displayOrder: 1 },
  { id: 2, storeId: 1, name: '사이드', displayOrder: 2 },
  { id: 3, storeId: 1, name: '음료', displayOrder: 3 },
];

// 메뉴 시드 데이터 (9개)
export const mockMenuItems: MenuItem[] = [
  { id: 1, storeId: 1, categoryId: 1, name: '불고기 정식', price: 12000, description: '소고기 불고기와 밑반찬 세트', imageUrl: null, displayOrder: 1 },
  { id: 2, storeId: 1, categoryId: 1, name: '김치찌개', price: 9000, description: '돼지고기 김치찌개', imageUrl: null, displayOrder: 2 },
  { id: 3, storeId: 1, categoryId: 1, name: '된장찌개', price: 8000, description: '두부 된장찌개', imageUrl: null, displayOrder: 3 },
  { id: 4, storeId: 1, categoryId: 2, name: '계란말이', price: 5000, description: '부드러운 계란말이', imageUrl: null, displayOrder: 1 },
  { id: 5, storeId: 1, categoryId: 2, name: '김치전', price: 7000, description: '바삭한 김치전', imageUrl: null, displayOrder: 2 },
  { id: 6, storeId: 1, categoryId: 2, name: '떡볶이', price: 6000, description: '매콤 떡볶이', imageUrl: null, displayOrder: 3 },
  { id: 7, storeId: 1, categoryId: 3, name: '콜라', price: 2000, description: null, imageUrl: null, displayOrder: 1 },
  { id: 8, storeId: 1, categoryId: 3, name: '사이다', price: 2000, description: null, imageUrl: null, displayOrder: 2 },
  { id: 9, storeId: 1, categoryId: 3, name: '맥주', price: 5000, description: '생맥주 500ml', imageUrl: null, displayOrder: 3 },
];

// 테이블 시드 데이터 (5개)
export const mockTables: StoreTable[] = [
  { id: 1, storeId: 1, tableNumber: 1 },
  { id: 2, storeId: 1, tableNumber: 2 },
  { id: 3, storeId: 1, tableNumber: 3 },
  { id: 4, storeId: 1, tableNumber: 4 },
  { id: 5, storeId: 1, tableNumber: 5 },
];

// 주문 Mock 상태 관리
let nextOrderId = 1;
let nextOrderNumber = 1;
let mockOrders: Order[] = [];

export function getMockOrders(): Order[] {
  return mockOrders;
}

export function createMockOrder(
  storeId: number,
  tableId: number,
  sessionId: number,
  items: { menuItemId: number; menuName: string; quantity: number; unitPrice: number }[],
  totalAmount: number,
): Order {
  const orderItems: OrderItem[] = items.map((item, idx) => ({
    id: idx + 1,
    orderId: nextOrderId,
    menuItemId: item.menuItemId,
    menuName: item.menuName,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
  }));

  const order: Order = {
    id: nextOrderId++,
    storeId,
    tableId,
    sessionId,
    orderNumber: nextOrderNumber++,
    status: 'PENDING',
    totalAmount,
    items: orderItems,
    createdAt: new Date().toISOString(),
  };

  mockOrders.push(order);
  return order;
}

export function updateMockOrderStatus(orderId: number, status: Order['status']): Order | null {
  const order = mockOrders.find((o) => o.id === orderId);
  if (order) {
    order.status = status;
    return order;
  }
  return null;
}

export function deleteMockOrder(orderId: number): boolean {
  const idx = mockOrders.findIndex((o) => o.id === orderId);
  if (idx >= 0) {
    mockOrders.splice(idx, 1);
    return true;
  }
  return false;
}
