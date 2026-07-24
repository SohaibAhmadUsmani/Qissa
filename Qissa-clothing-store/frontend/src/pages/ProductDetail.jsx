import { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShoppingBag,
  Heart,
  Zap,
  Bell,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  ChevronLeft,
  ArrowLeft,
  Loader,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import ProductCard from '../components/ui/ProductCard';
import NotifyModal from '../components/ui/NotifyModal';
import { catalogProducts } from '../data/catalog';
import { editorialStories } from '../utils/productImages';
import { addToCart } from '../features/cart/cartSlice';
import { addToWishlist } from '../features/wishlist/wishlistSlice';
import { findBackendProduct, getVariantMap } from '../services/productService';
import './product-detail.css';

const accordionData = [
  {
    key: 'description',
    label: 'Description',
    content:
      'Crafted from premium-quality fabric with meticulous attention to detail, this piece embodies the Qissa commitment to refined craftsmanship. The silhouette is designed to flatter a range of body types while maintaining an elegant drape. Perfect for both casual gatherings and semi-formal occasions.',
  },
  {
    key: 'care',
    label: 'Fabric & Care',
    content:
      'Premium fabric composition. Dry clean recommended or gentle hand wash in cold water. Do not bleach. Iron on medium heat. Store in a cool, dry place away from direct sunlight to preserve colour and texture.',
  },
  {
    key: 'delivery',
    label: 'Delivery Information',
    content:
      'Free shipping across Pakistan. Orders are dispatched within 24–48 hours of confirmation. Standard delivery takes 3–5 business days. Express shipping available at checkout for next-day delivery in major cities.',
  },
  {
    key: 'returns',
    label: 'Return Policy',
    content:
      'Easy returns within 7 days of delivery. Items must be unworn, unwashed, and in original packaging with all tags attached. Customised and sale items are non-returnable. Refunds are processed within 5–7 business days after quality inspection.',
  },
];

const styleProductIds = ['style-shawl', 'style-earrings', 'style-khussa'];

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

const RECENT_LIMIT = 4;
const CLOTHING_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const SHOE_SIZES = ['36', '37', '38', '39', '40', '41', '42'];

const COLOR_MAP = {
  black: '#1c1816',
  white: '#f5f1ec',
  purple: '#6b4c7a',
  yellow: '#e8c54a',
  green: '#5a7340',
  maroon: '#792a2a',
  charcoal: '#3a3735',
  orange: '#c96a2e',
  blue: '#3d6184',
  rust: '#a55a3a',
  navy: '#1e2d4f',
};

function getColorValue(color) {
  const key = color.toLowerCase();
  return COLOR_MAP[key] || '#b0a8a0';
}

function Thumbnail({ src, alt, active, onClick }) {
  return (
    <button
      type="button"
      className={`pdp-thumb ${active ? 'pdp-thumb-active' : ''}`}
      onClick={onClick}
    >
      <img src={src} alt={alt} loading="lazy" />
    </button>
  );
}

function Accordion({ data }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="pdp-accordion">
      {data.map((item) => {
        const isOpen = open === item.key;
        return (
          <div key={item.key} className={`pdp-accordion-item ${isOpen ? 'pdp-accordion-open' : ''}`}>
            <button
              type="button"
              className="pdp-accordion-trigger"
              onClick={() => setOpen(isOpen ? null : item.key)}
            >
              <span>{item.label}</span>
              {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  className="pdp-accordion-content"
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <p>{item.content}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function SkeletonPdp() {
  return (
    <div className="pdp-skeleton">
      <div className="pdp-skeleton-gallery" />
      <div className="pdp-skeleton-info">
        <div className="pdp-skeleton-line" style={{ width: '60%' }} />
        <div className="pdp-skeleton-line" style={{ width: '40%' }} />
        <div className="pdp-skeleton-line" style={{ width: '80%' }} />
        <div className="pdp-skeleton-line" style={{ width: '100%' }} />
        <div className="pdp-skeleton-line" style={{ width: '70%' }} />
      </div>
    </div>
  );
}

function getRecentIds(currentId) {
  const stored = JSON.parse(sessionStorage.getItem('qissa-recent') || '[]');
  const updated = [currentId, ...stored.filter((i) => i !== currentId)].slice(0, 4);
  sessionStorage.setItem('qissa-recent', JSON.stringify(updated));
  return updated;
}

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, user } = useSelector((s) => s.auth);

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [backendProduct, setBackendProduct] = useState(null);
  const [variantMap, setVariantMap] = useState({});
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setProduct(null);
    setProductLoading(true);
    const catalogProduct = catalogProducts.find((p) => p.id === id);
    if (catalogProduct) {
      setProduct(catalogProduct);
      setProductLoading(false);
      return;
    }
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      findBackendProduct(id).then((bp) => {
        if (bp) {
          setProduct({
            id: bp._id || id,
            title: bp.name,
            categoryKey: (bp.subCategory || bp.category || '').toLowerCase().replace(/\s+/g, '-'),
            fabric: bp.fabric || '',
            pieces: '',
            stitchedType: bp.subCategory || 'Ready to Wear',
            color: (bp.colors && bp.colors.length > 0) ? bp.colors[0] : '',
            price: bp.discountPrice || bp.price,
            originalPrice: bp.price,
            stock: bp.stock || 0,
            isNew: bp.isNewArrival || false,
            images: (bp.images || []).map((img) => img.url || img),
            variants: bp.variants || [],
          });
        }
        setProductLoading(false);
      });
    } else {
      setProductLoading(false);
    }
  }, [id]);

  const colorVariants = useMemo(() => {
    if (!product) return [];
    return catalogProducts
      .filter((p) => p.title === product.title)
      .map((p) => ({
        id: p.id,
        color: p.color,
        price: p.price,
        originalPrice: p.originalPrice,
        images: p.images,
        stock: p.stock,
      }));
  }, [product]);

  const productType = useMemo(() => {
    if (!product) return 'clothing';
    if (product.stitchedType === 'Footwear') return 'footwear';
    if (product.stitchedType === 'Accessory') return 'accessory';
    return 'clothing';
  }, [product]);

  const sizeOptions = useMemo(() => {
    if (productType === 'footwear') return SHOE_SIZES;
    return CLOTHING_SIZES;
  }, [productType]);

  const isSizeRequired = productType !== 'accessory';
  const isColorRequired = productType === 'clothing';

  useEffect(() => {
    if (!product) return;
    setSelectedColor(product.color);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    (async () => {
      try {
        const bp = await findBackendProduct(product.title);
        if (bp) {
          setBackendProduct(bp);
          const map = getVariantMap(bp, selectedColor);
          setVariantMap(map);

          const sizes = productType === 'accessory' ? ['Standard'] : sizeOptions;
          const sorted = sizes.filter((s) => s in map);
          const firstAvail = sorted.find((s) => map[s] > 0);
          setSelectedSize(firstAvail || (sorted.length > 0 ? sorted[0] : 'Standard'));
        }
      } catch {
      }
    })();
  }, [product, selectedColor, productType, sizeOptions]);

  useEffect(() => {
    if (!backendProduct || !selectedColor) return;
    const map = getVariantMap(backendProduct, selectedColor);
    setVariantMap(map);

    const sizes = productType === 'accessory' ? ['Standard'] : sizeOptions;
    const sorted = sizes.filter((s) => s in map);
    const currentHasStock = selectedSize && map[selectedSize] !== undefined;
    if (currentHasStock) return;
    const firstAvail = sorted.find((s) => map[s] > 0);
    setSelectedSize(firstAvail || (sorted.length > 0 ? sorted[0] : 'Standard'));
  }, [selectedColor, backendProduct, productType, sizeOptions]);

  const selectedVariantStock = selectedSize ? (variantMap[selectedSize] ?? null) : null;
  const hasSizeSelected = productType === 'accessory' ? true : selectedSize !== '';
  const variantIsInStock = selectedVariantStock !== null && selectedVariantStock > 0;
  const variantIsOutOfStock = selectedVariantStock !== null && selectedVariantStock <= 0;

  const outOfStockMessage = variantIsOutOfStock ? 'Currently Out of Stock' : null;
  const lowStockMessage = variantIsInStock && selectedVariantStock <= 3
    ? `Only ${selectedVariantStock} left in stock`
    : null;

  const recentIds = useMemo(() => getRecentIds(id), [id]);

  const related = useMemo(() => {
    if (!product) return [];
    const seen = new Set(recentIds);
    return catalogProducts.filter(
      (p) => p.id !== id && !seen.has(p.id) && p.title !== product.title,
    ).slice(0, RECENT_LIMIT);
  }, [product, id, recentIds]);

  const recentProducts = useMemo(() => {
    if (!product) return [];
    return recentIds
      .map((rid) => catalogProducts.find((p) => p.id === rid))
      .filter(Boolean);
  }, [recentIds]);

  const displayProduct = useMemo(() => {
    if (!product) return null;
    const colorMatch = colorVariants.find((c) => c.color === selectedColor);
    return colorMatch || product;
  }, [product, colorVariants, selectedColor]);

  const hasDiscount = displayProduct && displayProduct.originalPrice > displayProduct.price;
  const discountPct = hasDiscount
    ? Math.round(((displayProduct.originalPrice - displayProduct.price) / displayProduct.originalPrice) * 100)
    : 0;
  const images = displayProduct?.images || [];
  const editorial = editorialStories[id] || null;

  const handleColorChange = useCallback((colorId) => {
    navigate(`/product/${colorId}`);
  }, [navigate]);

  const handleSizeChange = useCallback((size) => {
    setSelectedSize(size);
    setQuantity(1);
  }, []);

  const handleAddToCart = useCallback(async () => {
    if (!token) {
      toast.error('Please sign in to add items to your cart');
      navigate('/login');
      return;
    }

    if (!product) return;

    if (isSizeRequired && !hasSizeSelected) {
      toast.error('Please select a size');
      return;
    }

    if (!variantIsInStock) {
      const msg = productType === 'accessory'
        ? 'This item is currently out of stock'
        : `"${selectedColor}" in size ${selectedSize} is currently out of stock`;
      toast.error(msg);
      return;
    }

    setAddingToCart(true);

    try {
      const bp = backendProduct || await findBackendProduct(product.title);

      if (!bp) {
        toast.error('This product is not available in our inventory');
        return;
      }

      await dispatch(addToCart({
        product: bp._id,
        color: selectedColor,
        size: selectedSize,
        quantity,
      })).unwrap();

      toast.success('Added to cart!');
      window.dispatchEvent(new CustomEvent('qissa:cart-open'));
    } catch (err) {
      const data = err.response?.data;
      const msg = typeof err === 'string' ? err : data?.message || (data?.errors && Object.values(data.errors).flat().join('. ')) || 'Failed to add to cart';
      toast.error(msg);
    } finally {
      setAddingToCart(false);
    }
  }, [token, selectedSize, selectedColor, product, quantity, dispatch, navigate, backendProduct, variantIsInStock, isSizeRequired, hasSizeSelected, productType]);

  const handleAddToWishlist = useCallback(async () => {
    if (!token) {
      toast.error('Please sign in to add items to your wishlist');
      navigate('/login');
      return;
    }

    if (!product) return;

    try {
      const bp = backendProduct || await findBackendProduct(product.title);

      if (!bp) {
        toast.error('This product is not available in our inventory');
        return;
      }

      await dispatch(addToWishlist(bp._id)).unwrap();
      toast.success('Product added to your Wishlist.');
    } catch (err) {
      const msg = typeof err === 'string' ? err : err?.message || '';
      if (msg.toLowerCase().includes('already')) {
        toast.error('This product is already in your Wishlist.');
      } else {
        toast.error(msg || 'Failed to add to wishlist');
      }
    }
  }, [token, product, backendProduct, dispatch, navigate]);

  if (productLoading) {
    return (
      <motion.section className="container pdp-shell" {...pageTransition}>
        <SkeletonPdp />
      </motion.section>
    );
  }

  if (!product) {
    return (
      <motion.section className="container pdp-shell" {...pageTransition}>
        <div className="pdp-not-found">
          <h2>Product not found</h2>
          <p>This style may no longer be available.</p>
          <Link to="/category/new-arrivals" className="cta-link">
            <ChevronLeft size={14} /> Continue Shopping
          </Link>
        </div>
      </motion.section>
    );
  }

  if (loading) return <SkeletonPdp />;

  const handleMouseMove = (e) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <motion.div key={id} className="pdp-page" {...pageTransition}>
      <div className="container">
        <Link to="/category/new-arrivals" className="pdp-back">
          <ArrowLeft size={14} /> Back to browsing
        </Link>
      </div>

      <div className="container pdp-shell">
        {/* ─── Gallery ─── */}
        <div className="pdp-gallery">
          <div
            className={`pdp-main-image ${zoomed ? 'pdp-zoomed' : ''}`}
            onMouseEnter={() => setZoomed(true)}
            onMouseLeave={() => setZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={images[activeImage]}
                alt={product.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={
                  zoomed
                    ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`, transform: 'scale(1.8)' }
                    : {}
                }
              />
            </AnimatePresence>
          </div>

          <div className="pdp-thumbs">
            {images.map((src, i) => (
              <Thumbnail
                key={i}
                src={src}
                alt={`${product.title} view ${i + 1}`}
                active={i === activeImage}
                onClick={() => setActiveImage(i)}
              />
            ))}
          </div>
        </div>

        {/* ─── Info ─── */}
        <div className="pdp-info">
          <p className="pdp-kicker">
            {product.fabric} / {product.categoryKey.replace('-', ' ')}
          </p>
          <h1 className="pdp-title">{product.title}</h1>

          <div className="pdp-price">
            <span className="pdp-price-current">Rs.{displayProduct.price.toLocaleString()}</span>
            {hasDiscount && (
              <>
                <span className="pdp-price-old">Rs.{displayProduct.originalPrice.toLocaleString()}</span>
                <span className="pdp-price-badge">-{discountPct}% Off</span>
              </>
            )}
          </div>

          <div className="pdp-stock">
            {variantIsOutOfStock ? (
              <span className="pdp-stock-badge pdp-stock-out">{outOfStockMessage}</span>
            ) : lowStockMessage ? (
              <span className="pdp-stock-badge pdp-stock-low">{lowStockMessage}</span>
            ) : hasSizeSelected && variantIsInStock ? (
              <span className="pdp-stock-badge pdp-stock-in">In Stock</span>
            ) : null}
            <span className="pdp-sku">SKU: QS-{product.id.toUpperCase()}</span>
          </div>

          {editorial && (
            <div className="pdp-editorial">
              <p>{editorial}</p>
            </div>
          )}

          {/* ─── Color Selector ─── */}
          {colorVariants.length > 1 && (
            <div className="pdp-selector">
              <label>
                Colour <span>{selectedColor}</span>
              </label>
              <div className="pdp-color-options">
                {colorVariants.map((cv) => (
                  <button
                    key={cv.id}
                    type="button"
                    className={`pdp-color-swatch${cv.color === selectedColor ? ' active' : ''}`}
                    style={{ backgroundColor: getColorValue(cv.color) }}
                    onClick={() => handleColorChange(cv.id)}
                    aria-label={cv.color}
                    title={cv.color}
                  >
                    {cv.color === selectedColor && (
                      <span className="pdp-swatch-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─── Size Selector ─── */}
          {productType !== 'accessory' && (
            <div className="pdp-selector">
              <label>
                {productType === 'footwear' ? 'Shoe Size' : 'Size'} <span>{selectedSize || 'Select'}</span>
              </label>
              <div className="pdp-size-options">
                {sizeOptions.map((s) => {
                  const sv = variantMap[s];
                  const isUnavailable = sv !== undefined && sv <= 0;
                  const isActive = selectedSize === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      className={`pdp-size-btn${isActive ? ' active' : ''}${isUnavailable ? ' pdp-size-unavail' : ''}`}
                      onClick={() => handleSizeChange(s)}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── Quantity ─── */}
          <div className="pdp-selector">
            <label>Quantity</label>
            <div className="pdp-qty">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus size={14} />
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => {
                  const max = selectedVariantStock || product.stock || 10;
                  setQuantity(Math.min(max, quantity + 1));
                }}
                disabled={quantity >= (selectedVariantStock || product.stock || 10)}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* ─── Buttons ─── */}
          <div className="pdp-actions">
            {(!hasSizeSelected || variantIsInStock) && (
              <button
                type="button"
                className="pdp-btn pdp-btn-primary"
                disabled={addingToCart}
                onClick={handleAddToCart}
              >
                {addingToCart ? <Loader size={14} className="spin" /> : <ShoppingBag size={14} />}
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            )}
            <button
              type="button"
              className={`pdp-btn ${variantIsOutOfStock ? 'pdp-btn-disabled' : 'pdp-btn-secondary'}`}
              disabled={variantIsOutOfStock}
            >
              <Zap size={14} /> Buy Now
            </button>
          </div>

          {variantIsOutOfStock && (
            <motion.div
              className="pdp-oos-actions"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="pdp-oos-label">
                {productType === 'accessory'
                  ? 'This item is currently out of stock.'
                  : 'This specific size is currently unavailable.'}
              </p>
              <div className="pdp-oos-row">
                <button
                  type="button"
                  className="pdp-oos-btn pdp-oos-btn-wishlist"
                  onClick={handleAddToWishlist}
                >
                  <Heart size={14} /> Save to Wishlist
                </button>
                <button
                  type="button"
                  className="pdp-oos-btn pdp-oos-btn-notify"
                  onClick={() => setNotifyModalOpen(true)}
                >
                  <Bell size={14} /> Notify Me
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── Accordion ─── */}
          <Accordion data={accordionData} />

          {/* ─── Style It With ─── */}
          {styleProductIds.length > 0 && (
            <div className="pdp-style-with">
              <h3>Style It With</h3>
              <div className="pdp-style-grid">
                {styleProductIds.map((pid) => {
                  const item = catalogProducts.find((p) => p.id === pid);
                  if (!item) return null;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                    >
                      <ProductCard product={item} />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <NotifyModal
        isOpen={notifyModalOpen}
        onClose={() => setNotifyModalOpen(false)}
        product={backendProduct || product}
        size={selectedSize}
        color={selectedColor}
        user={user}
      />

      {/* ─── Related Products ─── */}
      {related.length > 0 && (
        <section className="container pdp-related">
          <div className="section-heading">
            <p className="section-kicker">Complete the Look</p>
            <h2>Related Styles</h2>
          </div>
          <div className="product-grid">
            {related.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ─── Recently Viewed ─── */}
      {recentProducts.length > 0 && (
        <section className="container pdp-related">
          <div className="section-heading">
            <p className="section-kicker">Your Journey</p>
            <h2>Recently Viewed</h2>
          </div>
          <div className="product-grid">
            {recentProducts.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}
