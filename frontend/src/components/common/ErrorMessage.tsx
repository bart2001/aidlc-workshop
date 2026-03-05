/** 에러 메시지 표시 컴포넌트 */
export default function ErrorMessage({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      style={{
        padding: '16px',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        color: '#dc2626',
        textAlign: 'center',
      }}
    >
      <p style={{ margin: 0 }}>⚠️ {message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            marginTop: '12px',
            padding: '8px 16px',
            backgroundColor: '#dc2626',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            minWidth: '44px',
            minHeight: '44px',
          }}
          aria-label="다시 시도"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
