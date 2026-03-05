import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { loginTable } from '../../api/auth';
import ErrorMessage from '../../components/common/ErrorMessage';

/** 테이블 태블릿 로그인 페이지 (US-C01) */
export default function TableLoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();
  const [storeId, setStoreId] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 이미 로그인된 경우 메뉴로 이동
  if (isAuthenticated()) {
    navigate('/menu', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await loginTable({
        storeId: Number(storeId),
        tableNumber: Number(tableNumber),
        password,
      });
      const data = res.data;
      if (data.success && data.data) {
        login(data.data.accessToken, data.data.storeId, 'TABLE', data.data.tableId);
        navigate('/menu', { replace: true });
      } else {
        setError(data.error || '로그인에 실패했습니다.');
      }
    } catch {
      setError('서버에 연결할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '0 16px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>🍽️ 테이블오더</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="storeId" style={labelStyle}>매장 ID</label>
          <input
            id="storeId"
            type="number"
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            required
            style={inputStyle}
            placeholder="매장 식별자 입력"
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="tableNumber" style={labelStyle}>테이블 번호</label>
          <input
            id="tableNumber"
            type="number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            required
            style={inputStyle}
            placeholder="테이블 번호 입력"
          />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label htmlFor="password" style={labelStyle}>비밀번호</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
            placeholder="비밀번호 입력"
          />
        </div>
        {error && <ErrorMessage message={error} />}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '16px',
            minHeight: '44px',
          }}
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '14px',
  fontWeight: 600,
  color: '#374151',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  fontSize: '16px',
  boxSizing: 'border-box',
  minHeight: '44px',
};
