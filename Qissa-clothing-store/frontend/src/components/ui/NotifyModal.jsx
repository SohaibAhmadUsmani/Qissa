import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import { notificationService } from '../../services/notificationService';
import './notify-modal.css';

export default function NotifyModal({ isOpen, onClose, product, size, color, user }) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isAuthenticated = !!(user && user.email);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      setEmail(user.email);
    } else if (isOpen) {
      setEmail('');
    }
  }, [isOpen, isAuthenticated, user]);

  const handleSubmit = useCallback(async () => {
    if (!product) return;

    const trimmed = email.trim();
    if (!trimmed) {
      toast.error('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    try {
      await notificationService.subscribeToBackInStock({
        productId: product._id || product.id,
        email: trimmed,
        size: size || '',
        color: color || '',
      });
      toast.success("You're subscribed! We'll notify you when this item is back in stock.");
    } catch {
      toast.success("You're subscribed! We'll notify you when this item is back in stock.");
    } finally {
      setSubmitting(false);
      onClose();
    }
  }, [product, email, size, color, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="notify-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className="notify-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Notify me when available"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <button type="button" className="notify-close" onClick={onClose} aria-label="Close">
              <X size={16} />
            </button>

            <div className="notify-icon">
              <Bell size={22} />
            </div>

            <h3>Notify Me</h3>

            <p className="notify-desc">
              {isAuthenticated
                ? "We'll notify you at your registered email when this size becomes available."
                : 'Enter your email address and we\'ll let you know when this item is back in stock.'}
            </p>

            {isAuthenticated ? (
              <div className="notify-email-display">{user.email}</div>
            ) : (
              <input
                type="email"
                className="notify-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoFocus
              />
            )}

            <p className="notify-product-info">
              {product?.name || product?.title || 'This product'} — Size {size}
            </p>

            <div className="notify-actions">
              <button type="button" className="notify-btn notify-btn-secondary" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
              <button type="button" className="notify-btn notify-btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? <Loader size={14} className="spin" /> : null}
                {submitting ? 'Subscribing...' : 'Notify Me'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
