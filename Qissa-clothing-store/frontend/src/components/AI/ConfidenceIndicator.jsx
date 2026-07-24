import { useEffect, useState } from 'react';

function Stars({ filled, total = 5 }) {
  return (
    <span className="confidence-stars" aria-label={`${filled} out of ${total} stars`}>
      {Array.from({ length: total }, (_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < filled ? 'var(--ai-primary)' : 'var(--ai-border)'} stroke="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

export default function ConfidenceIndicator({ score = 0 }) {
  const [animated, setAnimated] = useState(0);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, score));
  const offset = circumference - (animated / 100) * circumference;

  const color =
    clamped >= 80 ? 'var(--ai-primary)' :
    clamped >= 60 ? 'var(--ai-secondary)' :
    '#b2493c';

  const stars =
    clamped >= 80 ? 5 :
    clamped >= 60 ? 4 :
    clamped >= 40 ? 3 : 2;

  const label =
    clamped >= 80 ? 'Highly Recommended' :
    clamped >= 60 ? 'Great Pick' :
    'Good Selection';

  useEffect(() => {
    const start = performance.now();
    const duration = 1200;
    function frame(now) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setAnimated(clamped * ease);
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }, [clamped]);

  return (
    <div className="confidence-ring">
      <svg width="92" height="92" viewBox="0 0 92 92">
        <circle
          cx="46" cy="46" r={radius}
          fill="none"
          stroke="var(--ai-border)"
          strokeWidth="5"
        />
        <circle
          cx="46" cy="46" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 46 46)"
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>
      <div className="confidence-ring-inner">
        <Stars filled={stars} />
        <span className="confidence-value">{Math.round(animated)}<span className="confidence-unit">%</span></span>
        <span className="confidence-label">{label}</span>
      </div>
    </div>
  );
}
