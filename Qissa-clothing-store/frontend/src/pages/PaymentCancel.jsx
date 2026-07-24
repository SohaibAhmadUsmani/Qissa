import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, ShoppingBag, ChevronRight } from 'lucide-react';
import './payment-cancel.css';

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="pc-page">
      <div className="pc-card">
        <div className="pc-icon-wrap">
          <XCircle size={48} strokeWidth={1.2} />
        </div>
        <h1 className="pc-title">Payment Cancelled</h1>
        <p className="pc-subtitle">Your payment was cancelled.</p>
        <p className="pc-desc">Your cart has not been removed. You can try again anytime.</p>

        <div className="pc-actions">
          <button
            type="button"
            className="pc-btn pc-btn-primary"
            onClick={() => navigate('/cart')}
          >
            <ArrowLeft size={14} /> Return to Cart
          </button>
          <button
            type="button"
            className="pc-btn pc-btn-outline"
            onClick={() => navigate('/category/new-arrivals')}
          >
            <ShoppingBag size={14} /> Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
