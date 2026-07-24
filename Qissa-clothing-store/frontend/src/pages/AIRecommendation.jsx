import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Palette, Shirt } from 'lucide-react';
import { getStylistRecommendations } from '../services/aiRecommendationService';
import AIRecommendationForm from '../components/AI/AIRecommendationForm';
import AILoading from '../components/AI/AILoading';
import RecommendationSummary from '../components/AI/RecommendationSummary';
import AICard from '../components/AI/AICard';
import EmptyRecommendation from '../components/AI/EmptyRecommendation';
import bgVideo from '../assets/images/style with qissa.mp4';
import './ai-recommendation.css';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
};

export default function AIRecommendation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setSubmitted(true);
    try {
      const data = await getStylistRecommendations(formData);
      if (data?.success && data?.data?.recommendedProducts?.length > 0) {
        setResult(data.data);
        setTimeout(() => {
          document.getElementById('ai-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        setResult(null);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setResult(null);
    setSubmitted(false);
    setFormKey((k) => k + 1);
  };

  return (
    <div className="ai-page">
      <video className="ai-bg-video" autoPlay muted loop playsInline>
        <source src={bgVideo} type="video/mp4" />
      </video>
      <div className="ai-bg-overlay" />
      <div className="container">
        <motion.div className="ai-hero" {...fadeUp}>
          <h1 className="ai-hero-title">Style with Qissa</h1>
          <p className="ai-hero-sub">
            Tell us what you're shopping for, and we'll curate outfits that perfectly match your taste.
          </p>
        </motion.div>

        <motion.div
          key={formKey}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          <AIRecommendationForm onSubmit={handleSubmit} loading={loading} />
        </motion.div>

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AILoading />
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              className="ai-error"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p className="ai-error-text">{error}</p>
              <button className="ai-error-retry" onClick={handleRetry} type="button">
                Try Again
              </button>
            </motion.div>
          )}

          {!loading && !error && submitted && !result && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyRecommendation onRetry={handleRetry} />
            </motion.div>
          )}

          {!loading && !error && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="ai-results"
              id="ai-results"
            >
              <motion.div {...fadeUp}>
                <RecommendationSummary data={result} />
              </motion.div>

              <motion.div className="ai-results-header" {...fadeUp}>
                <h2 className="ai-results-heading">Handpicked for You</h2>
                <p className="ai-results-sub">Based on your preferences, we found the outfits that best match your style.</p>
              </motion.div>

              <div className="ai-cards-grid">
                {result.recommendedProducts.map((product, i) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <AICard product={product} isBest={i === 0} index={i} />
                  </motion.div>
                ))}
              </div>

              {result.stylingTips && (
                <motion.div className="ai-insight-card" {...fadeUp}>
                  <span className="ai-insight-icon">
                    <Shirt size={20} strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3 className="ai-insight-title">Styling Tips</h3>
                    <p className="ai-insight-text">{result.stylingTips}</p>
                  </div>
                </motion.div>
              )}

              {result.whyThisWorks && (
                <motion.div className="ai-insight-card" {...fadeUp}>
                  <span className="ai-insight-icon">
                    <Lightbulb size={20} strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3 className="ai-insight-title">Why This Works</h3>
                    <p className="ai-insight-text">{result.whyThisWorks}</p>
                  </div>
                </motion.div>
              )}

              {result.colorAdvice && (
                <motion.div className="ai-insight-card" {...fadeUp}>
                  <span className="ai-insight-icon">
                    <Palette size={20} strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3 className="ai-insight-title">Color Advice</h3>
                    <p className="ai-insight-text">{result.colorAdvice}</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
