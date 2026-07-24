import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './sections.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.08 },
  }),
};

const fabrics = [
  {
    name: 'Lawn',
    description: 'Breathable cotton fabric, perfect for everyday elegance',
    image: '/assets/images/clothes/printed-lawn-3pc-purple/IMG1.webp',
    link: '/category/unstitched',
  },
  {
    name: 'Chiffon',
    description: 'Lightweight, fluid, and delicately sheer',
    image: '/assets/images/clothes/embroidered-chiffon-3pc-yellow/IMG1.webp',
    link: '/category/formal',
  },
  {
    name: 'Silk',
    description: 'Lustrous weaves for timeless occasion wear',
    image: '/assets/images/clothes/pret-jacquard-maroon/IMG1.webp',
    link: '/category/ready-to-wear',
  },
  {
    name: 'Cotton',
    description: 'Soft, breathable staples for everyday comfort',
    image: '/assets/images/clothes/printed-lawn-3pc/IMG1.webp',
    link: '/category/unstitched',
  },
  {
    name: 'Karandi',
    description: 'Textured cotton with subtle woven detail',
    image: '/assets/images/clothes/embroidered-slub-khaddar-3pc/IMG1.webp',
    link: '/category/new-arrivals',
  },
];

export default function ShopByFabric() {
  return (
    <section className="fabric-section section-space">
      <div className="container">
        <motion.div
          className="section-heading"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
        >
          <p className="section-kicker">Textile Stories</p>
          <h2>Shop by Fabric</h2>

        </motion.div>

        <div className="fabric-grid">
          {fabrics.map((fabric, i) => (
            <motion.div
              key={fabric.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeUp}
              custom={i}
            >
              <Link to={fabric.link} className="fabric-card">
                <div className="fabric-card-image">
                  <img src={fabric.image} alt={fabric.name} loading="lazy" />
                </div>
                <div className="fabric-card-body">
                  <h3>{fabric.name}</h3>
                  <p>{fabric.description}</p>
                  <span>
                    Shop Now <ArrowRight size={12} />
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
