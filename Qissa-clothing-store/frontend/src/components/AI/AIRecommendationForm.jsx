import { useState } from 'react';

const OCCASIONS = ['Wedding', 'Casual', 'Party', 'Office'];
const SEASONS = ['Summer', 'Winter', 'Spring', 'Autumn'];
const STYLES = ['Elegant', 'Minimal', 'Luxury', 'Modern'];

export default function AIRecommendationForm({ onSubmit, loading }) {
  const [occasion, setOccasion] = useState('');
  const [season, setSeason] = useState('');
  const [style, setStyle] = useState('');
  const [preferredColor, setPreferredColor] = useState('');
  const [budget, setBudget] = useState(15000);
  const [budgetInput, setBudgetInput] = useState('15000');

  const handleBudgetSlider = (val) => {
    const n = Number(val);
    setBudget(n);
    setBudgetInput(String(n));
  };

  const handleBudgetInput = (val) => {
    setBudgetInput(val);
    const n = Number(val.replace(/,/g, ''));
    if (!isNaN(n) && n > 0) setBudget(n);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!occasion || !season || !style) return;
    onSubmit({ occasion, season, style, preferredColor: preferredColor.trim(), budget });
  };

  const canSubmit = occasion && season && style && !loading;

  return (
    <form className="ai-form" onSubmit={handleSubmit}>
      <div className="ai-form-grid">
        <label className="ai-field">
          <span className="ai-field-label">Occasion</span>
          <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className="ai-select">
            <option value="">Select occasion</option>
            {OCCASIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </label>

        <label className="ai-field">
          <span className="ai-field-label">Season</span>
          <select value={season} onChange={(e) => setSeason(e.target.value)} className="ai-select">
            <option value="">Select season</option>
            {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>

        <label className="ai-field">
          <span className="ai-field-label">Style</span>
          <select value={style} onChange={(e) => setStyle(e.target.value)} className="ai-select">
            <option value="">Select style</option>
            {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>

        <label className="ai-field">
          <span className="ai-field-label">Preferred Color</span>
          <input
            type="text"
            value={preferredColor}
            onChange={(e) => setPreferredColor(e.target.value)}
            placeholder="e.g. Black, Blue, Red"
            className="ai-input"
          />
        </label>

        <label className="ai-field ai-field-budget">
          <span className="ai-field-label">Budget — Rs. {budget.toLocaleString()}</span>
          <div className="ai-budget-row">
            <input
              type="range"
              min="1000"
              max="100000"
              step="500"
              value={budget}
              onChange={(e) => handleBudgetSlider(e.target.value)}
              className="ai-slider"
            />
            <input
              type="text"
              value={budgetInput}
              onChange={(e) => handleBudgetInput(e.target.value)}
              className="ai-budget-input"
              aria-label="Budget amount"
            />
          </div>
        </label>
      </div>

      <button type="submit" className="ai-submit-btn" disabled={!canSubmit}>
        {loading && <span className="ai-spinner" />}
        <span>{loading ? 'Finding your perfect style...' : 'Find My Style'}</span>
      </button>
    </form>
  );
}
