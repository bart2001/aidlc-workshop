import React from 'react';
import type { Order } from '../../types';
import OrderStatusBadge from '../common/OrderStatusBadge';

interface TableCardProps {
  tableNumber: number;
  tableId: number;
  orders: Order[];
  isNewOrder?: boolean;
  onClick: () => void;
}

const TableCard: React.FC<TableCardProps> = ({ tableNumber, tableId, orders, isNewOrder, onClick }) => {
  const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const latestOrders = orders.slice(-3);

  return (
    <button
      type="button"
      className={`table-card ${isNewOrder ? 'table-card--highlight' : ''}`}
      onClick={onClick}
      aria-label={`테이블 ${tableNumber} - 총 ${totalAmount.toLocaleString()}원`}
    >
      <div className="table-card__header">
        <span className="table-card__number">테이블 {tableNumber}</span>
        {orders.length > 0 && (
          <span className="table-card__count">{orders.length}건</span>
        )}
      </div>
      <div className="table-card__amount">
        {totalAmount.toLocaleString()}원
      </div>
      <div className="table-card__orders">
        {latestOrders.length === 0 && <p className="table-card__empty">주문 없음</p>}
        {latestOrders.map((order) => (
          <div key={order.id} className="table-card__order-preview">
            <span>#{order.orderNumber}</span>
            <OrderStatusBadge status={order.status} />
            <span>{order.totalAmount.toLocaleString()}원</span>
          </div>
        ))}
      </div>
    </button>
  );
};

export default TableCard;
