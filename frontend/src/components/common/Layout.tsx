import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { useCartStore } from '../../stores/useCartStore';

interface LayoutProps {
  children: React.ReactNode;
}

/** 공통 레이아웃 - 고객용/관리자용 자동 분리 */
export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, logout } = useAuthStore();
  const getTotalCount = useCartStore((s) => s.getTotalCount);
  const isAdmin = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    logout();
    navigate(isAdmin ? '/admin/login' : '/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 헤더 */}
      <header
        style={{
          padding: '12px 16px',
          backgroundColor: isAdmin ? '#1e293b' : '#2563eb',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1
          style={{ margin: 0, fontSize: '18px', cursor: 'pointer' }}
          onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/menu')}
        >
          {isAdmin ? '🔧 관리자' : '🍽️ 테이블오더'}
        </h1>
        <nav style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {!isAdmin && role === 'TABLE' && (
            <>
              <button
                onClick={() => navigate('/menu')}
                style={navBtnStyle(location.pathname === '/menu')}
                aria-label="메뉴 보기"
              >
                메뉴
              </button>
              <button
                onClick={() => navigate('/cart')}
                style={navBtnStyle(location.pathname === '/cart')}
                aria-label="장바구니 보기"
              >
                🛒 {getTotalCount() > 0 && <span>({getTotalCount()})</span>}
              </button>
              <button
                onClick={() => navigate('/orders')}
                style={navBtnStyle(location.pathname === '/orders')}
                aria-label="주문내역 보기"
              >
                주문내역
              </button>
            </>
          )}
          {role && (
            <button onClick={handleLogout} style={navBtnStyle(false)} aria-label="로그아웃">
              로그아웃
            </button>
          )}
        </nav>
      </header>

      {/* 본문 */}
      <main style={{ flex: 1, padding: '16px' }}>{children}</main>
    </div>
  );
}

function navBtnStyle(active: boolean): React.CSSProperties {
  return {
    background: active ? 'rgba(255,255,255,0.2)' : 'transparent',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    minWidth: '44px',
    minHeight: '44px',
  };
}
