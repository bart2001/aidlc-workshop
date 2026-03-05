import { useEffect } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useMenuStore } from '../../stores/useMenuStore';
import { useCartStore } from '../../stores/useCartStore';
import Layout from '../../components/common/Layout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import CategoryTabs from '../../components/customer/CategoryTabs';
import MenuCard from '../../components/customer/MenuCard';
import type { MenuItem } from '../../types';

/** 메뉴 조회 페이지 (US-C02) */
export default function MenuPage() {
  const storeId = useAuthStore((s) => s.storeId);
  const { categories, menuItems, selectedCategoryId, loading, error, fetchCategories, fetchMenuItems, selectCategory } =
    useMenuStore();
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (storeId) {
      fetchCategories(storeId);
      fetchMenuItems(storeId);
    }
  }, [storeId, fetchCategories, fetchMenuItems]);

  const handleCategorySelect = (categoryId: number | null) => {
    selectCategory(categoryId);
    if (storeId) {
      fetchMenuItems(storeId, categoryId ?? undefined);
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      menuItemId: item.id,
      menuName: item.name,
      unitPrice: item.price,
      imageUrl: item.imageUrl,
    });
  };

  return (
    <Layout>
      <CategoryTabs
        categories={categories}
        selectedId={selectedCategoryId}
        onSelect={handleCategorySelect}
      />

      {loading && <LoadingSpinner message="메뉴를 불러오는 중..." />}
      {error && <ErrorMessage message={error} onRetry={() => storeId && fetchMenuItems(storeId)} />}

      {!loading && !error && menuItems.length === 0 && (
        <p style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          등록된 메뉴가 없습니다.
        </p>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px',
          marginTop: '16px',
        }}
      >
        {menuItems.map((item) => (
          <MenuCard key={item.id} item={item} onAdd={handleAddToCart} />
        ))}
      </div>
    </Layout>
  );
}
