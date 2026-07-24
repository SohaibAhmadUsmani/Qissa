import { RotateCcw } from 'lucide-react';

export default function EmptyRecommendation({ onRetry }) {
  return (
    <div className="ai-empty">
      <h3 className="ai-empty-title">We couldn't find an exact match for your preferences</h3>
      <p className="ai-empty-text">
        Try adjusting your budget, preferred color, or season to discover more styles.
      </p>
      {onRetry && (
        <button className="ai-empty-retry" onClick={onRetry} type="button">
          <RotateCcw size={15} strokeWidth={1.8} />
          Reset Filters
        </button>
      )}
    </div>
  );
}
