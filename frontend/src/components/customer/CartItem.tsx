import type { CartItem as CartItemType } from '../../types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (menuItemId: number, quantity: number) => void;
  onRemove: (menuItemId: number) => void;
}

/** 장바구니 항목 - 메뉴명, 수량 +/- 버튼, 소계, 삭제 */
export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const subtotal = item.unitPrice * item.quantity;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0',
        borderBottom: '1px solid #f3f4f6',
      }}
    >
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontWeight: 600 }}>{item.menuName}</p>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>
          {item.unitPrice.toLocaleString()}원
        </p>
      </div>

      {/* 수량 조절 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => onUpdateQuantity(item.menuItemId, item.quantity - 1)}
          style={qtyBtnStyle}
          aria-label={`${item.menuName} 수량 감소`}
        >
          −
        </button>
        <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.menuItemId, item.quantity + 1)}
          style={qtyBtnStyle}
          aria-label={`${item.menuName} 수량 증가`}
        >
          +
        </button>
      </div>

      {/* 소계 + 삭제 */}
      <div style={{ textAlign: 'right', marginLeft: '16px' }}>
        <p style={{ margin: 0, fontWeight: 700 }}>{subtotal.toLocaleString()}원</p>
        <button
          onClick={() => onRemove(item.menuItemId)}
          style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '12px', padding: '4px' }}
          aria-label={`${item.menuName} 삭제`}
        >
          삭제
        </button>
      </div>
    </div>
  );
}

const qtyBtnStyle: React.CSSProperties = {
  width: '44px',
  height: '44px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  backgroundColor: '#fff',
  cursor: 'pointer',
  fontSize: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
