import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Package, Loader, ArrowLeft, ChevronRight } from 'lucide-react';
import { orderService } from '../services/orderService';
import OrderCard from '../components/orders/OrderCard';
import './my-orders.css';

export default function MyOrders() {
  const navigate = useNavigate();
  const { token } = useSelector((s) => s.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const { data } = await orderService.getMyOrders();
        if (!cancelled) setOrders(data.data || []);
      } catch {
        if (!cancelled) setOrders([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [token, navigate]);

  if (!token) return null;

  return (
    <div className="mo-page">
      <div className="mo-container">
        <button type="button" className="mo-back" onClick={() => navigate('/')}>
          <ArrowLeft size={14} /> Back to Home
        </button>

        <div className="mo-header">
          <h1 className="mo-title">My Orders</h1>
          <p className="mo-subtitle">
            {loading
              ? 'Loading your orders...'
              : orders.length === 0
                ? 'You haven\'t placed any orders yet.'
                : `${orders.length} ${orders.length === 1 ? 'order' : 'orders'} placed`}
          </p>
        </div>

        {loading ? (
          <div className="mo-loading">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="mo-skeleton" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="mo-empty">
            <Package size={48} strokeWidth={1} />
            <h3>No orders yet</h3>
            <p>Start shopping and your orders will appear here.</p>
            <button
              type="button"
              className="mo-empty-btn"
              onClick={() => navigate('/category/new-arrivals')}
            >
              Start Shopping <ChevronRight size={14} />
            </button>
          </div>
        ) : (
          <div className="mo-list">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
