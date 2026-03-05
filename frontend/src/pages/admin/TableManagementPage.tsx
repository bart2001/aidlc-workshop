import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { getTables, createTable, updateTable } from '../../api/table';
import type { StoreTable } from '../../types';
import TableForm from '../../components/admin/TableForm';
import OrderHistoryModal from '../../components/admin/OrderHistoryModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const TableManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { storeId, isAuthenticated } = useAuthStore();

  const [tables, setTables] = useState<StoreTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTable, setEditTable] = useState<StoreTable | null>(null);
  const [historyTable, setHistoryTable] = useState<StoreTable | null>(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin/login');
  }, [isAuthenticated, navigate]);

  const fetchTables = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const res = await getTables(storeId);
      setTables(res.data.data);
    } catch {
      setError('테이블 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => { fetchTables(); }, [fetchTables]);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleSubmit = async (data: { tableNumber: number; password?: string }) => {
    if (!storeId) return;
    try {
      if (editTable) {
        await updateTable(storeId, editTable.id, data);
        showFeedback('테이블이 수정되었습니다.');
      } else {
        await createTable(storeId, { tableNumber: data.tableNumber, password: data.password! });
        showFeedback('테이블이 등록되었습니다.');
      }
      setShowForm(false);
      setEditTable(null);
      fetchTables();
    } catch {
      showFeedback('테이블 저장에 실패했습니다.');
    }
  };

  if (loading) return <LoadingSpinner message="테이블 목록 로딩 중..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchTables} />;

  return (
    <div className="table-management-page">
      <header className="page-header">
        <h1>테이블 관리</h1>
        {feedback && <div className="feedback-toast" role="status">{feedback}</div>}
      </header>

      <div className="section-header">
        <h2>테이블 목록</h2>
        <button type="button" className="btn btn-primary" onClick={() => { setEditTable(null); setShowForm(true); }}>
          테이블 추가
        </button>
      </div>

      {showForm && (
        <TableForm
          editItem={editTable}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditTable(null); }}
        />
      )}

      <div className="table-list">
        {tables.length === 0 && <p>등록된 테이블이 없습니다.</p>}
        {tables
          .sort((a, b) => a.tableNumber - b.tableNumber)
          .map((table) => (
            <div key={table.id} className="table-list-item">
              <div className="table-list-item__info">
                <strong>테이블 {table.tableNumber}</strong>
                <span className="text-muted">등록일: {new Date(table.createdAt).toLocaleDateString('ko-KR')}</span>
              </div>
              <div className="table-list-item__actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => { setEditTable(table); setShowForm(true); }}
                >
                  수정
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setHistoryTable(table)}
                >
                  과거 내역
                </button>
              </div>
            </div>
          ))}
      </div>

      {historyTable && storeId && (
        <OrderHistoryModal
          open={historyTable !== null}
          storeId={storeId}
          tableId={historyTable.id}
          tableNumber={historyTable.tableNumber}
          onClose={() => setHistoryTable(null)}
        />
      )}
    </div>
  );
};

export default TableManagementPage;
