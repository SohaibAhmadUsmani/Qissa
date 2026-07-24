import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { X, Minus, Plus, Trash2, ShoppingBag, Loader, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { updateCartItem, removeCartItem, clearCartItems } from '../../features/cart/cartSlice';
import { getProductImages } from '../../utils/productImages';
import { catalogProducts } from '../../data/catalog';
import { fetchCart } from '../../features/cart/cartSlice';
import './cart-drawer.css';

const FALLBACK_IMAGE = '/assets/images/clothes/printed-lawn-3pc/IMG1.webp';

const catalogMap = {};
catalogProducts.forEach((p) => {
  const key = p.title.toLowerCase().replace(/[^a-z0-9]/g, '');
  catalogMap[key] = p;
});

function getItemImage(item) {
  try {
    const prod = item.product;
    if (!prod || typeof prod !== 'object') return FALLBACK_IMAGE;
    const name = (prod.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const matched = catalogMap[name];
    if (matched) {
      if (matched.images && matched.images.length > 0) return matched.images[0];
      if (matched.id) {
        const localImages = getProductImages(matched.id);
        if (localImages && localImages.length > 0) return localImages[0];
      }
    }
    if (prod.images && Array.isArray(prod.images) && prod.images.length > 0) {
      const url = prod.images[0]?.url;
      if (url) return url;
    }
  } catch {
  }
  return FALLBACK_IMAGE;
}

function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

export default function CartDrawer({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, subtotal, totalItems, loading, updating, clearing } = useSelector((s) => s.cart);
  const { token } = useSelector((s) => s.auth);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (isOpen && token) {
      dispatch(fetchCart());
    }
  }, [isOpen, token, dispatch]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      return;
    }
    const sw = getScrollbarWidth();
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${sw}px`;
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  const handleQtyChange = useCallback(async (item, delta) => {
    const prod = item.product;
    if (!prod || typeof prod !== 'object') { toast.error('Product information unavailable'); return; }
    const qty = item.quantity + delta;
    if (qty < 1) return;
    try {
      await dispatch(updateCartItem({
        productId: prod._id,
        color: item.color,
        size: item.size,
        quantity: qty,
      })).unwrap();
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to update quantity');
    }
  }, [dispatch]);

  const handleRemove = useCallback(async (item) => {
    const prod = item.product;
    if (!prod || typeof prod !== 'object') { toast.error('Product information unavailable'); return; }
    try {
      await dispatch(removeCartItem({
        productId: prod._id,
        color: item.color,
        size: item.size,
      })).unwrap();
      toast.success('Item removed');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to remove item');
    }
  }, [dispatch]);

  const handleClear = useCallback(async () => {
    if (!window.confirm('Clear your entire cart?')) return;
    try {
      await dispatch(clearCartItems()).unwrap();
      toast.success('Cart cleared');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to clear cart');
    }
  }, [dispatch]);

  const handleViewCart = useCallback(() => {
    onClose();
    navigate('/cart');
  }, [onClose, navigate]);

  const isEmpty = items.length === 0;

  const drawer = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="cart-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.aside
            ref={drawerRef}
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            <div className="cart-drawer-header">
              <div>
                <h2>Shopping Cart</h2>
                {!isEmpty && <span className="cart-drawer-count">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>}
              </div>
              <button type="button" className="cart-drawer-close" onClick={onClose} aria-label="Close cart">
                <X size={18} />
              </button>
            </div>

            {loading && (
              <div className="cart-drawer-loading">
                <Loader size={18} className="spin" />
                <span>Loading cart...</span>
              </div>
            )}

            {!loading && isEmpty && (
              <div className="cart-drawer-empty">
                <div className="cd-empty-icon">
                  <ShoppingBag size={48} strokeWidth={1} />
                </div>
                <h3>Your shopping cart is empty</h3>
                <p>Looks like you haven&apos;t added anything yet.</p>
                <button type="button" className="cart-drawer-continue-btn" onClick={onClose}>
                  <ArrowLeft size={14} /> Continue Shopping
                </button>
              </div>
            )}

            {!loading && !isEmpty && (
              <>
                <div className="cart-drawer-items">
                  {items
                    .filter((item) => item.product && typeof item.product === 'object')
                    .map((item) => {
                      const prod = item.product;
                      const prodName = prod.name || 'Product';
                      const prodPrice = prod.discountPrice || prod.price || 0;
                      const imgSrc = getItemImage(item);
                      return (
                        <motion.div
                          key={`${prod._id}-${item.color}-${item.size}`}
                          className="cart-drawer-item"
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 50 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="cd-item-image">
                            <img src={imgSrc} alt={prodName} loading="lazy" />
                          </div>
                          <div className="cd-item-body">
                            <div className="cd-item-top">
                              <div className="cd-item-info">
                                <h4>{prodName}</h4>
                                <p className="cd-item-meta">{item.color} / {item.size}</p>
                                <p className="cd-item-price">Rs.{prodPrice.toLocaleString()}</p>
                                <span className="cd-item-stock">In Stock</span>
                              </div>
                              <button
                                type="button"
                                className="cd-item-remove"
                                onClick={() => handleRemove(item)}
                                disabled={updating}
                                aria-label="Remove item"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div className="cd-item-bottom">
                              <div className="cd-item-qty">
                                <button
                                  type="button"
                                  onClick={() => handleQtyChange(item, -1)}
                                  disabled={item.quantity <= 1 || updating}
                                >
                                  <Minus size={12} />
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => handleQtyChange(item, 1)}
                                  disabled={updating}
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                              <p className="cd-item-line-total">Rs.{(prodPrice * item.quantity).toLocaleString()}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                </div>

                <div className="cart-drawer-footer">
                  <div className="cd-footer-row">
                    <span>Total Items</span>
                    <strong>{totalItems}</strong>
                  </div>
                  <div className="cd-footer-row cd-footer-subtotal">
                    <span>Subtotal</span>
                    <strong>Rs.{subtotal.toLocaleString()}</strong>
                  </div>
                  <p className="cd-footer-note">Shipping will be calculated at checkout.</p>
                  {updating && <p className="cd-footer-updating"><Loader size={12} className="spin" /> Updating...</p>}
                  <div className="cd-footer-actions">
                    <button type="button" className="cd-btn cd-btn-ghost" onClick={onClose}>
                      Continue Shopping
                    </button>
                    <button type="button" className="cd-btn cd-btn-outline" onClick={handleViewCart}>
                      View Cart <ArrowRight size={13} />
                    </button>
                    <button
                      type="button"
                      className="cd-btn cd-btn-primary"
                      disabled={isEmpty}
                      onClick={() => { onClose(); navigate('/checkout'); }}
                    >
                      Proceed to Checkout <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(drawer, document.body);
}
