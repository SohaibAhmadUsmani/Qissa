import { Target } from 'lucide-react';
import ConfidenceIndicator from './ConfidenceIndicator';

export default function RecommendationSummary({ data }) {
  if (!data) return null;

  return (
    <div className="ai-summary">
      <div className="ai-summary-header">
        <h2 className="ai-summary-title">Style with Qissa</h2>
      </div>

      {data.summary && <p className="ai-summary-text">{data.summary}</p>}

      <div className="ai-summary-stats">
        <div className="ai-summary-stat">
          <ConfidenceIndicator score={data.confidenceScore} />
        </div>

        {data.reason && (
          <div className="ai-summary-stat">
            <Target size={18} strokeWidth={1.5} />
            <div>
              <span className="ai-stat-label">Why This Works</span>
              <span className="ai-stat-value">{data.reason}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
