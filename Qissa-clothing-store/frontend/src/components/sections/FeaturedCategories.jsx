import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import shawlCover from '../../assets/images/shawl.webp';
import bottomsCover from '../../assets/images/bottoms.webp';
import jewelryCover from '../../assets/images/jewellery.mp4';
import './sections.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.08 },
  }),
};

const categories = [
  {
    key: 'new-arrivals',
    title: 'New Arrivals',
    subtitle: 'Fresh drops from our latest production',
    image: '/assets/images/new-arrivals.webp',
    large: true,
  },
  {
    key: 'unstitched',
    title: 'Unstitched',
    subtitle: 'Fabric-first sets with premium finishing',
    image: '/assets/images/ethnic.webp',
  },
  {
    key: 'ready-to-wear',
    title: 'Ready to Wear',
    subtitle: 'Effortless pret outfits for everyday',
    image: '/assets/images/pret.webp',
  },
  {
    key: 'formal',
    title: 'Formal',
    subtitle: 'Embellished edits for occasions',
    image: '/assets/images/formal.webp',
  },
  {
    key: 'shawls',
    title: 'Shawls',
    subtitle: 'Seasonal shawls and statement drape layers',
    image: shawlCover,
  },
  {
    key: 'bottoms',
    title: 'Bottoms',
    subtitle: 'Essential bottoms for every wardrobe',
    image: bottomsCover,
  },
  {
    key: 'jewelry',
    title: 'Jewelry',
    subtitle: 'Finishing touches for your ensemble',
    image: jewelryCover,
    video: true,
  },
];

export default function FeaturedCategories() {
  return (
    <section className="section-space">
      <div className="container">
        <motion.div
          className="section-heading"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
        >
          <p className="section-kicker">Curated Edit</p>
          <h2>Shop by Chapter</h2>

        </motion.div>

        <div className="featured-grid">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.key}
              className={`featured-card${cat.large ? ' featured-card-large' : ''}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              custom={i}
            >
              <Link to={`/category/${cat.key}`} className="featured-card-link">
                <div className="featured-card-image">
                  {cat.video ? (
                    <video autoPlay muted loop playsInline>
                      <source src={cat.image} type="video/mp4" />
                    </video>
                  ) : (
                    <img src={cat.image} alt={cat.title} loading="lazy" />
                  )}
                </div>
                <div className="featured-card-overlay" />
                <div className="featured-card-content">
                  <h3>{cat.title}</h3>
                  <p>{cat.subtitle}</p>
                  <span>
                    Explore <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
