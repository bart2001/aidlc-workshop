import apiClient from './client';
import type { ApiResponse, StoreTable, TableSession } from '../types';

export const getTables = (storeId: number) =>
  apiClient.get<ApiResponse<StoreTable[]>>(`/api/stores/${storeId}/tables`);

export const createTable = (storeId: number, data: { tableNumber: number; password: string }) =>
  apiClient.post<ApiResponse<StoreTable>>(`/api/stores/${storeId}/tables`, data);

export const updateTable = (storeId: number, tableId: number, data: { tableNumber?: number; password?: string }) =>
  apiClient.put<ApiResponse<StoreTable>>(`/api/stores/${storeId}/tables/${tableId}`, data);

export const getTableSessions = (storeId: number, tableId: number) =>
  apiClient.get<ApiResponse<TableSession[]>>(`/api/stores/${storeId}/tables/${tableId}/sessions`);

export const completeSession = (storeId: number, tableId: number, sessionId: number) =>
  apiClient.patch<ApiResponse<null>>(`/api/stores/${storeId}/tables/${tableId}/sessions/${sessionId}`, { status: 'COMPLETED' });
