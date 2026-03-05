import { create } from 'zustand';
import type { UserRole } from '../types';

interface AuthState {
  token: string | null;
  storeId: number | null;
  username: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (token: string, storeId: number, username: string, role: UserRole) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  storeId: null,
  username: null,
  role: null,
  isAuthenticated: false,

  login: (token, storeId, username, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('storeId', String(storeId));
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
    set({ token, storeId, username, role, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('storeId');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    set({ token: null, storeId: null, username: null, role: null, isAuthenticated: false });
  },

  initialize: () => {
    const token = localStorage.getItem('token');
    const storeId = localStorage.getItem('storeId');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role') as UserRole | null;
    if (token && storeId && role) {
      set({ token, storeId: Number(storeId), username, role, isAuthenticated: true });
    }
  },
}));
