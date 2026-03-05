import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../stores/useCartStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { createOrder } from '../../api/order';
import Layout from '../../components/common/Layout';
import ErrorMessage from '../../components/common/ErrorMessage';

/** 주문 최종 확인 페이지 (US-C04) */
export default function OrderConfirmPage() {
  const navigate = useNavigate();
  const { items, getTotalAmount, clearCart } = useCartStore();
  const { storeId, tableId } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 장바구니가 비어있으면 메뉴로 이동
  if (items.length === 0) {
    navigate('/menu', { replace: true });
    return null;
  }

  const totalAmount = getTotalAmount();

  const handleConfirm = async () => {
    if (!storeId || !tableId) {
      setError('로그인 정보가 없습니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await createOrder(storeId, {
        tableId,
        sessionId: 1, // 세션 ID는 서버에서 관리
        items: items.map((i) => ({
          menuItemId: i.menuItemId,
          menuName: i.menuName,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
        totalAmount,
      });

      if (res.data.success && res.data.data) {
        clearCart();
        navigate(`/order/result/${res.data.data.id}`, { state: { success: true, order: res.data.data } });
      } else {
        setError(res.data.error || '주문에 실패했습니다.');
      }
    } catch {
      setError('서버에 연결할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>주문 확인</h2>

      {/* 주문 내역 */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
        {items.map((item) => (
          <div
            key={item.menuItemId}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid #f3f4f6',
            }}
          >
            <span>
              {item.menuName} × {item.quantity}
            </span>
            <span style={{ fontWeight: 600 }}>{(item.unitPrice * item.quantity).toLocaleString()}원</span>
          </div>
        ))}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: '12px',
            fontWeight: 700,
            fontSize: '18px',
          }}
        >
          <span>총 금액</span>
          <span style={{ color: '#2563eb' }}>{totalAmount.toLocaleString()}원</span>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        <button
          onClick={() => navigate('/cart')}
          style={{
            flex: 1,
            padding: '14px',
            border: '1px solid #d1d5db',
            borderRadius: '10px',
            backgroundColor: '#fff',
            cursor: 'pointer',
            fontSize: '16px',
            minHeight: '44px',
          }}
          aria-label="장바구니로 돌아가기"
        >
          뒤로
        </button>
        <button
          onClick={handleConfirm}
          disabled={loading}
          style={{
            flex: 2,
            padding: '14px',
            border: 'none',
            borderRadius: '10px',
            backgroundColor: '#2563eb',
            color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 700,
            minHeight: '44px',
          }}
          aria-label="주문 확정"
        >
          {loading ? '주문 중...' : '주문 확정'}
        </button>
      </div>
    </Layout>
  );
}
