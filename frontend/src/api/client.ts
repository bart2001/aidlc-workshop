import axios from 'axios';
import { findMockHandler } from '../mocks/handlers';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

// JWT 토큰 자동 첨부
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock API 인터셉터 (VITE_USE_MOCK=true 시 활성화)
if (USE_MOCK) {
  apiClient.interceptors.request.use(async (config) => {
    const method = config.method?.toUpperCase() || 'GET';
    const url = `${config.baseURL || ''}${config.url || ''}`;
    const handler = findMockHandler(method, url);
    if (handler) {
      const result = await handler(url, { data: config.data ? JSON.parse(config.data as string) : undefined });
      // axios adapter를 우회하여 Mock 응답 반환
      return Promise.reject({ __MOCK__: true, response: result });
    }
    return config;
  });

  apiClient.interceptors.response.use(undefined, (error) => {
    if (error?.__MOCK__) {
      return Promise.resolve(error.response);
    }
    return Promise.reject(error);
  });
}

// 401 응답 시 로그인 페이지로 리다이렉트
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      const isAdmin = window.location.pathname.startsWith('/admin');
      window.location.href = isAdmin ? '/admin/login' : '/login';
    }
    return Promise.reject(error);
  },
);

export default apiClient;
