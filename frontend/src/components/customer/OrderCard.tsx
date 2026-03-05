import type { Order } from '../../types';
import OrderStatusBadge from '../common/OrderStatusBadge';

interface OrderCardProps {
  order: Order;
}

/** 주문 카드 - 주문번호, 시각, 상태 뱃지, 메뉴 목록 */
export default function OrderCard({ order }: OrderCardProps) {
  const time = new Date(order.createdAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '16px',
        backgroundColor: '#fff',
        marginBottom: '12px',
      }}
    >
      {/* 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: '16px' }}>주문 #{order.orderNumber}</span>
          <span style={{ marginLeft: '8px', fontSize: '13px', color: '#6b7280' }}>{time}</span>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* 메뉴 목록 */}
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {order.items.map((item) => (
          <li
            key={item.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '4px 0',
              fontSize: '14px',
              color: '#374151',
            }}
          >
            <span>
              {item.menuName} × {item.quantity}
            </span>
            <span>{(item.unitPrice * item.quantity).toLocaleString()}원</span>
          </li>
        ))}
      </ul>

      {/* 합계 */}
      <div
        style={{
          marginTop: '8px',
          paddingTop: '8px',
          borderTop: '1px solid #f3f4f6',
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: 700,
        }}
      >
        <span>합계</span>
        <span>{order.totalAmount.toLocaleString()}원</span>
      </div>
    </div>
  );
}
