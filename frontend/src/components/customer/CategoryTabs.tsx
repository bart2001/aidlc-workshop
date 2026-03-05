import type { Category } from '../../types';

interface CategoryTabsProps {
  categories: Category[];
  selectedId: number | null;
  onSelect: (categoryId: number | null) => void;
}

/** 카테고리 탭 네비게이션 */
export default function CategoryTabs({ categories, selectedId, onSelect }: CategoryTabsProps) {
  return (
    <nav
      role="tablist"
      aria-label="메뉴 카테고리"
      style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        padding: '8px 0',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <button
        role="tab"
        aria-selected={selectedId === null}
        onClick={() => onSelect(null)}
        style={tabStyle(selectedId === null)}
      >
        전체
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          role="tab"
          aria-selected={selectedId === cat.id}
          onClick={() => onSelect(cat.id)}
          style={tabStyle(selectedId === cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </nav>
  );
}

function tabStyle(active: boolean): React.CSSProperties {
  return {
    padding: '10px 16px',
    border: 'none',
    borderBottom: active ? '3px solid #2563eb' : '3px solid transparent',
    backgroundColor: 'transparent',
    color: active ? '#2563eb' : '#6b7280',
    fontWeight: active ? 700 : 400,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontSize: '14px',
    minWidth: '44px',
    minHeight: '44px',
  };
}
