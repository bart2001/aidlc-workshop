import type { OrderStatus } from '../../types';

const statusConfig: Record<OrderStatus, { label: string; bg: string; color: string }> = {
  PENDING: { label: '대기중', bg: '#fef3c7', color: '#92400e' },
  PREPARING: { label: '준비중', bg: '#dbeafe', color: '#1e40af' },
  COMPLETED: { label: '완료', bg: '#d1fae5', color: '#065f46' },
};

/** 주문 상태 뱃지 (대기중/준비중/완료) */
export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: config.bg,
        color: config.color,
      }}
      aria-label={`주문 상태: ${config.label}`}
    >
      {config.label}
    </span>
  );
}
