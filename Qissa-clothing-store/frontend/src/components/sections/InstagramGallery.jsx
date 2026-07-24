import { motion } from 'framer-motion';
import './sections.css';

const images = [
  { src: '/assets/images/banner-1.webp', alt: 'Qissa Wear editorial campaign' },
  { src: '/assets/images/ethnic.webp', alt: 'Ethnic wear collection' },
  { src: '/assets/images/formal.webp', alt: 'Formal evening wear' },
  { src: '/assets/images/pret.webp', alt: 'Ready to wear pret collection' },
  { src: '/assets/images/casual.webp', alt: 'Casual daily wear' },
  { src: '/assets/images/banner-3.webp', alt: 'Seasonal collection feature' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.06 },
  }),
};

export default function InstagramGallery() {
  return (
    <section className="section-space instagram-section">
      <div className="container">
        <motion.div
          className="section-heading"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
        >
          <p className="section-kicker">Follow Us</p>
          <h2>@qissa.wear</h2>
          <p className="section-subtitle">
            Style inspiration, behind-the-scenes, and customer features on Instagram.
          </p>
        </motion.div>
      </div>

      <div className="instagram-grid">
        {images.map((img, i) => (
          <motion.a
            key={i}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-item"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp}
            custom={i}
          >
            <img src={img.src} alt={img.alt} loading="lazy" />
            <div className="instagram-overlay">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
