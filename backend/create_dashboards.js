const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../frontend/src');
const pagesDir = path.join(srcDir, 'pages');
const componentsDir = path.join(srcDir, 'components');

const files = {
  [path.join(componentsDir, 'Sidebar.jsx')]: `import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar({ role }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navLinks = role === 'supplier' ? [
    { name: 'Dashboard', path: '/supplier' },
    { name: 'Inventory', path: '/supplier/inventory' },
    { name: 'Orders', path: '/supplier/orders' }
  ] : [
    { name: 'Browse Inventory', path: '/retailer' },
    { name: 'My Orders', path: '/retailer/orders' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <span style={{ fontSize: '1.25rem' }}>📦</span> StockBridge
      </div>
      
      <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
        <p className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
          {role} portal
        </p>
      </div>

      <nav style={{ flex: 1 }}>
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path || 
                           (link.path !== '/supplier' && link.path !== '/retailer' && location.pathname.startsWith(link.path));
          return (
            <Link 
              key={link.name} 
              to={link.path} 
              className={\`nav-link \${isActive ? 'active' : ''}\`}
            >
              <span className="nav-link-text">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <button onClick={handleLogout} className="btn btn-secondary text-muted" style={{ width: '100%', justifyContent: 'flex-start', padding: '0.875rem 1.5rem', border: 'none', background: 'transparent' }}>
          Log out
        </button>
      </div>
    </div>
  );
}`,

  [path.join(pagesDir, 'SupplierDashboard.jsx')]: `import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

function InventoryView({ products, loadProducts }) {
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ product_name: '', price: '', stock_quantity: '' });
  const [notification, setNotification] = useState('');
  const [search, setSearch] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/products', formData, {
        headers: { Authorization: \`Bearer \${localStorage.getItem('token')}\` }
      });
      setShowAdd(false);
      setFormData({ product_name: '', price: '', stock_quantity: '' });
      setNotification('Product added successfully!');
      setTimeout(() => setNotification(''), 3000);
      loadProducts();
    } catch (err) {
      console.error(err);
      alert('Error adding product');
    }
  };

  const myProducts = products.filter(p => p.supplier_id == localStorage.getItem('user_id'));
  const filteredProducts = myProducts.filter(p => p.product_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      {notification && <div className="notification">{notification}</div>}
      <div className="dashboard-header">
        <h2>My Inventory</h2>
        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showAdd && (
        <div className="card animate-fade-in" style={{ marginBottom: '2rem' }}>
          <h3 className="mb-4">Add New Product</h3>
          <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Product Name</label>
              <input type="text" className="form-control" required value={formData.product_name} onChange={e => setFormData({...formData, product_name: e.target.value})} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Price (₹)</label>
              <input type="number" className="form-control" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Stock Quantity</label>
              <input type="number" className="form-control" required value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
          </form>
        </div>
      )}

      <div className="card">
        <div className="search-bar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Stock Availability</th>
                <th>Stock Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr><td colSpan="4" className="text-center text-muted" style={{ padding: '2rem' }}>No products found</td></tr>
              ) : filteredProducts.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 500 }}>{p.product_name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.stock_quantity} units</td>
                  <td>
                    {p.stock_quantity < 10 ? (
                      <span className="badge badge-danger">
                        <span className="indicator indicator-danger"></span> Low Stock
                      </span>
                    ) : (
                      <span className="badge badge-success">
                        <span className="indicator indicator-success"></span> Available
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OrdersView() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: \`Bearer \${localStorage.getItem('token')}\` }
      });
      setOrders(res.data);
    } catch (err) { }
  };

  const handleStatus = async (id, status) => {
    try {
      await axios.put(\`http://localhost:5000/api/orders/\${id}/status\`, { status }, {
        headers: { Authorization: \`Bearer \${localStorage.getItem('token')}\` }
      });
      loadOrders();
    } catch (err) {
      alert(err.response?.data?.msg || 'Error updating order status');
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <h2>Incoming Order Requests</h2>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Retailer</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="5" className="text-center text-muted" style={{ padding: '2rem' }}>No new orders</td></tr>
              ) : orders.map(o => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 500 }}>{o.retailer_name}</td>
                  <td>{o.product_name}</td>
                  <td>{o.quantity}</td>
                  <td>
                    <span className={\`badge \${o.status === 'approved' ? 'badge-success' : o.status === 'rejected' ? 'badge-danger' : 'badge-warning'}\`} style={{ textTransform: 'capitalize' }}>
                      {o.status}
                    </span>
                  </td>
                  <td>
                    {o.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-primary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.85rem', width: 'auto' }} onClick={() => handleStatus(o.id, 'approved')}>Approve</button>
                        <button className="btn btn-danger" style={{ padding: '0.375rem 0.75rem', fontSize: '0.85rem', width: 'auto' }} onClick={() => handleStatus(o.id, 'rejected')}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function SupplierDashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: \`Bearer \${localStorage.getItem('token')}\` }
      });
      setProducts(res.data);
    } catch (err) { }
  };

  const myProducts = products.filter(p => p.supplier_id == localStorage.getItem('user_id'));
  const totalStock = myProducts.reduce((sum, p) => sum + p.stock_quantity, 0);
  const lowStockCount = myProducts.filter(p => p.stock_quantity < 10).length;

  return (
    <div className="app-container">
      <Sidebar role="supplier" />
      <div className="main-content">
        <Routes>
          <Route path="/" element={
            <div className="animate-fade-in">
              <div className="dashboard-header mb-4">
                <h2>Overview</h2>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-title">Total Products</span>
                  <span className="stat-value">{myProducts.length}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-title">Total Stock Units</span>
                  <span className="stat-value">{totalStock}</span>
                </div>
                <div className="stat-card" style={{ borderColor: lowStockCount > 0 ? 'var(--danger)' : 'var(--border)' }}>
                  <span className="stat-title">Low Stock Alerts</span>
                  <span className="stat-value" style={{ color: lowStockCount > 0 ? 'var(--danger)' : 'var(--text-main)' }}>{lowStockCount}</span>
                </div>
              </div>
            </div>
          } />
          <Route path="inventory" element={<InventoryView products={products} loadProducts={loadProducts} />} />
          <Route path="orders" element={<OrdersView />} />
        </Routes>
      </div>
    </div>
  );
}`,

  [path.join(pagesDir, 'RetailerDashboard.jsx')]: `import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
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
      await axios.post('http://localhost:5000/api/orders', {
        product_id: orderMode.id,
        supplier_id: orderMode.supplier_id,
        quantity: parseInt(quantity)
      }, {
        headers: { Authorization: \`Bearer \${localStorage.getItem('token')}\` }
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

      <div className="card">
        <div className="search-bar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search by product or supplier name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Supplier (Distributor)</th>
                <th>Price</th>
                <th>Stock Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr><td colSpan="5" className="text-center text-muted" style={{ padding: '2rem' }}>No products available</td></tr>
              ) : filteredProducts.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 500 }}>{p.product_name}</td>
                  <td>{p.supplier_name}</td>
                  <td>₹{p.price}</td>
                  <td>
                    {p.stock_quantity > 0 ? (
                      <span className="badge badge-success">
                        <span className="indicator indicator-success"></span> {p.stock_quantity} available
                      </span>
                    ) : (
                      <span className="badge badge-danger">
                        <span className="indicator indicator-danger"></span> Out of Stock
                      </span>
                    )}
                  </td>
                  <td>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '0.375rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
                      disabled={p.stock_quantity <= 0}
                      onClick={() => handleOrderDialog(p)}
                    >
                      Request Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {orderMode && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card animate-fade-in" style={{ width: '400px', margin: 0 }}>
            <h3 className="mb-4">Order Request: {orderMode.product_name}</h3>
            <p className="text-muted mb-4">Supplier: {orderMode.supplier_name}</p>
            <div className="form-group">
              <label className="form-label">Quantity required</label>
              <input type="number" className="form-control" value={quantity} onChange={e => setQuantity(e.target.value)} min="1" max={orderMode.stock_quantity} />
              <small className="text-muted" style={{ display: 'block', marginTop: '0.5rem' }}>Max available: {orderMode.stock_quantity}</small>
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

function OrdersView() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: \`Bearer \${localStorage.getItem('token')}\` }
      });
      setOrders(res.data);
    } catch (err) { }
  };

  return (
    <div>
      <div className="dashboard-header">
        <h2>My Order Requests</h2>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Supplier</th>
                <th>Qty</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="4" className="text-center text-muted" style={{ padding: '2rem' }}>No orders placed yet</td></tr>
              ) : orders.map(o => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 500 }}>{o.product_name}</td>
                  <td>{o.supplier_name}</td>
                  <td>{o.quantity}</td>
                  <td>
                    <span className={\`badge \${o.status === 'approved' ? 'badge-success' : o.status === 'rejected' ? 'badge-danger' : 'badge-warning'}\`} style={{ textTransform: 'capitalize' }}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function RetailerDashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: \`Bearer \${localStorage.getItem('token')}\` }
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
          <Route path="orders" element={<OrdersView />} />
        </Routes>
      </div>
    </div>
  );
}`
};

for (const [filePath, content] of Object.entries(files)) {
  fs.writeFileSync(filePath, content);
  console.log('Created:', filePath);
}
