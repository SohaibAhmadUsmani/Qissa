import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, removeFromWishlist, clearWishlist } from '../features/wishlist/wishlistSlice';
import { catalogProducts } from '../data/catalog';
import ProductCard from '../components/ui/ProductCard';
import { Heart, Trash2, ArrowLeft, Loader, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import './cart.css';

const FALLBACK_IMAGE = '/assets/images/clothes/printed-lawn-3pc/IMG1.webp';

export default function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((s) => s.wishlist);
  const { token } = useSelector((s) => s.auth);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    dispatch(fetchWishlist());
  }, [dispatch, token, navigate]);

  const catalogMap = useMemo(() => {
    const map = {};
    catalogProducts.forEach((p) => {
      const key = p.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      map[key] = p;
    });
    return map;
  }, []);

  const displayProducts = useMemo(() => {
    return items
      .map((bp) => {
        const name = (bp.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const cat = catalogMap[name];
        if (cat) return cat;
        return {
          id: bp._id,
          title: bp.name || 'Product',
          price: bp.discountPrice || bp.price || 0,
          originalPrice: bp.price || 0,
          images: bp.images?.length
            ? bp.images.map((i) => i.url || i).filter(Boolean)
            : [FALLBACK_IMAGE],
          stock: bp.stock ?? 5,
          fabric: bp.fabric || '',
          color: '',
          categoryKey: '',
        };
      })
      .filter(Boolean);
  }, [items, catalogMap]);

  const handleRemove = async (productId) => {
    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
      toast.success('Removed from Wishlist');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to remove');
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Clear your entire wishlist?')) return;
    try {
      await dispatch(clearWishlist()).unwrap();
      toast.success('Wishlist cleared');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to clear');
    }
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-loading"><Loader size={20} className="spin" /> Loading your wishlist...</div>
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
            <p className="cart-kicker">Your Collection</p>
            <h1 className="cart-title">Wishlist</h1>
          </div>
          {!isEmpty && (
            <button type="button" className="cart-clear-btn" onClick={handleClear}>
              <Trash2 size={14} /> Clear Wishlist
            </button>
          )}
        </div>

        {isEmpty ? (
          <div className="cart-empty">
            <Heart size={40} strokeWidth={1} />
            <h3>Your wishlist is empty</h3>
            <p>Save your favourite pieces and check back later.</p>
            <Link to="/category/new-arrivals" className="cart-shop-link"><ChevronLeft size={14} /> Discover Styles</Link>
          </div>
        ) : (
          <div className="product-grid" style={{ marginTop: '2rem' }}>
            {displayProducts.map((product, idx) => (
              <div key={product.id || idx} style={{ position: 'relative' }}>
                <ProductCard product={product} />
                <button
                  type="button"
                  onClick={() => handleRemove(items[idx]._id)}
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    zIndex: 3,
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '999px',
                    border: '1px solid var(--color-line)',
                    background: 'rgba(255,255,255,0.92)',
                    color: 'var(--color-muted)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-muted)'}
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
