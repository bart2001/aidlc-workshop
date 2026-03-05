import { create } from 'zustand';
import type { Category, MenuItem } from '../types';
import { getCategories, getMenuItems } from '../api/menu';

interface MenuState {
  categories: Category[];
  menuItems: MenuItem[];
  selectedCategoryId: number | null;
  loading: boolean;
  error: string | null;
  fetchCategories: (storeId: number) => Promise<void>;
  fetchMenuItems: (storeId: number, categoryId?: number) => Promise<void>;
  selectCategory: (categoryId: number | null) => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  categories: [],
  menuItems: [],
  selectedCategoryId: null,
  loading: false,
  error: null,

  fetchCategories: async (storeId) => {
    try {
      set({ loading: true, error: null });
      const res = await getCategories(storeId);
      set({ categories: res.data.data ?? [] });
    } catch {
      set({ error: '카테고리를 불러올 수 없습니다.' });
    } finally {
      set({ loading: false });
    }
  },

  fetchMenuItems: async (storeId, categoryId) => {
    try {
      set({ loading: true, error: null });
      const res = await getMenuItems(storeId, categoryId);
      set({ menuItems: res.data.data ?? [] });
    } catch {
      set({ error: '메뉴를 불러올 수 없습니다.' });
    } finally {
      set({ loading: false });
    }
  },

  selectCategory: (categoryId) => set({ selectedCategoryId: categoryId }),
}));
