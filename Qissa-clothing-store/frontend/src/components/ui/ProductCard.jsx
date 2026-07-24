import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ShoppingBag, Heart, Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addToCart } from '../../features/cart/cartSlice';
import { addToWishlist } from '../../features/wishlist/wishlistSlice';
import { findBackendProduct, getVariantMap } from '../../services/productService';
import './product-card.css';

export default function ProductCard({ product }) {
  const { id, title, category, price, originalPrice, images, stock, fabric, color } = product;
  const [isHovered, setIsHovered] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const [adding, setAdding] = useState(false);
  const [sizeStock, setSizeStock] = useState(null);
  const [backendProd, setBackendProd] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((s) => s.auth);
  const sizeRef = useRef(null);

  const CLOTHING_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
  const SHOE_SIZES = ['36', '37', '38', '39', '40', '41', '42'];

  const productType = useMemo(() => {
    if (!product.stitchedType) return 'clothing';
    if (product.stitchedType === 'Footwear') return 'footwear';
    if (product.stitchedType === 'Accessory') return 'accessory';
    return 'clothing';
  }, [product.stitchedType]);

  const sizes = useMemo(() => {
    if (productType === 'footwear') return SHOE_SIZES;
    if (productType === 'accessory') return [];
    return CLOTHING_SIZES;
  }, [productType]);

  useEffect(() => {
    if (!showSizes) return;
    const handleClickOutside = (e) => {
      if (sizeRef.current && !sizeRef.current.contains(e.target)) {
        setShowSizes(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSizes]);

  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 3;
  const isJewelry = product.categoryKey === 'jewelry';
  const primaryImage = images?.[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80';
  const secondaryImage = isJewelry ? primaryImage : (images?.[1] || primaryImage);

  const loadSizeStock = useCallback(async () => {
    try {
      const bp = await findBackendProduct(title);
      if (!bp) return;
      setBackendProd(bp);
      const map = getVariantMap(bp, color);
      setSizeStock(map);
    } catch {
    }
  }, [title, color]);

  const handleSizeSelect = async (size) => {
    if (!token) {
      toast.error('Please sign in to add items to your cart');
      navigate('/login');
      return;
    }

    const bp = backendProd || await findBackendProduct(title);
    if (!bp) {
      toast.error('This product is not available in our inventory');
      return;
    }
    if (!backendProd) setBackendProd(bp);

    const stockCount = getVariantMap(bp, color)[size] ?? 0;

    if (stockCount <= 0) {
      try {
        await dispatch(addToWishlist(bp._id)).unwrap();
        toast.success(`Saved size ${size} to your Wishlist.`);
      } catch (err) {
        const msg = typeof err === 'string' ? err : err?.message || '';
        if (msg.toLowerCase().includes('already')) {
          toast.error('This product is already in your Wishlist.');
        } else {
          toast.error(msg || 'Failed to add to wishlist');
        }
      }
      return;
    }

    setAdding(true);

    try {
      await dispatch(addToCart({
        product: bp._id,
        color,
        size,
        quantity: 1,
      })).unwrap();

      toast.success('Added to cart!');
      setShowSizes(false);
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = useCallback(async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please sign in to add items to your wishlist');
      navigate('/login');
      return;
    }
    try {
      const bp = backendProd || await findBackendProduct(title);
      if (!bp) { toast.error('Product not available'); return; }
      if (!backendProd) setBackendProd(bp);
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
  }, [token, title, backendProd, dispatch, navigate]);

  const handleQuickAddAccessory = useCallback(async () => {
    if (!token) {
      toast.error('Please sign in to add items to your cart');
      navigate('/login');
      return;
    }

    setAdding(true);
    try {
      const bp = backendProd || await findBackendProduct(title);
      if (!bp) {
        toast.error('This product is not available in our inventory');
        setAdding(false);
        return;
      }
      if (!backendProd) setBackendProd(bp);

      const map = getVariantMap(bp, color);
      const variantSize = Object.keys(map).find((s) => map[s] > 0) || 'Standard';

      await dispatch(addToCart({
        product: bp._id,
        color,
        size: variantSize,
        quantity: 1,
      })).unwrap();

      toast.success('Added to cart!');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  }, [token, title, color, backendProd, dispatch, navigate]);

  const handleQuickAddClick = () => {
    if (isOutOfStock) return;
    if (productType === 'accessory') {
      handleQuickAddAccessory();
      return;
    }
    setShowSizes((prev) => !prev);
    if (!sizeStock && !adding) {
      loadSizeStock();
    }
  };

  return (
    <article
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-media">
        <div className="product-badges">
          {hasDiscount && (
            <span className="badge badge-sale">
              -{discountPercentage}% Off
            </span>
          )}
          {isOutOfStock ? (
            <span className="badge badge-out">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="badge badge-low">
              Only {stock} Left
            </span>
          ) : null}
        </div>

        <button className="wishlist-btn" type="button" aria-label="Add to wishlist" onClick={handleWishlist}>
          <Heart size={15} strokeWidth={1.8} />
        </button>

        <Link to={`/product/${id}`} className="product-media-link">
          <img
            src={isHovered ? secondaryImage : primaryImage}
            alt={title}
            className="product-image"
            loading="lazy"
          />
        </Link>

        <div className="quick-add-wrap" ref={sizeRef}>
          <button
            disabled={isOutOfStock || adding}
            className={`quick-add-btn ${isOutOfStock ? 'quick-add-btn-disabled' : ''}`}
            type="button"
            onClick={handleQuickAddClick}
          >
            {adding ? (
              <Loader size={13} className="spin" />
            ) : (
              <ShoppingBag size={13} />
            )}
            <span>{isOutOfStock ? 'Sold Out' : adding ? 'Adding...' : 'Quick Add'}</span>
          </button>
          {showSizes && !isOutOfStock && (
            <div className="quick-add-sizes">
              {sizes.map((s) => {
                const sv = sizeStock ? (sizeStock[s] ?? -1) : null;
                const unavailable = sv === 0;
                return (
                  <button
                    key={s}
                    type="button"
                    className={`quick-add-size-btn${unavailable ? ' quick-add-size-unavail' : ''}`}
                    onClick={() => handleSizeSelect(s)}
                    disabled={adding}
                    title={unavailable ? 'Save to Wishlist' : 'Add to Cart'}
                  >
                    {s}
                  </button>
                );
              })}
              <button
                type="button"
                className="quick-add-wishlist-btn"
                onClick={handleWishlist}
              >
                <Heart size={11} /> Save
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="product-body">
        <div className="product-meta">
          <span>
            {fabric} • {category}
          </span>
        </div>

        <Link to={`/product/${id}`} className="product-title-link">
          <h3 className="product-title">{title}</h3>
        </Link>

        <div className="product-price-row">
          <span className="price-now">
            Rs.{price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="price-old">
              Rs.{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}