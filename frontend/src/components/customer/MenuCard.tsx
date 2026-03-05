import type { MenuItem } from '../../types';

interface MenuCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

/** 메뉴 카드 - 이미지, 메뉴명, 가격, 설명, 추가 버튼 */
export default function MenuCard({ item, onAdd }: MenuCardProps) {
  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      {/* 이미지 영역 */}
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.name}
          style={{ width: '100%', height: '140px', objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '140px',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
          }}
          aria-hidden="true"
        >
          🍽️
        </div>
      )}

      {/* 정보 영역 */}
      <div style={{ padding: '12px' }}>
        <h3 style={{ margin: '0 0 4px', fontSize: '16px' }}>{item.name}</h3>
        {item.description && (
          <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#6b7280' }}>{item.description}</p>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: '16px', color: '#2563eb' }}>
            {item.price.toLocaleString()}원
          </span>
          <button
            onClick={() => onAdd(item)}
            style={{
              minWidth: '44px',
              minHeight: '44px',
              padding: '8px 16px',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
            }}
            aria-label={`${item.name} 장바구니에 추가`}
          >
            + 담기
          </button>
        </div>
      </div>
    </div>
  );
}
