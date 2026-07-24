import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, ArrowLeft, Package, ChevronRight } from 'lucide-react';
import { paymentService } from '../services/paymentService';
import './payment-success.css';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided.');
      setLoading(false);
      return;
    }

    let cancelled = false;

    const verify = async () => {
      try {
        const { data: res } = await paymentService.verifyPayment(sessionId);
        if (cancelled) return;
        setData(res.data);
      } catch (err) {
        if (cancelled) return;
        setError(err.response?.data?.message || 'Payment could not be verified.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    verify();

    return () => { cancelled = true; };
  }, [sessionId]);

  const formatCurrency = (amount, currency) => {
    const fmt = new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: currency?.toUpperCase() || 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return fmt.format(amount / 100);
  };

  if (loading) {
    return (
      <div className="ps-page">
        <div className="ps-loading">
          <Loader size={28} className="spin" />
          <p>Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ps-page">
        <div className="ps-card ps-error">
          <div className="ps-icon-wrap ps-icon-error">
            <XCircle size={48} strokeWidth={1.2} />
          </div>
          <h1 className="ps-title">Payment could not be verified</h1>
          <p className="ps-message">{error}</p>
          <div className="ps-actions">
            <button
              type="button"
              className="ps-btn ps-btn-primary"
              onClick={() => window.location.reload()}
            >
              <Loader size={14} /> Retry Verification
            </button>
            <Link to="/" className="ps-btn ps-btn-outline">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ps-page">
      <div className="ps-card">
        <div className="ps-icon-wrap ps-icon-success">
          <CheckCircle size={52} strokeWidth={1.2} />
        </div>
        <h1 className="ps-title">Payment Successful</h1>
        <p className="ps-subtitle">Thank you for your purchase!</p>
        <p className="ps-desc">Your order has been confirmed and is being processed.</p>

        <div className="ps-details-card">
          <div className="ps-detail-row">
            <span className="ps-detail-label">Payment Status</span>
            <span className="ps-detail-value ps-status-paid">Paid</span>
          </div>
          {data.amountTotal && (
            <div className="ps-detail-row">
              <span className="ps-detail-label">Amount Paid</span>
              <span className="ps-detail-value">
                {formatCurrency(data.amountTotal, data.currency)}
              </span>
            </div>
          )}
          {data.currency && (
            <div className="ps-detail-row">
              <span className="ps-detail-label">Currency</span>
              <span className="ps-detail-value">{data.currency.toUpperCase()}</span>
            </div>
          )}
          {data.customerEmail && (
            <div className="ps-detail-row">
              <span className="ps-detail-label">Email</span>
              <span className="ps-detail-value">{data.customerEmail}</span>
            </div>
          )}
          {data.sessionId && (
            <div className="ps-detail-row ps-detail-id">
              <span className="ps-detail-label">Session ID</span>
              <span className="ps-detail-value">{data.sessionId}</span>
            </div>
          )}
        </div>

        <div className="ps-actions">
          <button
            type="button"
            className="ps-btn ps-btn-primary"
            onClick={() => navigate('/category/new-arrivals')}
          >
            Continue Shopping <ChevronRight size={14} />
          </button>
          <button
            type="button"
            className="ps-btn ps-btn-outline"
            onClick={() => navigate('/orders')}
          >
            <Package size={14} /> View My Orders
          </button>
        </div>
      </div>
    </div>
  );
}
