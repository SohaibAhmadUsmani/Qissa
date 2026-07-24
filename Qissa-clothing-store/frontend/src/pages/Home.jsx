import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import NewArrivals from '../components/sections/NewArrivals';
import FeaturedCategories from '../components/sections/FeaturedCategories';
import EditorialBanner from '../components/sections/EditorialBanner';
import ShopByFabric from '../components/sections/ShopByFabric';
import TrendingCarousel from '../components/sections/TrendingCarousel';
import BrandStory from '../components/sections/BrandStory';
import BrandPromise from '../components/sections/BrandPromise';
import Testimonials from '../components/sections/Testimonials';
import InstagramGallery from '../components/sections/InstagramGallery';
import Newsletter from '../components/sections/Newsletter';
import HeroCarousel from '../components/sections/HeroCarousel';
import { catalogProducts } from '../data/catalog';
import './home.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.08 },
  }),
};

const heroReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function Home() {
  const bestSellers = catalogProducts
    .filter((p) => !p.isNew)
    .map((p) => ({
      ...p,
      discountPercent: p.originalPrice
        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
        : 0,
    }))
    .sort((a, b) => b.discountPercent - a.discountPercent)
    .slice(0, 8);

  return (
    <div className="home-page">
      {/* ─── Hero ─── */}
      <section className="hero-section">
        <HeroCarousel />
        <motion.div
          className="container hero-content"
          initial="hidden"
          animate="visible"
          variants={heroReveal}
        >
          <div className="hero-card">
            <p className="hero-kicker">Volume I / New Arrivals</p>
            <h1>Fashion That Feels Curated, Not Crowded</h1>
            <Link to="/category/new-arrivals" className="cta-link">
              Explore Collection <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ─── Featured Categories ─── */}
      <FeaturedCategories />

      {/* ─── Best Sellers ─── */}
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
              <p className="section-kicker">Best Sellers</p>
              <h2>Most Loved This Week</h2>
              <p className="section-subtitle">
                The styles our customers keep coming back for.
              </p>
            </div>
            <Link to="/category/sale" className="inline-link">
              View All Products <ArrowRight size={14} />
            </Link>
          </motion.div>

          <div className="product-grid">
            {bestSellers.map((product, i) => (
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

      {/* ─── New Arrivals ─── */}
      <NewArrivals />

      {/* ─── Editorial Banner ─── */}
      <EditorialBanner />

      {/* ─── Shop by Fabric ─── */}
      <ShopByFabric />

      {/* ─── Trending This Week ─── */}
      <TrendingCarousel />

      {/* ─── Brand Story ─── */}
      <BrandStory />

      {/* ─── Brand Promise ─── */}
      <BrandPromise />

      {/* ─── Testimonials ─── */}
      <Testimonials />

      {/* ─── Instagram Gallery ─── */}
      <InstagramGallery />

      {/* ─── Newsletter ─── */}
      <Newsletter />
    </div>
  );
}
