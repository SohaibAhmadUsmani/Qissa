import { useState } from 'react';
import { Heart, ShoppingBag, ExternalLink, ChevronDown, Star, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../features/cart/cartSlice';
import { addToWishlist } from '../../features/wishlist/wishlistSlice';
import MatchedRuleBadge from './MatchedRuleBadge';

export default function AICard({ product, isBest, index }) {
  const [expanded, setExpanded] = useState(false);
  const [adding, setAdding] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((s) => s.auth);

  const handleAddToCart = async () => {
    if (!token) {
      toast.error('Please sign in to add items to your cart');
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await dispatch(addToCart({
        product: product._id,
        color: product.firstAvailableColor || product.colors?.[0] || '',
        size: product.firstAvailableSize || 'Standard',
        quantity: 1,
      })).unwrap();
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async () => {
    if (!token) {
      toast.error('Please sign in to add items to your wishlist');
      navigate('/login');
      return;
    }
    try {
      await dispatch(addToWishlist(product._id)).unwrap();
      toast.success('Added to wishlist!');
    } catch (err) {
      const msg = typeof err === 'string' ? err : err?.message || '';
      if (msg.toLowerCase().includes('already')) {
        toast.error('Already in your wishlist');
      } else {
        toast.error(msg || 'Failed to add to wishlist');
      }
    }
  };

  return (
    <article className={`ai-card${isBest ? ' ai-card-best' : ''}`}>
      {isBest && (
        <div className="ai-card-best-badge">
          <Star size={14} strokeWidth={2} />
          Best Match
        </div>
      )}

      <div className="ai-card-inner">
        <div className="ai-card-media">
          <img
            src={product.image}
            alt={product.name}
            className="ai-card-img"
            loading={index > 0 ? 'lazy' : undefined}
          />
          <div className="ai-card-actions">
            <button
              className="ai-card-action-btn"
              onClick={handleWishlist}
              aria-label="Add to wishlist"
              type="button"
            >
              <Heart size={16} strokeWidth={1.8} />
            </button>
            <button
              className="ai-card-action-btn ai-card-action-cart"
              onClick={handleAddToCart}
              disabled={adding}
              aria-label="Add to cart"
              type="button"
            >
              <ShoppingBag size={16} strokeWidth={1.8} />
              <span>{adding ? 'Adding...' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>

        <div className="ai-card-body">
          <div className="ai-card-top">
            <span className="ai-card-category">{product.category}</span>
            {product.stock <= 3 && product.stock > 0 && (
              <span className="ai-card-stock ai-card-stock-low">
                <Package size={12} strokeWidth={2} />
                Only {product.stock} left
              </span>
            )}
            {product.stock === 0 && (
              <span className="ai-card-stock ai-card-stock-out">Out of Stock</span>
            )}
          </div>

          <h3 className="ai-card-name">{product.name}</h3>

          <div className="ai-card-price-row">
            <span className="ai-card-price">Rs. {product.discountedPrice?.toLocaleString()}</span>
            {product.discountPercentage > 0 && (
              <>
                <span className="ai-card-price-old">Rs. {product.price?.toLocaleString()}</span>
                <span className="ai-card-discount">-{product.discountPercentage}%</span>
              </>
            )}
          </div>

          {product.matchedRules?.length > 0 && (
            <div className="ai-card-rules">
              {product.matchedRules.map((rule, i) => (
                <MatchedRuleBadge key={i} rule={rule} />
              ))}
            </div>
          )}

          {product.reason && (
            <div className="ai-card-reason">
              <button
                className="ai-card-reason-toggle"
                onClick={() => setExpanded((e) => !e)}
                type="button"
                aria-expanded={expanded}
              >
                <span>Why We Picked This</span>
                <ChevronDown size={14} className={`ai-chevron${expanded ? ' open' : ''}`} strokeWidth={1.8} />
              </button>
              {expanded && (
                <p className="ai-card-reason-text">{product.reason}</p>
              )}
            </div>
          )}

          <div className="ai-card-footer">
            <Link to={`/product/${product._id}`} className="ai-card-view-link">
              <ExternalLink size={13} strokeWidth={1.8} />
              View Product
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
