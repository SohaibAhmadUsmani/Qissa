import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import './sections.css';

const testimonials = [
  {
    id: 1,
    name: 'Zara H.',
    location: 'Lahore',
    text: 'The fabric quality exceeded what I expected. I have ordered three times now and every piece feels substantial and well-finished. The chiffon dupattas are gorgeous.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Amina K.',
    location: 'Karachi',
    text: 'Finally a store that does not overwhelm you with hundreds of identical options. The curation is thoughtful, the visuals are honest, and delivery was faster than promised.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Sana T.',
    location: 'Islamabad',
    text: 'I wore the embroidered khaddar set to a family dinner and received so many compliments. The stitching is clean and the fabric breathes well even in humid weather.',
    rating: 5,
  },
];

const INTERVAL = 4000;

const variants = {
  enter: (dir) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir < 0 ? 200 : -200, opacity: 0 }),
};

function Stars({ count }) {
  return (
    <span className="stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }, (_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

export default function Testimonials() {
  const [[active, dir], setActive] = useState([0, 0]);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((index) => {
    setActive(([prev]) => {
      const dir = index > prev ? 1 : -1;
      return [((index % testimonials.length) + testimonials.length) % testimonials.length, dir];
    });
  }, []);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, INTERVAL);
    return () => clearInterval(timer);
  }, [paused, next]);

  const t = testimonials[active];

  return (
    <section className="section-space testimonials-section">
      <div className="container">
        <div className="section-heading">
          <p className="section-kicker">From Our Community</p>
          <h2>What Customers Say</h2>
          <p className="section-subtitle">
            Real voices from women who wear Qissa — no scripts, just honest feedback.
          </p>
        </div>

        <div
          className="testimonials-carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button type="button" className="testimonial-arrow testimonial-arrow-left" onClick={prev} aria-label="Previous">
            <ChevronLeft size={20} />
          </button>

          <div className="testimonial-stage">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={t.id}
                className="testimonial-slide"
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Quote size={24} className="testimonial-quote-icon" />
                <Stars count={t.rating} />
                <p className="testimonial-slide-text">{t.text}</p>
                <div className="testimonial-slide-author">
                  <strong>{t.name}</strong>
                  <span>{t.location}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button type="button" className="testimonial-arrow testimonial-arrow-right" onClick={next} aria-label="Next">
            <ChevronRight size={20} />
          </button>

          <div className="testimonial-dots">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`testimonial-dot ${i === active ? 'testimonial-dot-active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
