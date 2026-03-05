import { create } from 'zustand';
import type { Order, OrderEvent } from '../types';

interface OrderState {
  orders: Order[];
  eventSource: EventSource | null;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  removeOrder: (orderId: number) => void;
  clearOrdersByTable: (tableId: number) => void;
  connectSSE: (storeId: number) => void;
  disconnectSSE: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  eventSource: null,

  setOrders: (orders) => set({ orders }),

  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),

  updateOrder: (order) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === order.id ? order : o)),
    })),

  removeOrder: (orderId) =>
    set((state) => ({
      orders: state.orders.filter((o) => o.id !== orderId),
    })),

  clearOrdersByTable: (tableId) =>
    set((state) => ({
      orders: state.orders.filter((o) => o.tableId !== tableId),
    })),

  connectSSE: (storeId) => {
    const existing = get().eventSource;
    if (existing) existing.close();

    const token = localStorage.getItem('token');
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const url = `${baseURL}/api/stores/${storeId}/orders/stream?token=${token}`;
    const es = new EventSource(url);

    es.onmessage = (event) => {
      const data: OrderEvent = JSON.parse(event.data);
      switch (data.type) {
        case 'NEW_ORDER':
          if (data.order) get().addOrder(data.order);
          break;
        case 'STATUS_CHANGED':
          if (data.order) get().updateOrder(data.order);
          break;
        case 'ORDER_DELETED':
          if (data.orderId) get().removeOrder(data.orderId);
          break;
        case 'SESSION_COMPLETED':
          if (data.tableId) get().clearOrdersByTable(data.tableId);
          break;
      }
    };

    es.onerror = () => {
      es.close();
      // 자동 재연결 (3초 후)
      setTimeout(() => get().connectSSE(storeId), 3000);
    };

    set({ eventSource: es });
  },

  disconnectSSE: () => {
    const es = get().eventSource;
    if (es) es.close();
    set({ eventSource: null });
  },
}));
