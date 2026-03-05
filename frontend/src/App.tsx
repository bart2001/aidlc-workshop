import { Routes, Route, Navigate } from 'react-router-dom';
import TableLoginPage from './pages/customer/TableLoginPage';
import MenuPage from './pages/customer/MenuPage';
import CartPage from './pages/customer/CartPage';
import OrderConfirmPage from './pages/customer/OrderConfirmPage';
import OrderResultPage from './pages/customer/OrderResultPage';
import OrderHistoryPage from './pages/customer/OrderHistoryPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import MenuManagementPage from './pages/admin/MenuManagementPage';
import TableManagementPage from './pages/admin/TableManagementPage';

function App() {
  return (
    <Routes>
      {/* 고객용 */}
      <Route path="/login" element={<TableLoginPage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/order/confirm" element={<OrderConfirmPage />} />
      <Route path="/order/result/:orderId" element={<OrderResultPage />} />
      <Route path="/orders" element={<OrderHistoryPage />} />

      {/* 관리자용 */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<DashboardPage />} />
      <Route path="/admin/menus" element={<MenuManagementPage />} />
      <Route path="/admin/tables" element={<TableManagementPage />} />

      {/* 기본 리다이렉트 */}
      <Route path="/" element={<Navigate to="/menu" replace />} />
    </Routes>
  );
}

export default App;
