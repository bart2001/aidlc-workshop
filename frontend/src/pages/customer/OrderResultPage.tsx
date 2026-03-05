import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import type { Order } from '../../types';

/** 주문 결과 페이지 - 성공/실패 (US-C04) */
export default function OrderResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { success?: boolean; order?: Order } | null;

  // 5초 후 메뉴 화면으로 자동 리다이렉트 (성공 시)
  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => navigate('/menu', { replace: true }), 5000);
      return () => clearTimeout(timer);
    }
  }, [state, navigate]);

  if (!state) {
    navigate('/menu', { replace: true });
    return null;
  }

  if (state.success && state.order) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '60px 16px' }}>
          <p style={{ fontSize: '64px', marginBottom: '16px' }}>✅</p>
          <h2 style={{ marginBottom: '8px' }}>주문이 완료되었습니다</h2>
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#2563eb', marginBottom: '8px' }}>
            주문번호 #{state.order.orderNumber}
          </p>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            {state.order.totalAmount.toLocaleString()}원
          </p>
          <p style={{ fontSize: '13px', color: '#9ca3af' }}>5초 후 메뉴 화면으로 이동합니다...</p>
          <button
            onClick={() => navigate('/orders')}
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
            aria-label="주문 내역 보기"
          >
            주문 내역 보기
          </button>
        </div>
      </Layout>
    );
  }

  // 실패
  return (
    <Layout>
      <div style={{ textAlign: 'center', padding: '60px 16px' }}>
        <p style={{ fontSize: '64px', marginBottom: '16px' }}>❌</p>
        <h2 style={{ marginBottom: '8px', color: '#dc2626' }}>주문에 실패했습니다</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>잠시 후 다시 시도해주세요.</p>
        <button
          onClick={() => navigate('/cart')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            minHeight: '44px',
          }}
          aria-label="장바구니로 돌아가기"
        >
          장바구니로 돌아가기
        </button>
      </div>
    </Layout>
  );
}
