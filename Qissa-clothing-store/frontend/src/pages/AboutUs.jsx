import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Feather, Sparkles, Truck, CreditCard, RefreshCw, Search, Headphones } from 'lucide-react';
import Newsletter from '../components/sections/Newsletter';
import './about-us.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.08 },
  }),
};

const heroReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const fadeIn = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const beliefs = [
  {
    icon: Feather,
    title: 'Premium Fabrics',
    desc: 'Handpicked textiles from Pakistan\'s finest mills — lawn, chiffon, silk, and khaddar selected for quality and feel.',
  },
  {
    icon: Sparkles,
    title: 'Thoughtful Craftsmanship',
    desc: 'Every piece reflects the skill of artisans who bring generations of expertise to every stitch and embellishment.',
  },
  {
    icon: Shield,
    title: 'Designed for Every Occasion',
    desc: 'From casual daywear to formal celebrations, our edit is curated to dress life\'s full spectrum of moments.',
  },
];

const features = [
  { icon: Truck, title: 'Fast Nationwide Delivery', desc: 'Free shipping across Pakistan with 3–5 business day delivery on all orders.' },
  { icon: CreditCard, title: 'Secure Payments', desc: 'Protected checkout with encrypted transactions and multiple payment options.' },
  { icon: RefreshCw, title: 'Easy Returns', desc: 'Hassle-free returns within 7 days. We believe in fit and satisfaction.' },
  { icon: Search, title: 'Quality Checked Products', desc: 'Each piece is inspected for finishing, fabric, and fit before dispatch.' },
  { icon: Headphones, title: 'Responsive Customer Support', desc: 'Reach us via phone, email, or social media. We\'re here to help.' },
];

const promises = [
  { label: 'Quality', desc: 'Premium fabrics and meticulous finishing in every stitch.' },
  { label: 'Comfort', desc: 'Designed for ease of wear across seasons and occasions.' },
  { label: 'Authenticity', desc: 'Genuine textiles sourced directly from Pakistani mills.' },
  { label: 'Timeless Style', desc: 'Thoughtful designs that transcend seasonal trends.' },
];

export default function AboutUs() {
  return (
    <div className="about-page">

      <section className="about-hero">
        <div className="about-hero-bg">
          <img src="/assets/images/about-1.webp" alt="Qissa fashion" loading="lazy" />
        </div>
        <div className="about-hero-overlay" />
        <motion.div
          className="about-hero-content"
          initial="hidden"
          animate="visible"
          variants={heroReveal}
        >
          <p className="about-hero-kicker">About Qissa</p>
          <h1>Every Outfit Has a Qissa.</h1>
          <p className="about-hero-desc">
            Qissa celebrates timeless Pakistani fashion with modern elegance — weaving together heritage textiles, contemporary design, and everyday sophistication.
          </p>
          <Link to="/category/new-arrivals" className="cta-link">
            Explore Collection <ArrowRight size={14} />
          </Link>
        </motion.div>
      </section>

      <section className="about-story section-space">
        <div className="container about-story-grid">
          <motion.div
            className="about-story-image"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeIn}
          >
            <img src="/assets/images/about-2.webp" alt="Qissa craft detail" loading="lazy" />
            <div className="about-story-accent" />
          </motion.div>
          <motion.div
            className="about-story-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeInRight}
          >
            <p className="section-kicker">Our Story</p>
            <h2>Born from a Love for Pakistani Textiles</h2>
            <p>
              Qissa began with a simple belief: the fabrics we wear carry stories worth telling. From the lush cotton fields of Punjab to the intricate embroidery workshops of Karachi, we travel the country to bring you pieces that honour Pakistan's rich textile heritage.
            </p>
            <p>
              Every collection is curated with intention — fewer styles, better quality, stronger character. We work directly with mills and artisans who share our obsession with hand feel, drape, and enduring craftsmanship.
            </p>
            <p>
              What emerged is a brand that sits at the intersection of tradition and modernity. Qissa is for the woman who values substance over surplus, and believes her wardrobe should tell a story as unique as her own.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="about-beliefs section-space">
        <div className="container">
          <motion.div
            className="section-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
          >
            <p className="section-kicker">What We Believe</p>
            <h2>Our Foundations</h2>
          </motion.div>
          <div className="about-beliefs-grid">
            {beliefs.map((item, i) => (
              <motion.div
                key={item.title}
                className="about-belief-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                custom={i}
              >
                <div className="about-belief-icon">
                  <item.icon size={22} strokeWidth={1.75} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      <section className="about-editorial">
        <div className="about-editorial-bg">
          <img src="/assets/images/about-updated-3.webp" alt="Qissa editorial" loading="lazy" />
        </div>
        <div className="about-editorial-overlay" />
        <div className="container about-editorial-content">
          <motion.div
            className="about-editorial-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={heroReveal}
          >
            <h2>Crafted for Moments That Matter.</h2>
            <p>From intimate gatherings to grand celebrations — every Qissa piece is designed to be part of your story.</p>
          </motion.div>
        </div>
      </section>

      <section className="about-promise section-space">
        <div className="container">
          <motion.div
            className="section-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
          >
            <p className="section-kicker">Our Promise</p>
            <h2>What We Stand For</h2>
          </motion.div>
          <div className="about-promise-grid">
            {promises.map((item, i) => (
              <motion.div
                key={item.label}
                className="about-promise-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                custom={i}
              >
                <span className="about-promise-label">{item.label}</span>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta section-space">
        <div className="container">
          <motion.div
            className="about-cta-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <p className="section-kicker">Begin Your Journey</p>
            <h2>Begin Your Qissa.</h2>
            <p>Explore our collection and find the pieces that speak to your story.</p>
            <Link to="/category/new-arrivals" className="cta-link">
              Shop Now <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}
