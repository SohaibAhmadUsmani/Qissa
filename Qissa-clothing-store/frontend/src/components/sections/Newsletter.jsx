import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import './sections.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="section-space newsletter-section">
      <div className="container">
        <motion.div
          className="newsletter-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          {submitted ? (
            <div className="newsletter-success">
              <div className="newsletter-success-icon">
                <Check size={24} strokeWidth={2.5} />
              </div>
              <h2>You are on the list</h2>
              <p>Welcome to the Qissa community. Look out for our first drop in your inbox.</p>
            </div>
          ) : (
            <>
              <p className="section-kicker">Stay Connected</p>
              <h2>Join the Qissa Edit</h2>
              <p className="newsletter-description">
                Be the first to know about new collections, exclusive previews, and fabric stories
                from our partners across Pakistan.
              </p>

              <form className="newsletter-form" onSubmit={handleSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  aria-label="Email address"
                />
                <button type="submit">
                  Subscribe <ArrowRight size={14} />
                </button>
              </form>

              <p className="newsletter-disclaimer">
                No spam. Unsubscribe anytime. We respect your inbox as much as our fabrics.
              </p>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
