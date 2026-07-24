import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../ui/ProductCard';
import { catalogProducts } from '../../data/catalog';
import './sections.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.1 },
  }),
};

export default function NewArrivals() {
  const products = catalogProducts.filter((p) => p.isNew).slice(0, 8).map((p) => ({ ...p, originalPrice: null }));

  return (
    <section className="section-space">
      <div className="container">
        <motion.div
          className="section-heading section-heading-row"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
        >
          <div>
            <p className="section-kicker">Fresh Drops</p>
            <h2>New Arrivals</h2>

          </div>
          <Link to="/category/new-arrivals" className="inline-link">
            View All <ArrowRight size={14} />
          </Link>
        </motion.div>

        <div className="product-grid">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeUp}
              custom={i}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
