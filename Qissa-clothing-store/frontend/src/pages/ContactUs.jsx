import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Clock, MapPin, Send, Check, ChevronDown, Camera, MessageCircle, Music, Image, Globe } from 'lucide-react';
import Newsletter from '../components/sections/Newsletter';
import './contact-us.css';

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

const contactInfo = [
  { icon: Phone, label: 'Phone', value: '+92 300 123 4567', href: 'tel:+923001234567' },
  { icon: Mail, label: 'Email', value: 'hello@qissawear.com', href: 'mailto:hello@qissawear.com' },
  { icon: Clock, label: 'Business Hours', value: 'Monday – Saturday\n10:00 AM – 9:00 PM\nSunday\nClosed' },
  { icon: MapPin, label: 'Location', value: 'F-10 Markaz\nIslamabad, Pakistan' },
];

const faqs = [
  {
    q: 'How long does shipping take?',
    a: 'Orders are dispatched within 24–48 hours. Standard delivery takes 3–5 business days across Pakistan. Express shipping is available at checkout.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer hassle-free returns within 7 days of delivery. Items must be unworn with original tags. Refunds are processed within 5–7 business days.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit/debit cards, bank transfers, and cash on delivery for orders across Pakistan. All transactions are encrypted and secure.',
  },
  {
    q: 'How can I track my order?',
    a: 'Once your order is dispatched, you will receive a tracking link via email and SMS. You can also track your order from your account dashboard.',
  },
];

const socialLinks = [
  { icon: Camera, label: 'Instagram', href: '#' },
  { icon: MessageCircle, label: 'Facebook', href: '#' },
  { icon: Music, label: 'TikTok', href: '#' },
  { icon: Image, label: 'Pinterest', href: '#' },
  { icon: Globe, label: 'LinkedIn', href: '#' },
];

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Please enter a valid email';
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="contact-page">

      <section className="contact-hero">
        <div className="contact-hero-bg">
          <video src="/assets/images/contact-video.mp4" autoPlay muted loop playsInline />
        </div>
        <div className="contact-hero-overlay" />
        <motion.div
          className="contact-hero-content"
          initial="hidden"
          animate="visible"
          variants={heroReveal}
        >
          <p className="contact-hero-kicker">Get in Touch</p>
          <h1>We&apos;d Love to Hear Your Qissa.</h1>
          <p className="contact-hero-desc">
            Whether you have a question about your order, need styling advice, or just want to say hello — we&apos;re here for you.
          </p>
        </motion.div>
      </section>

      <section className="contact-info section-space">
        <div className="container">
          <div className="contact-info-grid">
            {contactInfo.map((item, i) => (
              <motion.div
                key={item.label}
                className="contact-info-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                custom={i}
              >
                <div className="contact-info-icon">
                  <item.icon size={20} strokeWidth={1.75} />
                </div>
                <h3>{item.label}</h3>
                {item.href ? (
                  <a href={item.href} className="contact-info-value">{item.value}</a>
                ) : (
                  <p className="contact-info-value">{item.value}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-form-section section-space">
        <div className="container">
          <div className="contact-form-layout">
            <motion.div
              className="contact-form-content"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
            >
              <p className="section-kicker">Send Us a Message</p>
              <h2>We&apos;re Here to Help</h2>
              <p className="section-subtitle">
                Fill in the form and our team will get back to you within 24 hours.
              </p>

              {submitted ? (
                <div className="contact-form-success">
                  <div className="contact-success-icon">
                    <Check size={24} strokeWidth={2.5} />
                  </div>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. We&apos;ll respond within 24 hours.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  <div className="contact-form-row">
                    <div className="contact-field">
                      <label htmlFor="name">Name *</label>
                      <input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                      />
                      {errors.name && <span className="contact-field-error">{errors.name}</span>}
                    </div>
                    <div className="contact-field">
                      <label htmlFor="email">Email *</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                      />
                      {errors.email && <span className="contact-field-error">{errors.email}</span>}
                    </div>
                  </div>
                  <div className="contact-form-row">
                    <div className="contact-field">
                      <label htmlFor="phone">Phone (optional)</label>
                      <input
                        id="phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+92 300 123 4567"
                      />
                    </div>
                    <div className="contact-field">
                      <label htmlFor="subject">Subject *</label>
                      <input
                        id="subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                      />
                      {errors.subject && <span className="contact-field-error">{errors.subject}</span>}
                    </div>
                  </div>
                  <div className="contact-field">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your inquiry..."
                      rows={4}
                    />
                    {errors.message && <span className="contact-field-error">{errors.message}</span>}
                  </div>
                  <button type="submit" className="contact-submit-btn">
                    Send Message <Send size={14} />
                  </button>
                </form>
              )}
            </motion.div>

            <motion.div
              className="contact-map"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              custom={1}
            >
              <div className="contact-map-placeholder">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3319.926!2d73.008!3d33.684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbfaf4a4e3b5b%3A0x4f0e0e0e0e0e0e0e!2sF-10%20Markaz%2C%20Islamabad%2C%20Pakistan!5e0!3m2!1sen!2s!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '1rem' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Qissa Store Location"
                />
                <div className="contact-map-overlay">
                  <MapPin size={28} strokeWidth={1.5} />
                  <h3>Visit Our Store</h3>
                  <p>F-10 Markaz</p>
                  <p>Islamabad, Pakistan</p>
                  <div className="contact-map-hours">
                    <p><strong>Monday – Saturday:</strong> 10:00 AM – 9:00 PM</p>
                    <p><strong>Sunday:</strong> Closed</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="contact-faq section-space">
        <div className="container">
          <motion.div
            className="section-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
          >
            <p className="section-kicker">FAQ</p>
            <h2>Common Questions</h2>
          </motion.div>
          <div className="contact-faq-list">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="contact-faq-item"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                custom={i}
              >
                <button
                  type="button"
                  className={`contact-faq-question${openFaq === i ? ' contact-faq-open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={14} strokeWidth={2.5} className={`contact-faq-chevron${openFaq === i ? ' contact-faq-chevron-open' : ''}`} />
                </button>
                <div className={`contact-faq-answer${openFaq === i ? ' contact-faq-answer-open' : ''}`}>
                  <p>{faq.a}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-social section-space">
        <div className="container">
          <motion.div
            className="section-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
          >
            <p className="section-kicker">Follow Us</p>
            <h2>Stay Connected</h2>
          </motion.div>
          <motion.div
            className="contact-social-row"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
          >
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="contact-social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
              >
                <link.icon size={20} strokeWidth={1.75} />
                <span>{link.label}</span>
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}
