import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  storeId: number | null;
  tableId: number | null;
  role: 'TABLE' | 'ADMIN' | null;
  login: (token: string, storeId: number, role: 'TABLE' | 'ADMIN', tableId?: number) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: localStorage.getItem('accessToken'),
  storeId: localStorage.getItem('storeId') ? Number(localStorage.getItem('storeId')) : null,
  tableId: localStorage.getItem('tableId') ? Number(localStorage.getItem('tableId')) : null,
  role: localStorage.getItem('role') as 'TABLE' | 'ADMIN' | null,

  login: (token, storeId, role, tableId) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('storeId', String(storeId));
    localStorage.setItem('role', role);
    if (tableId) localStorage.setItem('tableId', String(tableId));
    set({ accessToken: token, storeId, role, tableId: tableId ?? null });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('storeId');
    localStorage.removeItem('tableId');
    localStorage.removeItem('role');
    set({ accessToken: null, storeId: null, tableId: null, role: null });
  },

  isAuthenticated: () => !!get().accessToken,
}));
