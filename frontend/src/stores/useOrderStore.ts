import { create } from 'zustand';
import type { Order } from '../types';

interface OrderState {
  orders: Order[];
  eventSource: EventSource | null;
  setOrders: (orders: Order[]) => void;
  updateOrder: (order: Order) => void;
  removeOrder: (orderId: number) => void;
  connectSSE: (url: string) => void;
  disconnectSSE: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  eventSource: null,

  setOrders: (orders) => set({ orders }),

  updateOrder: (order) => {
    const existing = get().orders.find((o) => o.id === order.id);
    if (existing) {
      set({ orders: get().orders.map((o) => (o.id === order.id ? order : o)) });
    } else {
      set({ orders: [order, ...get().orders] });
    }
  },

  removeOrder: (orderId) => {
    set({ orders: get().orders.filter((o) => o.id !== orderId) });
  },

  connectSSE: (url) => {
    get().disconnectSSE();
    const token = localStorage.getItem('accessToken');
    const eventSource = new EventSource(`${url}${url.includes('?') ? '&' : '?'}token=${token}`);

    eventSource.addEventListener('ORDER_CREATED', (e) => {
      const order = JSON.parse(e.data) as Order;
      get().updateOrder(order);
    });

    eventSource.addEventListener('ORDER_STATUS_CHANGED', (e) => {
      const order = JSON.parse(e.data) as Order;
      get().updateOrder(order);
    });

    eventSource.addEventListener('ORDER_DELETED', (e) => {
      const { orderId } = JSON.parse(e.data) as { orderId: number };
      get().removeOrder(orderId);
    });

    eventSource.onerror = () => {
      eventSource.close();
      // 3초 후 재연결
      setTimeout(() => get().connectSSE(url), 3000);
    };

    set({ eventSource });
  },

  disconnectSSE: () => {
    const es = get().eventSource;
    if (es) {
      es.close();
      set({ eventSource: null });
    }
  },
}));
