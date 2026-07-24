import { useEffect, useState } from 'react';

const MESSAGES = [
  'Finding your perfect style...',
  'Curating your recommendations...',
  'Analyzing your preferences...',
  'Preparing your personalized collection...',
  'Reviewing options within your budget...',
  'Handpicking the best outfits for you...',
];

export default function AILoading() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="ai-loading">
      <div className="ai-loading-shimmer" />
      <div className="ai-loading-content">
        <div className="ai-loading-spinner" />
        <div className="ai-loading-text">{MESSAGES[index]}</div>
        <div className="ai-loading-dots">
          {MESSAGES.map((_, i) => (
            <span
              key={i}
              className={`ai-loading-dot${i === index ? ' active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
