import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { useOrderStore } from '../../stores/useOrderStore';
import { getOrders, updateOrderStatus, deleteOrder } from '../../api/order';
import { getTables, completeSession, getTableSessions } from '../../api/table';
import type { StoreTable, Order, OrderStatus } from '../../types';
import TableCard from '../../components/admin/TableCard';
import OrderDetailModal from '../../components/admin/OrderDetailModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { storeId, isAuthenticated } = useAuthStore();
  const { orders, setOrders, connectSSE, disconnectSSE } = useOrderStore();

  const [tables, setTables] = useState<StoreTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTable, setSelectedTable] = useState<StoreTable | null>(null);
  const [newOrderTableIds, setNewOrderTableIds] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!isAuthenticated) { navigate('/admin/login'); return; }
  }, [isAuthenticated, navigate]);

  const fetchData = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    setError('');
    try {
      const [tablesRes, ordersRes] = await Promise.all([
        getTables(storeId),
        getOrders(storeId),
      ]);
      setTables(tablesRes.data.data);
      setOrders(ordersRes.data.data);
    } catch {
      setError('데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [storeId, setOrders]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // SSE 연결
  useEffect(() => {
    if (storeId) connectSSE(storeId);
    return () => disconnectSSE();
  }, [storeId, connectSSE, disconnectSSE]);

  // 신규 주문 하이라이트
  useEffect(() => {
    const prevOrderIds = new Set(orders.map((o) => o.id));
    const unsubscribe = useOrderStore.subscribe((state) => {
      const newIds = state.orders
        .filter((o) => !prevOrderIds.has(o.id))
        .map((o) => o.tableId);
      if (newIds.length > 0) {
        setNewOrderTableIds((prev) => new Set([...prev, ...newIds]));
        setTimeout(() => {
          setNewOrderTableIds((prev) => {
            const next = new Set(prev);
            newIds.forEach((id) => next.delete(id));
            return next;
          });
        }, 5000);
      }
    });
    return unsubscribe;
  }, [orders]);

  const getOrdersForTable = (tableId: number): Order[] =>
    orders.filter((o) => o.tableId === tableId);

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    if (!storeId) return;
    try {
      const res = await updateOrderStatus(storeId, orderId, newStatus);
      useOrderStore.getState().updateOrder(res.data.data);
      setFeedback('주문 상태가 변경되었습니다.');
    } catch {
      setFeedback('상태 변경에 실패했습니다.');
    }
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleDelete = async (orderId: number) => {
    if (!storeId) return;
    try {
      await deleteOrder(storeId, orderId);
      useOrderStore.getState().removeOrder(orderId);
      setFeedback('주문이 삭제되었습니다.');
    } catch {
      setFeedback('주문 삭제에 실패했습니다.');
    }
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleCompleteSession = async () => {
    if (!storeId || !selectedTable) return;
    try {
      const sessionsRes = await getTableSessions(storeId, selectedTable.id);
      const activeSession = sessionsRes.data.data.find((s) => s.isActive);
      if (activeSession) {
        await completeSession(storeId, selectedTable.id, activeSession.id);
        useOrderStore.getState().clearOrdersByTable(selectedTable.id);
        setFeedback('이용 완료 처리되었습니다.');
        setSelectedTable(null);
      }
    } catch {
      setFeedback('이용 완료 처리에 실패했습니다.');
    }
    setTimeout(() => setFeedback(''), 3000);
  };

  if (loading) return <LoadingSpinner message="대시보드 로딩 중..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>주문 대시보드</h1>
        {feedback && <div className="feedback-toast" role="status">{feedback}</div>}
      </header>

      <div className="table-grid">
        {tables.map((table) => (
          <TableCard
            key={table.id}
            tableId={table.id}
            tableNumber={table.tableNumber}
            orders={getOrdersForTable(table.id)}
            isNewOrder={newOrderTableIds.has(table.id)}
            onClick={() => setSelectedTable(table)}
          />
        ))}
        {tables.length === 0 && <p>등록된 테이블이 없습니다.</p>}
      </div>

      <OrderDetailModal
        open={selectedTable !== null}
        tableNumber={selectedTable?.tableNumber ?? 0}
        orders={selectedTable ? getOrdersForTable(selectedTable.id) : []}
        onClose={() => setSelectedTable(null)}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        onCompleteSession={handleCompleteSession}
      />
    </div>
  );
};

export default DashboardPage;
