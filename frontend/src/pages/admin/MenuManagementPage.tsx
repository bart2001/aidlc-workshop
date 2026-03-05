import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { useMenuStore } from '../../stores/useMenuStore';
import {
  getCategories, createCategory, updateCategory, deleteCategory as deleteCategoryApi,
  getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem as deleteMenuItemApi,
  updateMenuItemOrder,
} from '../../api/menu';
import type { Category, MenuItem, CategoryCreateRequest, MenuItemCreateRequest, MenuItemUpdateRequest } from '../../types';
import CategoryForm from '../../components/admin/CategoryForm';
import MenuForm from '../../components/admin/MenuForm';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const MenuManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { storeId, isAuthenticated } = useAuthStore();
  const {
    categories, menuItems, setCategories, setMenuItems,
    addCategory, updateCategory: updateCatStore, removeCategory,
    addMenuItem: addMenuStore, updateMenuItem: updateMenuStore, removeMenuItem,
  } = useMenuStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editMenu, setEditMenu] = useState<MenuItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'category' | 'menu'; id: number } | null>(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin/login');
  }, [isAuthenticated, navigate]);

  const fetchData = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const [catRes, menuRes] = await Promise.all([
        getCategories(storeId),
        getMenuItems(storeId),
      ]);
      setCategories(catRes.data.data);
      setMenuItems(menuRes.data.data);
    } catch {
      setError('데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [storeId, setCategories, setMenuItems]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleCategorySubmit = async (data: CategoryCreateRequest) => {
    if (!storeId) return;
    try {
      if (editCategory) {
        const res = await updateCategory(storeId, editCategory.id, data);
        updateCatStore(res.data.data);
        showFeedback('카테고리가 수정되었습니다.');
      } else {
        const res = await createCategory(storeId, data);
        addCategory(res.data.data);
        showFeedback('카테고리가 등록되었습니다.');
      }
      setShowCategoryForm(false);
      setEditCategory(null);
    } catch {
      showFeedback('카테고리 저장에 실패했습니다.');
    }
  };

  const handleMenuSubmit = async (data: MenuItemCreateRequest | MenuItemUpdateRequest) => {
    if (!storeId) return;
    try {
      if (editMenu) {
        const res = await updateMenuItem(storeId, editMenu.id, data as MenuItemUpdateRequest);
        updateMenuStore(res.data.data);
        showFeedback('메뉴가 수정되었습니다.');
      } else {
        const res = await createMenuItem(storeId, data as MenuItemCreateRequest);
        addMenuStore(res.data.data);
        showFeedback('메뉴가 등록되었습니다.');
      }
      setShowMenuForm(false);
      setEditMenu(null);
    } catch {
      showFeedback('메뉴 저장에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!storeId || !deleteTarget) return;
    try {
      if (deleteTarget.type === 'category') {
        await deleteCategoryApi(storeId, deleteTarget.id);
        removeCategory(deleteTarget.id);
        showFeedback('카테고리가 삭제되었습니다.');
      } else {
        await deleteMenuItemApi(storeId, deleteTarget.id);
        removeMenuItem(deleteTarget.id);
        showFeedback('메뉴가 삭제되었습니다.');
      }
    } catch {
      showFeedback('삭제에 실패했습니다.');
    }
    setDeleteTarget(null);
  };

  const handleOrderChange = async (menuId: number, newOrder: number) => {
    if (!storeId) return;
    try {
      const res = await updateMenuItemOrder(storeId, menuId, newOrder);
      updateMenuStore(res.data.data);
    } catch {
      showFeedback('순서 변경에 실패했습니다.');
    }
  };

  const filteredMenus = selectedCategoryId
    ? menuItems.filter((m) => m.categoryId === selectedCategoryId)
    : menuItems;

  if (loading) return <LoadingSpinner message="메뉴 데이터 로딩 중..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  return (
    <div className="menu-management-page">
      <header className="page-header">
        <h1>메뉴 관리</h1>
        {feedback && <div className="feedback-toast" role="status">{feedback}</div>}
      </header>

      {/* 카테고리 섹션 */}
      <section className="section">
        <div className="section-header">
          <h2>카테고리</h2>
          <button type="button" className="btn btn-primary" onClick={() => { setEditCategory(null); setShowCategoryForm(true); }}>
            카테고리 추가
          </button>
        </div>
        {showCategoryForm && (
          <CategoryForm
            editItem={editCategory}
            onSubmit={handleCategorySubmit}
            onCancel={() => { setShowCategoryForm(false); setEditCategory(null); }}
          />
        )}
        <div className="category-list">
          <button
            type="button"
            className={`category-chip ${selectedCategoryId === null ? 'active' : ''}`}
            onClick={() => setSelectedCategoryId(null)}
          >
            전체
          </button>
          {categories.map((cat) => (
            <div key={cat.id} className="category-chip-group">
              <button
                type="button"
                className={`category-chip ${selectedCategoryId === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategoryId(cat.id)}
              >
                {cat.name}
              </button>
              <button type="button" className="btn-icon" onClick={() => { setEditCategory(cat); setShowCategoryForm(true); }} aria-label={`${cat.name} 수정`}>✏️</button>
              <button type="button" className="btn-icon" onClick={() => setDeleteTarget({ type: 'category', id: cat.id })} aria-label={`${cat.name} 삭제`}>🗑️</button>
            </div>
          ))}
        </div>
      </section>

      {/* 메뉴 섹션 */}
      <section className="section">
        <div className="section-header">
          <h2>메뉴 목록</h2>
          <button type="button" className="btn btn-primary" onClick={() => { setEditMenu(null); setShowMenuForm(true); }}>
            메뉴 추가
          </button>
        </div>
        {showMenuForm && (
          <MenuForm
            categories={categories}
            editItem={editMenu}
            onSubmit={handleMenuSubmit}
            onCancel={() => { setShowMenuForm(false); setEditMenu(null); }}
          />
        )}
        <div className="menu-list">
          {filteredMenus.length === 0 && <p>등록된 메뉴가 없습니다.</p>}
          {[...filteredMenus]
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((menu, idx) => (
              <div key={menu.id} className="menu-list-item">
                <div className="menu-list-item__info">
                  {menu.imageUrl && <img src={menu.imageUrl} alt={menu.name} className="menu-thumb" />}
                  <div>
                    <strong>{menu.name}</strong>
                    <span>{menu.price.toLocaleString()}원</span>
                    <span className="text-muted">{categories.find((c) => c.id === menu.categoryId)?.name}</span>
                  </div>
                </div>
                <div className="menu-list-item__actions">
                  <button type="button" className="btn-icon" onClick={() => handleOrderChange(menu.id, Math.max(0, menu.displayOrder - 1))} disabled={idx === 0} aria-label="위로">▲</button>
                  <button type="button" className="btn-icon" onClick={() => handleOrderChange(menu.id, menu.displayOrder + 1)} disabled={idx === filteredMenus.length - 1} aria-label="아래로">▼</button>
                  <button type="button" className="btn-icon" onClick={() => { setEditMenu(menu); setShowMenuForm(true); }} aria-label={`${menu.name} 수정`}>✏️</button>
                  <button type="button" className="btn-icon" onClick={() => setDeleteTarget({ type: 'menu', id: menu.id })} aria-label={`${menu.name} 삭제`}>🗑️</button>
                </div>
              </div>
            ))}
        </div>
      </section>

      <ConfirmDialog
        open={deleteTarget !== null}
        title={deleteTarget?.type === 'category' ? '카테고리 삭제' : '메뉴 삭제'}
        message="삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmLabel="삭제"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default MenuManagementPage;
