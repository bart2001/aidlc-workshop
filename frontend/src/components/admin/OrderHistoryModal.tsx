import React, { useState, useEffect, useCallback } from 'react';
import type { OrderHistory } from '../../types';
import { getOrderHistory } from '../../api/order';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

interface OrderHistoryModalProps {
  open: boolean;
  storeId: number;
  tableId: number;
  tableNumber: number;
  onClose: () => void;
}

const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  open, storeId, tableId, tableNumber, onClose,
}) => {
  const [history, setHistory] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: { from?: string; to?: string } = {};
      if (dateFrom) params.from = dateFrom;
      if (dateTo) params.to = dateTo;
      const res = await getOrderHistory(storeId, tableId, params);
      setHistory(res.data.data);
    } catch {
      setError('과거 주문 내역을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [storeId, tableId, dateFrom, dateTo]);

  useEffect(() => {
    if (open) fetchHistory();
  }, [open, fetchHistory]);

  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={`테이블 ${tableNumber} 과거 주문 내역`}>
      <div className="modal-content modal-content--large">
        <div className="modal-header">
          <h2>테이블 {tableNumber} - 과거 주문 내역</h2>
          <button type="button" className="btn-close" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        <div className="modal-filter">
          <div className="form-group form-group--inline">
            <label htmlFor="history-from">시작일</label>
            <input id="history-from" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          <div className="form-group form-group--inline">
            <label htmlFor="history-to">종료일</label>
            <input id="history-to" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
          <button type="button" className="btn btn-primary" onClick={fetchHistory}>조회</button>
        </div>

        <div className="modal-body">
          {loading && <LoadingSpinner message="내역 조회 중..." />}
          {error && <ErrorMessage message={error} onRetry={fetchHistory} />}
          {!loading && !error && history.length === 0 && <p>과거 주문 내역이 없습니다.</p>}
          {!loading && history.map((h) => (
            <div key={h.id} className="history-card">
              <div className="history-card__header">
                <span>이용 완료: {new Date(h.completedAt).toLocaleString('ko-KR')}</span>
                <span>총 {h.totalAmount.toLocaleString()}원</span>
              </div>
              <ul className="history-card__orders">
                {h.orderDataJson.orders.map((order, idx) => (
                  <li key={idx}>
                    <span>#{order.orderNumber}</span>
                    <span>{order.totalAmount.toLocaleString()}원</span>
                    <ul>
                      {order.items.map((item, iIdx) => (
                        <li key={iIdx}>{item.menuName} × {item.quantity}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryModal;
