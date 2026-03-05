// === 공통 ===
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

// === 엔티티 ===
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

export type OrderStatus = 'PENDING' | 'PREPARING' | 'COMPLETED';

export interface OrderItem {
  id: number;
  orderId: number;
  menuItemId: number | null;
  menuName: string;
  quantity: number;
  unitPrice: number;
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

export interface OrderHistory {
  id: number;
  storeId: number;
  tableId: number;
  sessionId: number;
  orderDataJson: OrderHistoryData;
  totalAmount: number;
  completedAt: string;
}

export interface OrderHistoryData {
  orders: OrderHistoryOrder[];
  sessionTotalAmount: number;
  orderCount: number;
}

export interface OrderHistoryOrder {
  orderNumber: number;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: { menuName: string; quantity: number; unitPrice: number }[];
}

// === 요청/응답 ===
export interface TableLoginRequest {
  storeId: number;
  tableNumber: number;
  password: string;
}

export interface AdminLoginRequest {
  storeId: number;
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  storeId: number;
  tableId?: number;
  role: 'TABLE' | 'ADMIN';
}

export interface OrderCreateRequest {
  tableId: number;
  sessionId: number;
  items: { menuItemId: number; menuName: string; quantity: number; unitPrice: number }[];
  totalAmount: number;
}

export interface CartItem {
  menuItemId: number;
  menuName: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string | null;
}
