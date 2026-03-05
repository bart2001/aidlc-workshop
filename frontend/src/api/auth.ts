import apiClient from './client';
import type { ApiResponse, LoginResponse, TableLoginRequest, AdminLoginRequest } from '../types';

export const loginTable = (data: TableLoginRequest) =>
  apiClient.post<ApiResponse<LoginResponse>>('/api/auth/table/login', data);

export const loginAdmin = (data: AdminLoginRequest) =>
  apiClient.post<ApiResponse<LoginResponse>>('/api/auth/admin/login', data);

export const refreshToken = (token: string) =>
  apiClient.post<ApiResponse<LoginResponse>>('/api/auth/token/refresh', { refreshToken: token });
