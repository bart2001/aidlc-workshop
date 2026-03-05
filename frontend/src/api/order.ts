import apiClient from './client';
import type { ApiResponse, Order, OrderHistory, OrderStatus } from '../types';

export const getOrders = (storeId: number, params?: { tableId?: number; sessionId?: number }) =>
  apiClient.get<ApiResponse<Order[]>>(`/api/stores/${storeId}/orders`, { params });

export const getOrder = (storeId: number, orderId: number) =>
  apiClient.get<ApiResponse<Order>>(`/api/stores/${storeId}/orders/${orderId}`);

export const updateOrderStatus = (storeId: number, orderId: number, status: OrderStatus) =>
  apiClient.patch<ApiResponse<Order>>(`/api/stores/${storeId}/orders/${orderId}`, { status });

export const deleteOrder = (storeId: number, orderId: number) =>
  apiClient.delete(`/api/stores/${storeId}/orders/${orderId}`);

export const getOrderHistory = (storeId: number, tableId: number, params?: { from?: string; to?: string }) =>
  apiClient.get<ApiResponse<OrderHistory[]>>(
    `/api/stores/${storeId}/tables/${tableId}/order-history`,
    { params }
  );
