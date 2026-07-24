import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../ui/ProductCard';
import { catalogProducts } from '../../data/catalog';
import './sections.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function TrendingCarousel() {
  const scrollRef = useRef(null);

  const trending = catalogProducts.slice(0, 10);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const dist = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: dir * dist, behavior: 'smooth' });
  };

  return (
    <section className="trending-section section-space">
      <div className="container">
        <motion.div
          className="section-heading section-heading-row"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
        >
          <div>
            <p className="section-kicker">Trending</p>
            <h2>Trending This Week</h2>
            <p className="section-subtitle">
              The styles everyone is adding to their cart right now.
            </p>
          </div>
          <div className="trending-actions">
            <button
              type="button"
              className="trending-arrow"
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="trending-arrow"
              onClick={() => scroll(1)}
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
            <Link to="/category/new-arrivals" className="inline-link">
              View All <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="trending-track-wrap">
        <div className="trending-track" ref={scrollRef}>
          {trending.map((product) => (
            <div key={product.id} className="trending-item">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
