import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import InvoiceModal from '../components/InvoiceModal';
import ProfileView from '../components/ProfileView';
import axios from 'axios';

function BrowseView({ products }) {
  const [search, setSearch] = useState('');
  const [orderMode, setOrderMode] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [notification, setNotification] = useState('');

  const handleOrderDialog = (product) => {
    setOrderMode(product);
    setQuantity('');
  };

  const submitOrder = async () => {
    if (!quantity || quantity <= 0) return alert('Enter a valid quantity');
    try {
      await axios.post('/api/orders', {
        product_id: orderMode.id,
        supplier_id: orderMode.supplier_id,
        quantity: parseInt(quantity)
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotification('Order request sent to supplier!');
      setTimeout(() => setNotification(''), 3000);
      setOrderMode(null);
    } catch (err) {
      alert(err.response?.data?.msg || 'Error placing order');
    }
  };

  const filteredProducts = products.filter(p => 
    p.product_name.toLowerCase().includes(search.toLowerCase()) || 
    p.supplier_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {notification && <div className="notification">{notification}</div>}
      <div className="dashboard-header">
        <h2>Browse Products</h2>
      </div>

      <div className="search-bar mb-4">
        <input 
          type="text" 
          className="search-input card" 
          placeholder="Search by product or supplier name..." 
          style={{ width: '100%', margin: 0 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="card text-center text-muted" style={{ padding: '3rem' }}>
          No products available right now.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {filteredProducts.map(p => (
            <div key={p.id} className="card animate-fade-in" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '220px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {p.image_url ? (
                  <img src={p.image_url} alt={p.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '4rem' }}>📦</span>
                )}
              </div>
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#1e293b' }}>{p.product_name}</h3>
                <p className="text-muted" style={{ margin: '0 0 1rem 0', fontSize: '0.85rem' }}>Sold by: {p.supplier_name}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', marginBottom: '1.25rem' }}>
                  <span style={{ fontWeight: '800', fontSize: '1.5rem', color: '#6366f1' }}>₹{p.price} <span style={{fontSize: '0.9rem', color: '#64748b', fontWeight: 'normal'}}>/ {p.unit}</span></span>
                  {p.stock_quantity > 0 ? (
                    <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>{p.stock_quantity} left</span>
                  ) : (
                    <span className="badge badge-danger" style={{ fontSize: '0.75rem' }}>Out of Stock</span>
                  )}
                </div>
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                  disabled={p.stock_quantity <= 0}
                  onClick={() => handleOrderDialog(p)}
                >
                  {p.stock_quantity > 0 ? 'Request Order' : 'Unavailable'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {orderMode && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1002, padding: '1rem' }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px', margin: 0 }}>
            <h3 className="mb-4">Order Request: {orderMode.product_name}</h3>
            <p className="text-muted mb-4">Supplier: {orderMode.supplier_name}</p>
            <div className="form-group">
              <label className="form-label">Quantity required (in {orderMode.unit}s)</label>
              <input type="number" className="form-control" value={quantity} onChange={e => setQuantity(e.target.value)} min="1" max={orderMode.stock_quantity} />
              <small className="text-muted" style={{ display: 'block', marginTop: '0.5rem' }}>Max available: {orderMode.stock_quantity} {orderMode.unit}s</small>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button className="btn btn-secondary" onClick={() => setOrderMode(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={submitOrder}>Send Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AnalyticsView() {
  const [orders, setOrders] = useState([]);
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOrders(res.data.filter(o => o.status === 'approved' || o.status === 'paid'));
    } catch (err) { }
  };

  const now = new Date();
  const filteredOrders = orders.filter(o => {
    const d = new Date(o.created_at.replace(' ', 'T') + 'Z'); 
    const diffDays = (now - d) / (1000 * 60 * 60 * 24);
    if (period === 'daily') return diffDays <= 1;
    if (period === 'weekly') return diffDays <= 7;
    return diffDays <= 30;
  });

  const totalSpent = filteredOrders.reduce((sum, o) => sum + (o.quantity * o.price), 0);
  const totalItems = filteredOrders.reduce((sum, o) => sum + o.quantity, 0);

  const productStats = {};
  filteredOrders.forEach(o => {
    if (!productStats[o.product_name]) productStats[o.product_name] = { qty: 0, spend: 0 };
    productStats[o.product_name].qty += o.quantity;
    productStats[o.product_name].spend += o.quantity * o.price;
  });

  const topProducts = Object.entries(productStats).sort((a,b) => b[1].spend - a[1].spend);
  const maxSpend = topProducts.length ? topProducts[0][1].spend : 1;

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Purchases Analytics</h2>
        
        <div style={{ display: 'flex', background: 'var(--card-bg)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          {['daily', 'weekly', 'monthly'].map(p => (
            <button 
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                background: period === p ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent',
                color: period === p ? '#fff' : 'var(--text-muted)',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                textTransform: 'capitalize',
                transition: 'all 0.2s'
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="stats-grid mb-4">
        <div className="stat-card">
          <span className="stat-title">Total Spent ({period})</span>
          <span className="stat-value">₹{totalSpent.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">Total Items Ordered</span>
          <span className="stat-value">{totalItems} units</span>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-4">Spending by Product Type</h3>
        
        {topProducts.length === 0 ? (
          <p className="text-muted text-center" style={{ padding: '2rem' }}>No purchase data for this period.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {topProducts.map(([name, stat]) => (
              <div key={name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{name}</span>
                  <span style={{ fontWeight: 'bold' }}>₹{stat.spend.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>({stat.qty} units)</span></span>
                </div>
                <div style={{ height: '10px', background: 'var(--border)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${(stat.spend / maxSpend) * 100}%`, 
                    background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                    borderRadius: '5px',
                    transition: 'width 0.5s ease-out'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OrdersView({ onViewInvoice }) {
  const [orders, setOrders] = useState([]);
  const [isGrouped, setIsGrouped] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOrders(res.data);
    } catch (err) { }
  };

  const handlePayment = async (order) => {
    try {
      const { data: { id, amount, currency, localOrderId } } = await axios.post('/api/payments/create-order', { orderId: order.id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const options = {
        key: "rzp_test_placeholder",
        amount: amount,
        currency: currency,
        name: "StockBridge",
        description: `Order Payment for ${order.product_name}`,
        order_id: id,
        handler: async function (response) {
          try {
            await axios.post('/api/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              localOrderId: localOrderId
            }, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('Payment Successful!');
            loadOrders();
          } catch (verifyErr) {
            alert(verifyErr.response?.data?.msg || 'Payment verification failed');
          }
        },
        theme: {
          color: "#6366f1"
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
        alert(response.error.description);
      });
      rzp1.open();

    } catch (err) {
      alert(err.response?.data?.msg || 'Error initiating payment');
    }
  };

  const groupOrdersBySupplier = () => {
    const grouped = {};
    orders.forEach(order => {
      if (!grouped[order.supplier_name]) {
        grouped[order.supplier_name] = [];
      }
      grouped[order.supplier_name].push(order);
    });
    return grouped;
  };

  const renderOrderTable = (orderList, showSupplierColumn = true) => (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Product</th>
            {showSupplierColumn && <th>Supplier (Shopkeeper)</th>}
            <th>Qty</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orderList.map(o => (
            <tr key={o.id}>
              <td style={{ fontWeight: 500 }}>{o.product_name}</td>
              {showSupplierColumn && <td>{o.supplier_name}</td>}
              <td>{o.quantity} {o.unit}s</td>
              <td>
                <span className={`badge ${o.status === 'approved' ? 'badge-success' : o.status === 'rejected' ? 'badge-danger' : o.status === 'paid' ? 'badge-success' : 'badge-warning'}`} style={{ textTransform: 'capitalize' }}>
                  {o.status}
                </span>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {o.status === 'approved' && (
                    <button 
                      className="btn btn-primary" 
                      style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', width: 'auto' }}
                      onClick={() => handlePayment(o)}
                    >
                      💳 Pay Now
                    </button>
                  )}
                  {o.status === 'paid' && (
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', width: 'auto' }}
                      onClick={() => onViewInvoice(o)}
                    >
                      📄 View Bill
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const groupedOrders = groupOrdersBySupplier();

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>My Order Requests</h2>
          <p className="text-muted">Manage your orders and group them by shopkeeper.</p>
        </div>
        
        <button 
          className={`btn ${isGrouped ? 'btn-primary' : 'btn-secondary'}`} 
          style={{ width: 'auto' }}
          onClick={() => setIsGrouped(!isGrouped)}
        >
          {isGrouped ? '📂 Show Flat List' : '🗂️ Group by Shopkeeper'}
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="card text-center text-muted" style={{ padding: '3rem' }}>
          No orders placed yet.
        </div>
      ) : isGrouped ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {Object.entries(groupedOrders).map(([supplier, list]) => (
            <div key={supplier}>
              <div className="section-title mb-3" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>🏪</span>
                <h3 style={{ margin: 0 }}>{supplier} <span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>(Shopkeeper)</span></h3>
                <span className="badge" style={{ marginLeft: 'auto' }}>{list.length} orders</span>
              </div>
              <div className="card" style={{ padding: 0 }}>
                {renderOrderTable(list, false)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          {renderOrderTable(orders, true)}
        </div>
      )}
    </div>
  );
}

export default function RetailerDashboard() {
  const [products, setProducts] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await axios.get('/api/products', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProducts(res.data);
    } catch (err) { }
  };

  return (
    <div className="app-container">
      <Sidebar role="retailer" />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<BrowseView products={products} />} />
          <Route path="orders" element={<OrdersView onViewInvoice={setSelectedInvoice} />} />
          <Route path="analytics" element={<AnalyticsView />} />
          <Route path="profile" element={<ProfileView />} />
        </Routes>
      </div>
      {selectedInvoice && <InvoiceModal order={selectedInvoice} onClose={() => setSelectedInvoice(null)} />}
    </div>
  );
}