const STEPS = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];

export default function OrderTimeline({ status }) {
  const isCancelled = status === 'Cancelled';
  const currentIndex = STEPS.indexOf(status);

  return (
    <div className="order-timeline">
      {isCancelled ? (
        <div className="order-timeline-cancelled">
          <div className="order-timeline-dot cancelled" />
          <div className="order-timeline-line cancelled" />
          <span className="order-timeline-label cancelled-text">Cancelled</span>
        </div>
      ) : (
        STEPS.map((step, idx) => {
          const completed = idx <= currentIndex;
          const isLast = idx === STEPS.length - 1;

          return (
            <div key={step} className="order-timeline-step">
              <div className="order-timeline-dot-container">
                <div className={`order-timeline-dot ${completed ? 'completed' : ''}`}>
                  {completed && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                {!isLast && (
                  <div className={`order-timeline-line ${completed ? 'completed' : ''}`} />
                )}
              </div>
              <span className={`order-timeline-label ${completed ? 'completed' : ''}`}>
                {step}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}
