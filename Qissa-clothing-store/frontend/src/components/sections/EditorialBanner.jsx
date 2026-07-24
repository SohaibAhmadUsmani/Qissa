import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './sections.css';

const reveal = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function EditorialBanner() {
  return (
    <section className="editorial-banner section-space">
      <div className="editorial-banner-bg">
        <img src="/assets/images/banner-2.webp" alt="Qissa editorial" loading="lazy" />
      </div>
      <div className="editorial-banner-overlay" />
      <div className="container editorial-banner-content">
        <motion.div
          className="editorial-banner-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={reveal}
        >
          <p className="section-kicker">The Fabric Edit</p>
          <h2>Where Tradition Meets Modern Silhouettes</h2>
          <p>
            Every piece in our collection is selected for its hand feel, drape, and
            endurance through seasons. From the lush lawns of Punjab to the fine
            chiffon of Karachi — we bring Pakistan&apos;s finest textiles to your wardrobe.
          </p>
          <Link to="/category/new-arrivals" className="cta-link">
            Explore the Collection <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
