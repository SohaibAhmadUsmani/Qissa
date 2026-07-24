import { motion } from 'framer-motion';
import { Truck, Shield, RefreshCw, Headphones } from 'lucide-react';
import './sections.css';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.08 },
  }),
};

const promises = [
  { icon: Truck, title: 'Fast Shipping', desc: 'Dispatch across Pakistan within 24-48 hours.' },
  { icon: Shield, title: 'Fine Fabric Focus', desc: 'Detailed composition and care guidance on each product page.' },
  { icon: RefreshCw, title: 'Easy Returns', desc: 'Hassle-free exchanges within 7 days of delivery.' },
  { icon: Headphones, title: 'Dedicated Support', desc: 'Reach us via chat or email — we respond within hours.' },
];

export default function BrandPromise() {
  return (
    <div className="brand-promise">
      <div className="container brand-promise-inner">
        {promises.map((p, i) => (
          <motion.article
            key={p.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp}
            custom={i}
          >
            <p.icon size={22} strokeWidth={1.5} className="brand-promise-icon" />
            <h4>{p.title}</h4>
            <p>{p.desc}</p>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
