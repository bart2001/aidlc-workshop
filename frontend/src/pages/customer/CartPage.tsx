import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../stores/useCartStore';
import Layout from '../../components/common/Layout';
import CartItemComponent from '../../components/customer/CartItem';
import CartSummary from '../../components/customer/CartSummary';

/** 장바구니 페이지 (US-C03) */
export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, getTotalAmount, getTotalCount } = useCartStore();

  if (items.length === 0) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '60px 16px' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</p>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>장바구니가 비어있습니다.</p>
          <button
            onClick={() => navigate('/menu')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              minHeight: '44px',
            }}
            aria-label="메뉴 보러가기"
          >
            메뉴 보러가기
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ paddingBottom: '120px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>장바구니</h2>
          <button
            onClick={clearCart}
            style={{
              background: 'none',
              border: 'none',
              color: '#dc2626',
              cursor: 'pointer',
              fontSize: '14px',
              minWidth: '44px',
              minHeight: '44px',
            }}
            aria-label="장바구니 비우기"
          >
            전체 삭제
          </button>
        </div>

        {items.map((item) => (
          <CartItemComponent
            key={item.menuItemId}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        ))}
      </div>

      <CartSummary
        totalAmount={getTotalAmount()}
        totalCount={getTotalCount()}
        onOrder={() => navigate('/order/confirm')}
      />
    </Layout>
  );
}
