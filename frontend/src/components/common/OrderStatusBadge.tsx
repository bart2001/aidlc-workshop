import React from 'react';
import type { OrderStatus } from '../../types';

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: '대기중',
  PREPARING: '준비중',
  COMPLETED: '완료',
};

const STATUS_CLASSES: Record<OrderStatus, string> = {
  PENDING: 'badge-pending',
  PREPARING: 'badge-preparing',
  COMPLETED: 'badge-completed',
};

const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => (
  <span className={`order-status-badge ${STATUS_CLASSES[status]}`}>
    {STATUS_LABELS[status]}
  </span>
);

export default OrderStatusBadge;
