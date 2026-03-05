import { create } from 'zustand';
import type { Category, MenuItem } from '../types';

interface MenuState {
  categories: Category[];
  menuItems: MenuItem[];
  setCategories: (categories: Category[]) => void;
  setMenuItems: (menuItems: MenuItem[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  removeCategory: (categoryId: number) => void;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (item: MenuItem) => void;
  removeMenuItem: (menuId: number) => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  categories: [],
  menuItems: [],
  setCategories: (categories) => set({ categories }),
  setMenuItems: (menuItems) => set({ menuItems }),
  addCategory: (category) => set((s) => ({ categories: [...s.categories, category] })),
  updateCategory: (category) =>
    set((s) => ({ categories: s.categories.map((c) => (c.id === category.id ? category : c)) })),
  removeCategory: (categoryId) =>
    set((s) => ({ categories: s.categories.filter((c) => c.id !== categoryId) })),
  addMenuItem: (item) => set((s) => ({ menuItems: [...s.menuItems, item] })),
  updateMenuItem: (item) =>
    set((s) => ({ menuItems: s.menuItems.map((m) => (m.id === item.id ? item : m)) })),
  removeMenuItem: (menuId) =>
    set((s) => ({ menuItems: s.menuItems.filter((m) => m.id !== menuId) })),
}));
