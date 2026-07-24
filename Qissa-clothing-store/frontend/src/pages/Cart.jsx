import { useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateCartItem, removeCartItem, clearCartItems } from '../features/cart/cartSlice';
import { catalogProducts } from '../data/catalog';
import { getProductImages } from '../utils/productImages';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Loader, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import './cart.css';

const FALLBACK_IMAGE = '/assets/images/clothes/printed-lawn-3pc/IMG1.webp';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, subtotal, totalItems, loading, updating, clearing } = useSelector((s) => s.cart);
  const { token } = useSelector((s) => s.auth);

  const catalogMap = useMemo(() => {
    const map = {};
    catalogProducts.forEach((p) => {
      const key = p.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      map[key] = p;
    });
    return map;
  }, []);

  const getImage = useCallback((item) => {
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
  }, [catalogMap]);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    dispatch(fetchCart());
  }, [dispatch, token, navigate]);

  const handleQuantity = async (item, delta) => {
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
      toast.success('Quantity updated');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to update quantity');
    }
  };

  const handleRemove = async (item) => {
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
  };

  const handleClear = async () => {
    if (!window.confirm('Are you sure you want to clear your entire cart?')) return;
    try {
      await dispatch(clearCartItems()).unwrap();
      toast.success('Cart cleared');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to clear cart');
    }
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-loading"><Loader size={20} className="spin" /> Loading your cart...</div>
        </div>
      </div>
    );
  }

  const isEmpty = items.length === 0;

  return (
    <div className="cart-page">
      <div className="container">
        <Link to="/" className="cart-back"><ArrowLeft size={14} /> Continue Shopping</Link>
        <div className="cart-header">
          <div>
            <p className="cart-kicker">Your Selection</p>
            <h1 className="cart-title">Shopping Cart</h1>
          </div>
          {!isEmpty && (
            <button type="button" className="cart-clear-btn" onClick={handleClear} disabled={clearing || updating}>
              {clearing ? <Loader size={14} className="spin" /> : <Trash2 size={14} />} Clear Cart
            </button>
          )}
        </div>

        {isEmpty ? (
          <div className="cart-empty">
            <ShoppingBag size={40} strokeWidth={1} />
            <h3>Your cart is empty</h3>
            <p>Looks like you haven&apos;t added anything yet.</p>
            <Link to="/category/new-arrivals" className="cart-shop-link"><ChevronLeft size={14} /> Start Shopping</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {items.filter((item) => item.product && typeof item.product === 'object').map((item, idx) => {
                const prod = item.product;
                const prodId = prod._id;
                const prodName = prod.name || 'Product';
                const prodPrice = prod.discountPrice || prod.price || 0;
                return (
                  <div key={`${prodId}-${item.color}-${item.size}-${idx}`} className="cart-item">
                    <div className="cart-item-image">
                      <img src={getImage(item)} alt={prodName} loading="lazy" />
                    </div>
                    <div className="cart-item-details">
                      <h3>{prodName}</h3>
                      <p className="cart-item-meta">{item.color} / {item.size}</p>
                      <p className="cart-item-price">Rs.{prodPrice.toLocaleString()}</p>
                    </div>
                    <div className="cart-item-qty">
                      <button type="button" onClick={() => handleQuantity(item, -1)} disabled={item.quantity <= 1 || updating}>
                        <Minus size={13} />
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => handleQuantity(item, 1)} disabled={updating}>
                        <Plus size={13} />
                      </button>
                    </div>
                    <div className="cart-item-total">
                      <p>Rs.{(prodPrice * item.quantity).toLocaleString()}</p>
                    </div>
                    <div className="cart-item-remove">
                      <button type="button" onClick={() => handleRemove(item)} disabled={updating} aria-label="Remove item">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Total Items</span>
                <strong>{totalItems}</strong>
              </div>
              <div className="cart-summary-row cart-summary-total">
                <span>Subtotal</span>
                <strong>Rs.{subtotal.toLocaleString()}</strong>
              </div>
              <p className="cart-summary-note">Shipping & taxes calculated at checkout</p>
              {updating && <p className="cart-updating"><Loader size={14} className="spin" /> Updating...</p>}
              <button
                type="button"
                className="cart-checkout-btn"
                disabled={isEmpty}
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
