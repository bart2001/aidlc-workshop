import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { useOrderStore } from '../../stores/useOrderStore';
import { getOrders } from '../../api/order';
import Layout from '../../components/common/Layout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import OrderCard from '../../components/customer/OrderCard';

/** 주문 내역 페이지 - SSE 실시간 상태 업데이트 (US-C05) */
export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const { storeId, tableId, isAuthenticated } = useAuthStore();
  const { orders, setOrders, connectSSE, disconnectSSE } = useOrderStore();

  // 인증 확인
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // 주문 목록 초기 로드
  useEffect(() => {
    if (storeId) {
      getOrders(storeId).then((res) => {
        if (res.data.success && res.data.data) {
          setOrders(res.data.data);
        }
      });
    }
  }, [storeId, setOrders]);

  // SSE 연결 (테이블용 주문 상태 스트림)
  useEffect(() => {
    if (storeId && tableId) {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      connectSSE(`${baseUrl}/api/stores/${storeId}/tables/${tableId}/orders/stream`);
    }
    return () => disconnectSSE();
  }, [storeId, tableId, connectSSE, disconnectSSE]);

  const loading = !storeId;

  return (
    <Layout>
      <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>주문 내역</h2>

      {loading && <LoadingSpinner message="주문 내역을 불러오는 중..." />}

      {!loading && orders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          <p style={{ fontSize: '48px', marginBottom: '12px' }}>📋</p>
          <p>주문 내역이 없습니다.</p>
          <button
            onClick={() => navigate('/menu')}
            style={{
              marginTop: '16px',
              padding: '12px 24px',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              minHeight: '44px',
            }}
            aria-label="메뉴 보러가기"
          >
            메뉴 보러가기
          </button>
        </div>
      )}

      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </Layout>
  );
}
