import apiClient from './client';
import type {
  ApiResponse, Category, MenuItem,
  CategoryCreateRequest, CategoryUpdateRequest,
  MenuItemCreateRequest, MenuItemUpdateRequest,
} from '../types';

export const getCategories = (storeId: number) =>
  apiClient.get<ApiResponse<Category[]>>(`/api/stores/${storeId}/categories`);

export const createCategory = (storeId: number, data: CategoryCreateRequest) =>
  apiClient.post<ApiResponse<Category>>(`/api/stores/${storeId}/categories`, data);

export const updateCategory = (storeId: number, categoryId: number, data: CategoryUpdateRequest) =>
  apiClient.put<ApiResponse<Category>>(`/api/stores/${storeId}/categories/${categoryId}`, data);

export const deleteCategory = (storeId: number, categoryId: number) =>
  apiClient.delete(`/api/stores/${storeId}/categories/${categoryId}`);

export const getMenuItems = (storeId: number, categoryId?: number) =>
  apiClient.get<ApiResponse<MenuItem[]>>(`/api/stores/${storeId}/menus`, {
    params: categoryId ? { categoryId } : undefined,
  });

export const createMenuItem = (storeId: number, data: MenuItemCreateRequest) =>
  apiClient.post<ApiResponse<MenuItem>>(`/api/stores/${storeId}/menus`, data);

export const updateMenuItem = (storeId: number, menuId: number, data: MenuItemUpdateRequest) =>
  apiClient.put<ApiResponse<MenuItem>>(`/api/stores/${storeId}/menus/${menuId}`, data);

export const deleteMenuItem = (storeId: number, menuId: number) =>
  apiClient.delete(`/api/stores/${storeId}/menus/${menuId}`);

export const updateMenuItemOrder = (storeId: number, menuId: number, displayOrder: number) =>
  apiClient.patch<ApiResponse<MenuItem>>(`/api/stores/${storeId}/menus/${menuId}`, { displayOrder });
