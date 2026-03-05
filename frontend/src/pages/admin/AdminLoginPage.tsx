import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../api/auth';
import { useAuthStore } from '../../stores/useAuthStore';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MAX_LOGIN_ATTEMPTS = 5;

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [storeId, setStoreId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      setError('로그인 시도 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    if (!storeId || !username || !password) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await adminLogin({
        storeId: Number(storeId),
        username,
        password,
      });
      const { token, storeId: sid, username: uname, role } = res.data.data;
      login(token, sid, uname, role);
      navigate('/admin/dashboard');
    } catch (err: any) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        setError('로그인 시도 횟수를 초과했습니다. 계정이 일시적으로 잠겼습니다.');
      } else {
        setError(err.response?.data?.error || '로그인에 실패했습니다. 인증 정보를 확인해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h1>관리자 로그인</h1>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="store-id">매장 ID</label>
            <input
              id="store-id"
              type="number"
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              placeholder="매장 식별자"
              disabled={loading}
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">사용자명</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="사용자명"
              disabled={loading}
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
          {error && <ErrorMessage message={error} />}
          {loading ? (
            <LoadingSpinner message="로그인 중..." />
          ) : (
            <button type="submit" className="btn btn-primary btn-full" disabled={attempts >= MAX_LOGIN_ATTEMPTS}>
              로그인
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
