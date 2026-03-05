import apiClient from './client';
import type { ApiResponse, Category, MenuItem } from '../types';

export const getCategories = (storeId: number) =>
  apiClient.get<ApiResponse<Category[]>>(`/api/stores/${storeId}/categories`);

export const getMenuItems = (storeId: number, categoryId?: number) => {
  const params = categoryId ? { categoryId } : {};
  return apiClient.get<ApiResponse<MenuItem[]>>(`/api/stores/${storeId}/menus`, { params });
};

export const getMenuItem = (storeId: number, menuId: number) =>
  apiClient.get<ApiResponse<MenuItem>>(`/api/stores/${storeId}/menus/${menuId}`);

export const createCategory = (storeId: number, data: { name: string; displayOrder: number }) =>
  apiClient.post<ApiResponse<Category>>(`/api/stores/${storeId}/categories`, data);

export const updateCategory = (storeId: number, categoryId: number, data: { name: string; displayOrder: number }) =>
  apiClient.put<ApiResponse<Category>>(`/api/stores/${storeId}/categories/${categoryId}`, data);

export const deleteCategory = (storeId: number, categoryId: number) =>
  apiClient.delete<ApiResponse<null>>(`/api/stores/${storeId}/categories/${categoryId}`);

export const createMenuItem = (storeId: number, data: Partial<MenuItem>) =>
  apiClient.post<ApiResponse<MenuItem>>(`/api/stores/${storeId}/menus`, data);

export const updateMenuItem = (storeId: number, menuId: number, data: Partial<MenuItem>) =>
  apiClient.put<ApiResponse<MenuItem>>(`/api/stores/${storeId}/menus/${menuId}`, data);

export const deleteMenuItem = (storeId: number, menuId: number) =>
  apiClient.delete<ApiResponse<null>>(`/api/stores/${storeId}/menus/${menuId}`);

export const updateMenuItemOrder = (storeId: number, menuId: number, displayOrder: number) =>
  apiClient.patch<ApiResponse<MenuItem>>(`/api/stores/${storeId}/menus/${menuId}`, { displayOrder });
