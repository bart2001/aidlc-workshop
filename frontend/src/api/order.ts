import apiClient from './client';
import type { ApiResponse, Order, OrderCreateRequest, OrderHistory } from '../types';

export const createOrder = (storeId: number, data: OrderCreateRequest) =>
  apiClient.post<ApiResponse<Order>>(`/api/stores/${storeId}/orders`, data);

export const getOrders = (storeId: number, sessionId?: number) => {
  const params = sessionId ? { sessionId } : {};
  return apiClient.get<ApiResponse<Order[]>>(`/api/stores/${storeId}/orders`, { params });
};

export const getOrder = (storeId: number, orderId: number) =>
  apiClient.get<ApiResponse<Order>>(`/api/stores/${storeId}/orders/${orderId}`);

export const updateOrderStatus = (storeId: number, orderId: number, status: string) =>
  apiClient.patch<ApiResponse<Order>>(`/api/stores/${storeId}/orders/${orderId}`, { status });

export const deleteOrder = (storeId: number, orderId: number) =>
  apiClient.delete<ApiResponse<null>>(`/api/stores/${storeId}/orders/${orderId}`);

export const getOrderHistory = (storeId: number, tableId: number, from?: string, to?: string) => {
  const params: Record<string, string> = {};
  if (from) params.from = from;
  if (to) params.to = to;
  return apiClient.get<ApiResponse<OrderHistory[]>>(`/api/stores/${storeId}/tables/${tableId}/order-history`, { params });
};
