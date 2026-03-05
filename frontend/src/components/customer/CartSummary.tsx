interface CartSummaryProps {
  totalAmount: number;
  totalCount: number;
  onOrder: () => void;
  disabled?: boolean;
}

/** 장바구니 요약 - 총 금액, 주문하기 버튼 */
export default function CartSummary({ totalAmount, totalCount, onOrder, disabled }: CartSummaryProps) {
  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        backgroundColor: '#fff',
        borderTop: '1px solid #e5e7eb',
        padding: '16px',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ color: '#6b7280' }}>총 {totalCount}개</span>
        <span style={{ fontSize: '20px', fontWeight: 700 }}>{totalAmount.toLocaleString()}원</span>
      </div>
      <button
        onClick={onOrder}
        disabled={disabled || totalCount === 0}
        style={{
          width: '100%',
          padding: '14px',
          backgroundColor: totalCount === 0 ? '#d1d5db' : '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          fontSize: '16px',
          fontWeight: 700,
          cursor: totalCount === 0 ? 'not-allowed' : 'pointer',
          minHeight: '44px',
        }}
        aria-label="주문하기"
      >
        주문하기
      </button>
    </div>
  );
}
