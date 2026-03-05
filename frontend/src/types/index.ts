// 테이블오더 서비스 - 공통 타입 정의
// 담당자 C 머지 시 통합 예정

export type OrderStatus = 'PENDING' | 'PREPARING' | 'COMPLETED';
export type UserRole = 'ADMIN' | 'TABLE';

export interface Store {
  id: number;
  name: string;
  createdAt: string;
}

export interface Admin {
  id: number;
  storeId: number;
  username: string;
}

export interface StoreTable {
  id: number;
  storeId: number;
  tableNumber: number;
  createdAt: string;
}

export interface TableSession {
  id: number;
  tableId: number;
  storeId: number;
  isActive: boolean;
  startedAt: string;
  endedAt: string | null;
}

export interface Category {
  id: number;
  storeId: number;
  name: string;
  displayOrder: number;
}

export interface MenuItem {
  id: number;
  storeId: number;
  categoryId: number;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  displayOrder: number;
}

export interface Order {
  id: number;
  storeId: number;
  tableId: number;
  sessionId: number;
  orderNumber: number;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  menuItemId: number | null;
  menuName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderHistory {
  id: number;
  storeId: number;
  tableId: number;
  sessionId: number;
  orderDataJson: { orders: Order[] };
  totalAmount: number;
  completedAt: string;
}

// === API Request/Response Types ===
export interface AdminLoginRequest {
  storeId: number;
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  storeId: number;
  username: string;
  role: UserRole;
}

export interface CategoryCreateRequest {
  name: string;
  displayOrder: number;
}

export interface CategoryUpdateRequest {
  name: string;
  displayOrder: number;
}

export interface MenuItemCreateRequest {
  categoryId: number;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  displayOrder: number;
}

export interface MenuItemUpdateRequest {
  categoryId: number;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  displayOrder: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface OrderEvent {
  type: 'NEW_ORDER' | 'STATUS_CHANGED' | 'ORDER_DELETED' | 'SESSION_COMPLETED';
  order?: Order;
  orderId?: number;
  tableId?: number;
  storeId?: number;
}
