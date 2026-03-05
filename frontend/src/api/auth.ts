import apiClient from './client';
import type { AdminLoginRequest, AdminLoginResponse, ApiResponse } from '../types';

export const adminLogin = (data: AdminLoginRequest) =>
  apiClient.post<ApiResponse<AdminLoginResponse>>('/api/auth/admin/login', data);

export const refreshToken = () =>
  apiClient.post<ApiResponse<{ token: string }>>('/api/auth/token/refresh');
