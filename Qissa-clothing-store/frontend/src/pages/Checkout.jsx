import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ArrowLeft,
  Loader,
  MapPin,
  CheckCircle,
  Package,
  AlertCircle,
  User,
  Truck,
  CreditCard,
  Tag,
  Shield,
  Lock,
  RotateCcw,
  Zap,
  ChevronRight,
  Wallet,
  Home,
  Briefcase,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { addressService } from '../services/addressService';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import { fetchCart } from '../features/cart/cartSlice';
import './checkout.css';

const SHIPPING = 200;
const FALLBACK_IMAGE = '/assets/images/clothes/printed-lawn-3pc/IMG1.webp';

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  country: '',
  provinceState: '',
  city: '',
  postalCode: '',
  streetAddress: '',
  landmark: '',
  addressType: 'Home',
  isDefault: false,
};

function getProductImage(item) {
  try {
    const prod = item.product;
    if (!prod || typeof prod !== 'object') return FALLBACK_IMAGE;
    if (prod.images && prod.images.length > 0) {
      const url = prod.images[0]?.url;
      if (url) return url;
    }
  } catch {}
  return FALLBACK_IMAGE;
}

function formatAddress(a) {
  return [a.streetAddress, a.city, a.provinceState, a.postalCode, a.country].filter(Boolean).join(', ');
}

const PAYMENT_OPTIONS = [
  {
    id: 'stripe',
    label: 'Credit / Debit Card',
    description: 'Pay securely via Stripe',
    icon: CreditCard,
    recommended: true,
  },
  {
    id: 'cod',
    label: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    icon: Wallet,
    recommended: false,
  },
];

const TRUST_ITEMS = [
  { icon: Lock, label: 'Secure Checkout' },
  { icon: Shield, label: 'SSL Encrypted' },
  { icon: RotateCcw, label: 'Easy Returns' },
  { icon: Zap, label: 'Fast Shipping' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, subtotal, loading: cartLoading } = useSelector((s) => s.cart);
  const { token, user: authUser } = useSelector((s) => s.auth);

  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addressError, setAddressError] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [promoCode, setPromoCode] = useState('');

  const [form, setForm] = useState(EMPTY_FORM);
  const [activeSavedId, setActiveSavedId] = useState(null);

  const savedSnapshotRef = useRef(null);

  const authLoaded = authUser !== null;

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoadingAddresses(true);
        setAddressError(null);
        const { data } = await addressService.getAddresses();
        if (cancelled) return;
        const list = data.data || [];
        setAddresses(list);

        const defaultAddr = list.find((a) => a.isDefault) || list[0] || null;

        setForm((prev) => {
          const next = { ...prev };
          if (authUser) {
            const parts = (authUser.name || '').trim().split(/\s+/);
            next.firstName = parts[0] || '';
            next.lastName = parts.slice(1).join(' ') || '';
            next.email = authUser.email || '';
          }
          if (defaultAddr) {
            next.phone = defaultAddr.phone || prev.phone;
            next.country = defaultAddr.country || '';
            next.provinceState = defaultAddr.provinceState || '';
            next.city = defaultAddr.city || '';
            next.postalCode = defaultAddr.postalCode || '';
            next.streetAddress = defaultAddr.streetAddress || '';
            next.landmark = defaultAddr.landmark || '';
            next.addressType = defaultAddr.addressType || 'Home';
            next.isDefault = defaultAddr.isDefault || false;
            setActiveSavedId(defaultAddr._id);
            savedSnapshotRef.current = { ...defaultAddr };
          }
          return next;
        });
      } catch (err) {
        if (cancelled) return;
        setAddressError(err.response?.data?.message || 'Failed to load addresses');
      } finally {
        if (!cancelled) {
          setLoadingAddresses(false);
        }
      }
    };

    if (authLoaded) {
      load();
    }
  }, [authLoaded, authUser]);

  const total = subtotal + SHIPPING;

  const handleFieldChange = (field) => (e) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
    if (activeSavedId && savedSnapshotRef.current) {
      const snap = savedSnapshotRef.current;
      const fields = ['firstName', 'lastName', 'email', 'phone', 'country', 'provinceState', 'city', 'postalCode', 'streetAddress', 'landmark', 'addressType'];
      const changed = fields.some((f) => {
        if (f === 'firstName') return form.firstName !== snap.fullName?.split(/\s+/)[0];
        if (f === 'lastName') return form.lastName !== snap.fullName?.split(/\s+/).slice(1).join(' ');
        return form[f] !== snap[f];
      });
    }
  };

  const handleSelectSavedAddress = (addr) => {
    setForm((prev) => ({
      ...prev,
      phone: addr.phone || prev.phone,
      country: addr.country || '',
      provinceState: addr.provinceState || '',
      city: addr.city || '',
      postalCode: addr.postalCode || '',
      streetAddress: addr.streetAddress || '',
      landmark: addr.landmark || '',
      addressType: addr.addressType || 'Home',
      isDefault: addr.isDefault || false,
    }));
    setActiveSavedId(addr._id);
    savedSnapshotRef.current = { ...addr };
  };

  const saveAddressToBackend = async () => {
    const payload = {
      fullName: `${form.firstName} ${form.lastName}`.trim(),
      phone: form.phone,
      country: form.country,
      provinceState: form.provinceState,
      city: form.city,
      postalCode: form.postalCode,
      streetAddress: form.streetAddress,
      landmark: form.landmark,
      addressType: form.addressType,
      isDefault: form.isDefault,
    };

    const snap = savedSnapshotRef.current;

    if (activeSavedId && snap) {
      const snapPayload = {
        fullName: snap.fullName || `${form.firstName} ${form.lastName}`,
        phone: snap.phone,
        country: snap.country,
        provinceState: snap.provinceState,
        city: snap.city,
        postalCode: snap.postalCode,
        streetAddress: snap.streetAddress,
        landmark: snap.landmark || '',
        addressType: snap.addressType || 'Home',
        isDefault: snap.isDefault || false,
      };

      const changed = Object.keys(payload).some((k) => payload[k] !== snapPayload[k]);
      if (changed) {
        const { data } = await addressService.updateAddress(activeSavedId, payload);
        return data.data._id;
      }
      return activeSavedId;
    }

    const { data } = await addressService.createAddress(payload);
    return data.data._id;
  };

  const handlePlaceOrder = useCallback(async (addressId) => {
    try {
      setPlacingOrder(true);
      setValidationErrors([]);
      const { data } = await orderService.checkoutOrder(addressId);
      setOrderResult(data.data);
      dispatch(fetchCart());
      toast.success(data.message || 'Order placed successfully!');
    } catch (err) {
      const errData = err.response?.data;
      if (errData?.errors && Array.isArray(errData.errors)) {
        setValidationErrors(errData.errors);
      }
      toast.error(errData?.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  }, [dispatch]);

  const handleContinueToPayment = useCallback(async () => {
    const { firstName, lastName, email, phone, country, provinceState, city, postalCode, streetAddress } = form;
    if (!firstName || !lastName || !email || !phone) {
      toast.error('Please fill in all contact fields');
      return;
    }
    if (!country || !provinceState || !city || !postalCode || !streetAddress) {
      toast.error('Please fill in all shipping address fields');
      return;
    }

    setPlacingOrder(true);
    try {
      const addressId = await saveAddressToBackend();

      if (paymentMethod === 'cod') {
        // Cash on Delivery — create order immediately
        await handlePlaceOrder(addressId);
      } else {
        // Credit / Debit Card — create Stripe Checkout Session and redirect
        const { data } = await paymentService.createCheckoutSession(addressId);
        window.location.href = data.url;
      }
    } catch (err) {
      if (paymentMethod !== 'cod') {
        const errData = err.response?.data;
        toast.error(errData?.message || 'Failed to initiate payment');
      }
      setPlacingOrder(false);
    }
  }, [form, activeSavedId, handlePlaceOrder, paymentMethod]);

  const handlePromoApply = () => {
    toast('Promo codes will be available soon.', { icon: 'ℹ️' });
  };

  if (!token) return null;

  if (orderResult) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-success">
            <div className="checkout-success-icon">
              <CheckCircle size={52} strokeWidth={1.2} />
            </div>
            <h2 className="checkout-success-title">Order Confirmed!</h2>
            <p className="checkout-success-subtitle">
              Thank you, {orderResult.address?.fullName?.split(' ')[0] || 'Valued Customer'}!
            </p>
            <p className="checkout-success-ref">
              Order reference: <strong>{orderResult.orderNumber}</strong>
            </p>
            <p className="checkout-success-msg">
              We&rsquo;ll send a confirmation to your email once your order ships.
            </p>

            <div className="checkout-success-cards">
              <div className="checkout-success-card">
                <h4>Order Summary</h4>
                <div className="checkout-succ-row">
                  <span>Items ({orderResult.items.length})</span>
                  <span>Rs.{orderResult.subtotal.toLocaleString()}</span>
                </div>
                <div className="checkout-succ-row">
                  <span>Shipping</span>
                  <span>Rs.{orderResult.shipping.toLocaleString()}</span>
                </div>
                <div className="checkout-succ-row checkout-succ-total">
                  <span>Total</span>
                  <span>Rs.{orderResult.total.toLocaleString()}</span>
                </div>
              </div>
              <div className="checkout-success-card">
                <h4>Shipping To</h4>
                <p className="checkout-succ-name">{orderResult.address.fullName}</p>
                <p className="checkout-succ-phone">{orderResult.address.phone}</p>
                <p className="checkout-succ-addr">{formatAddress(orderResult.address)}</p>
              </div>
            </div>

            <button type="button" className="checkout-succ-btn" onClick={() => navigate('/category/new-arrivals')}>
              Continue Shopping <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <button type="button" className="checkout-back" onClick={() => navigate('/cart')}>
          <ArrowLeft size={14} /> Back to Cart
        </button>

        <div className="checkout-header">
          <p className="checkout-kicker">Secure Checkout</p>
          <h1 className="checkout-title">Complete Your Order</h1>
        </div>

        {cartLoading ? (
          <div className="checkout-loading">
            <Loader size={20} className="spin" /> Loading your cart...
          </div>
        ) : items.length === 0 ? (
          <div className="checkout-empty">
            <Package size={44} strokeWidth={1} />
            <h3>Your cart is empty</h3>
            <p>Add some items before checking out.</p>
            <button type="button" className="checkout-empty-btn" onClick={() => navigate('/category/new-arrivals')}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="checkout-layout">
            <div className="checkout-main">
              {/* SECTION 1 — CONTACT INFORMATION */}
              <section className="checkout-section" id="checkout-contact">
                <div className="checkout-section-head">
                  <User size={16} strokeWidth={1.5} />
                  <h3>Contact Information</h3>
                </div>

                <div className="checkout-form-grid cols-2">
                  <div className="checkout-field">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={handleFieldChange('firstName')}
                      placeholder="First Name"
                    />
                  </div>
                  <div className="checkout-field">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={handleFieldChange('lastName')}
                      placeholder="Last Name"
                    />
                  </div>
                  <div className="checkout-field">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={handleFieldChange('email')}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="checkout-field">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={handleFieldChange('phone')}
                      placeholder="03XX-XXXXXXX"
                    />
                  </div>
                </div>
              </section>

              {/* SECTION 2 — SHIPPING ADDRESS */}
              <section className="checkout-section" id="checkout-shipping">
                <div className="checkout-section-head">
                  <MapPin size={16} strokeWidth={1.5} />
                  <h3>Shipping Address</h3>
                </div>

                <div className="checkout-form-grid cols-2">
                  <div className="checkout-field">
                    <label>Country</label>
                    <input
                      type="text"
                      value={form.country}
                      onChange={handleFieldChange('country')}
                      placeholder="Pakistan"
                    />
                  </div>
                  <div className="checkout-field">
                    <label>Province / State</label>
                    <input
                      type="text"
                      value={form.provinceState}
                      onChange={handleFieldChange('provinceState')}
                      placeholder="Punjab"
                    />
                  </div>
                  <div className="checkout-field">
                    <label>City</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={handleFieldChange('city')}
                      placeholder="Lahore"
                    />
                  </div>
                  <div className="checkout-field">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      value={form.postalCode}
                      onChange={handleFieldChange('postalCode')}
                      placeholder="54000"
                    />
                  </div>
                  <div className="checkout-field full-width">
                    <label>Street Address</label>
                    <input
                      type="text"
                      value={form.streetAddress}
                      onChange={handleFieldChange('streetAddress')}
                      placeholder="House #, Street, Area"
                    />
                  </div>
                  <div className="checkout-field full-width">
                    <label>Apartment / Landmark (Optional)</label>
                    <input
                      type="text"
                      value={form.landmark}
                      onChange={handleFieldChange('landmark')}
                      placeholder="Near..."
                    />
                  </div>
                </div>

                {addressError && (
                  <div className="checkout-error-inline" style={{ marginTop: '0.75rem' }}>
                    <AlertCircle size={14} /> {addressError}
                  </div>
                )}
              </section>

              {/* SECTION 3 — SAVED ADDRESSES */}
              {addresses.length > 0 && (
                <section className="checkout-section" id="checkout-saved">
                  <div className="checkout-section-head">
                    <MapPin size={16} strokeWidth={1.5} />
                    <h3>Saved Addresses</h3>
                    <span className="checkout-saved-count">{addresses.length}</span>
                  </div>
                  <p className="checkout-saved-hint">
                    Select a saved address to quickly fill the form. You can still edit before continuing.
                  </p>
                  <div className="checkout-saved-list">
                    {addresses.map((addr) => {
                      const isActive = activeSavedId === addr._id;
                      const Icon = addr.addressType === 'Office' ? Briefcase : Home;
                      return (
                        <button
                          key={addr._id}
                          type="button"
                          className={`checkout-saved-card${isActive ? ' active' : ''}`}
                          onClick={() => handleSelectSavedAddress(addr)}
                        >
                          <Icon size={16} strokeWidth={1.2} />
                          <div className="checkout-saved-card-body">
                            <div className="checkout-saved-card-head">
                              <span className="checkout-saved-card-name">{addr.fullName}</span>
                              {addr.isDefault && <span className="checkout-addr-badge">Default</span>}
                              <span className="checkout-saved-card-type">{addr.addressType}</span>
                            </div>
                            <p className="checkout-saved-card-addr">{addr.streetAddress}</p>
                            <p className="checkout-saved-card-loc">
                              {addr.city}, {addr.provinceState} {addr.postalCode}
                            </p>
                          </div>
                          {isActive && <span className="checkout-saved-check">Selected</span>}
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* SECTION 4 — DELIVERY METHOD */}
              <section className="checkout-section" id="checkout-delivery">
                <div className="checkout-section-head">
                  <Truck size={16} strokeWidth={1.5} />
                  <h3>Delivery Method</h3>
                </div>
                <div className="checkout-delivery-card selected">
                  <div className="checkout-delivery-left">
                    <Truck size={20} strokeWidth={1.2} />
                    <div>
                      <p className="checkout-delivery-label">Standard Delivery</p>
                      <p className="checkout-delivery-time">Estimated 2&ndash;4 Business Days</p>
                    </div>
                  </div>
                  <span className="checkout-delivery-price">Rs.{SHIPPING.toLocaleString()}</span>
                </div>
              </section>

              {/* SECTION 5 — PAYMENT METHOD */}
              <section className="checkout-section" id="checkout-payment">
                <div className="checkout-section-head">
                  <CreditCard size={16} strokeWidth={1.5} />
                  <h3>Payment Method</h3>
                </div>
                <div className="checkout-payment-list">
                  {PAYMENT_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <label
                        key={opt.id}
                        className={`checkout-payment-card${paymentMethod === opt.id ? ' selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={opt.id}
                          checked={paymentMethod === opt.id}
                          onChange={() => setPaymentMethod(opt.id)}
                        />
                        <Icon size={20} strokeWidth={1.2} />
                        <div className="checkout-payment-info">
                          <span className="checkout-payment-label">
                            {opt.label}
                            {opt.recommended && (
                              <span className="checkout-payment-badge">Recommended</span>
                            )}
                          </span>
                          <span className="checkout-payment-desc">{opt.description}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
                <p className="checkout-payment-note">
                  Your payment information is processed securely. We do not store card details.
                </p>
              </section>

              {/* SECTION 6 — PROMO CODE */}
              <section className="checkout-section" id="checkout-promo">
                <div className="checkout-section-head">
                  <Tag size={16} strokeWidth={1.5} />
                  <h3>Promo Code</h3>
                </div>
                <div className="checkout-promo-row">
                  <input
                    type="text"
                    className="checkout-promo-input"
                    placeholder="Enter coupon code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button type="button" className="checkout-promo-btn" onClick={handlePromoApply}>
                    Apply
                  </button>
                </div>
                <p className="checkout-promo-hint">Promo codes will be available soon.</p>
              </section>

              {/* TRUST */}
              <section className="checkout-section checkout-trust">
                {TRUST_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="checkout-trust-item">
                      <Icon size={15} strokeWidth={1.5} />
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </section>
            </div>

            {/* SIDEBAR — ORDER SUMMARY */}
            <aside className="checkout-sidebar">
              <div className="checkout-sidebar-inner">
                <h3 className="checkout-sidebar-title">Order Summary</h3>

                <div className="checkout-sidebar-items">
                  {items.filter((item) => item.product && typeof item.product === 'object').map((item, idx) => {
                    const prod = item.product;
                    const prodPrice = prod.discountPrice || prod.price || 0;
                    return (
                      <div key={`${prod._id}-${item.color}-${item.size}-${idx}`} className="checkout-sidebar-item">
                        <div className="checkout-sidebar-img">
                          <img src={getProductImage(item)} alt={prod.name} />
                          <span className="checkout-sidebar-qty">{item.quantity}</span>
                        </div>
                        <div className="checkout-sidebar-info">
                          <p className="checkout-sidebar-name">{prod.name}</p>
                          <p className="checkout-sidebar-variant">{item.color} / {item.size}</p>
                        </div>
                        <p className="checkout-sidebar-price">Rs.{(prodPrice * item.quantity).toLocaleString()}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="checkout-sidebar-totals">
                  <div className="checkout-sidebar-row">
                    <span>Subtotal</span>
                    <span>Rs.{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="checkout-sidebar-row">
                    <span>Shipping</span>
                    <span>Rs.{SHIPPING.toLocaleString()}</span>
                  </div>
                  <div className="checkout-sidebar-row checkout-sidebar-grand">
                    <span>Grand Total</span>
                    <span>Rs.{total.toLocaleString()}</span>
                  </div>
                </div>

                {validationErrors.length > 0 && (
                  <div className="checkout-sidebar-errors">
                    <p className="checkout-sidebar-errors-title">Issues with your order:</p>
                    <ul>
                      {validationErrors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  type="button"
                  className="checkout-place-btn"
                  disabled={placingOrder}
                  onClick={handleContinueToPayment}
                >
                  {placingOrder ? (
                    <span className="checkout-place-loading">
                      <Loader size={16} className="spin" /> Processing...
                    </span>
                  ) : (
                    'Continue to Payment'
                  )}
                </button>

                <div className="checkout-sidebar-trust">
                  {TRUST_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="checkout-sidebar-trust-item">
                        <Icon size={12} strokeWidth={1.5} />
                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
