import React, { useState } from 'react';
import type { Order, OrderStatus } from '../../types';
import OrderStatusBadge from '../common/OrderStatusBadge';
import ConfirmDialog from '../common/ConfirmDialog';

interface OrderDetailModalProps {
  open: boolean;
  tableNumber: number;
  orders: Order[];
  onClose: () => void;
  onStatusChange: (orderId: number, newStatus: OrderStatus) => void;
  onDelete: (orderId: number) => void;
  onCompleteSession: () => void;
}

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: 'PREPARING',
  PREPARING: 'COMPLETED',
};

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  open, tableNumber, orders, onClose, onStatusChange, onDelete, onCompleteSession,
}) => {
  const [confirmAction, setConfirmAction] = useState<{ type: 'delete' | 'complete'; orderId?: number } | null>(null);

  if (!open) return null;

  const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'delete' && confirmAction.orderId) {
      onDelete(confirmAction.orderId);
    } else if (confirmAction.type === 'complete') {
      onCompleteSession();
    }
    setConfirmAction(null);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={`테이블 ${tableNumber} 주문 상세`}>
      <div className="modal-content modal-content--large">
        <div className="modal-header">
          <h2>테이블 {tableNumber} 주문 상세</h2>
          <span className="modal-header__total">총 {totalAmount.toLocaleString()}원</span>
          <button type="button" className="btn-close" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        <div className="modal-body">
          {orders.length === 0 && <p>주문이 없습니다.</p>}
          {orders.map((order) => (
            <div key={order.id} className="order-detail-card">
              <div className="order-detail-card__header">
                <span>주문 #{order.orderNumber}</span>
                <span>{new Date(order.createdAt).toLocaleTimeString('ko-KR')}</span>
                <OrderStatusBadge status={order.status} />
              </div>
              <ul className="order-detail-card__items">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.menuName} × {item.quantity} = {(item.unitPrice * item.quantity).toLocaleString()}원
                  </li>
                ))}
              </ul>
              <div className="order-detail-card__footer">
                <span>{order.totalAmount.toLocaleString()}원</span>
                <div className="order-detail-card__actions">
                  {NEXT_STATUS[order.status] && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => onStatusChange(order.id, NEXT_STATUS[order.status]!)}
                    >
                      {NEXT_STATUS[order.status] === 'PREPARING' ? '준비 시작' : '완료 처리'}
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => setConfirmAction({ type: 'delete', orderId: order.id })}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-warning"
            onClick={() => setConfirmAction({ type: 'complete' })}
            disabled={orders.length === 0}
          >
            이용 완료
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>닫기</button>
        </div>

        <ConfirmDialog
          open={confirmAction !== null}
          title={confirmAction?.type === 'delete' ? '주문 삭제' : '이용 완료'}
          message={
            confirmAction?.type === 'delete'
              ? '이 주문을 삭제하시겠습니까? 삭제 후 복구할 수 없습니다.'
              : '이용 완료 처리하시겠습니까? 현재 주문 내역이 과거 이력으로 이동됩니다.'
          }
          confirmLabel={confirmAction?.type === 'delete' ? '삭제' : '이용 완료'}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      </div>
    </div>
  );
};

export default OrderDetailModal;
