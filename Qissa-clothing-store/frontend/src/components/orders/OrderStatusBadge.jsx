const STATUS_COLORS = {
  Pending: { bg: '#fef6e0', text: '#a86800' },
  Confirmed: { bg: '#e0edff', text: '#1a56db' },
  Processing: { bg: '#e0edff', text: '#1a56db' },
  Shipped: { bg: '#ede0ff', text: '#6b21a8' },
  Delivered: { bg: '#e0f7e6', text: '#1a7a3a' },
  Cancelled: { bg: '#fef0ee', text: '#b33a2e' },
};

export default function OrderStatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || { bg: '#f0f0f0', text: '#666' };

  return (
    <span
      className="order-status-badge"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        padding: '0.2rem 0.6rem',
        borderRadius: '999px',
        fontSize: '0.68rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        background: colors.bg,
        color: colors.text,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: colors.text,
          flexShrink: 0,
        }}
      />
      {status}
    </span>
  );
}
