import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './sections.css';

const fadeIn = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function BrandStory() {
  return (
    <section className="brand-story section-space">
      <div className="container brand-story-grid">
        <motion.div
          className="brand-story-image"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeIn}
        >
          <img
            src="/assets/images/banner-2.webp"
            alt="Qissa Wear craft detail"
            loading="lazy"
          />
          <div className="brand-story-image-accent" />
        </motion.div>

        <motion.div
          className="brand-story-content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeInRight}
        >
          <p className="section-kicker">Our Philosophy</p>
          <h2>Every Thread Tells a Story</h2>
          <p>
            Qissa is an Urdu word meaning <em>story</em>. Every piece we carry has one —
            from the artisan who wove the fabric to the moment you make it your own.
          </p>
          <p>
            We collaborate with mills across Pakistan that share our obsession with quality —
            sourcing lawn from Punjab, chiffon from Karachi, and khaddar from Faisalabad.
            Each fabric is selected for its hand feel, drape, and endurance through seasons.
          </p>
          <p>
            Our edit is intentionally curated — fewer styles, better quality, stronger character.
            We believe fashion should feel personal, not overwhelming.
          </p>
          <Link to="/category/new-arrivals" className="cta-link">
            Explore the Collection <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
