import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import InvoiceModal from '../components/InvoiceModal';
import ProfileView from '../components/ProfileView';
import AiInsights from '../components/AiInsights';
import axios from 'axios';

function InventoryView({ products, loadProducts }) {
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ product_name: '', price: '', stock_quantity: '', unit: 'unit' });
  const [imageFile, setImageFile] = useState(null);
  const [notification, setNotification] = useState('');
  const [search, setSearch] = useState('');
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({ product_name: '', price: '', stock_quantity: '', unit: 'unit' });

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('product_name', formData.product_name);
      data.append('price', formData.price);
      data.append('stock_quantity', formData.stock_quantity);
      data.append('unit', formData.unit);
      if (imageFile) {
        data.append('image', imageFile);
      }

      await axios.post('/api/products', data, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setShowAdd(false);
      setFormData({ product_name: '', price: '', stock_quantity: '', unit: 'unit' });
      setImageFile(null);
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

  const handleEditClick = (p) => {
    setEditingProduct(p.id);
    setEditFormData({
      product_name: p.product_name,
      price: p.price,
      stock_quantity: p.stock_quantity,
      unit: p.unit
    });
    setShowAdd(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/products/${editingProduct}`, editFormData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEditingProduct(null);
      setNotification('Product updated successfully!');
      setTimeout(() => setNotification(''), 3000);
      loadProducts();
    } catch (err) {
      alert('Error updating product');
    }
  };

  return (
    <div>
      {notification && <div className="notification">{notification}</div>}
      <div className="dashboard-header">
        <h2>My Inventory</h2>
        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => { setShowAdd(!showAdd); setEditingProduct(null); }}>
          {showAdd ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showAdd && (
        <div className="card animate-fade-in" style={{ marginBottom: '2rem' }}>
          <h3 className="mb-4">Add New Product</h3>
          <form onSubmit={handleAdd} className="responsive-form-grid">
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
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Unit of Measure</label>
              <select className="form-control" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>
                <option value="unit">Unit (Pieces)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="grams">Grams (g)</option>
                <option value="liter">Liters (L)</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="box">Boxes</option>
                <option value="pack">Packs</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Product Image</label>
              <input type="file" className="form-control" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ padding: '0.45rem' }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2' }}>Save Product</button>
          </form>
        </div>
      )}

      {editingProduct && (
        <div className="card animate-fade-in" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>Edit Product</h3>
            <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', width: 'auto' }} onClick={() => setEditingProduct(null)}>Cancel</button>
          </div>
          <form onSubmit={handleUpdate} className="responsive-form-grid">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Product Name</label>
              <input type="text" className="form-control" required value={editFormData.product_name} onChange={e => setEditFormData({...editFormData, product_name: e.target.value})} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Price (₹)</label>
              <input type="number" className="form-control" required value={editFormData.price} onChange={e => setEditFormData({...editFormData, price: e.target.value})} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Stock Quantity</label>
              <input type="number" className="form-control" required value={editFormData.stock_quantity} onChange={e => setEditFormData({...editFormData, stock_quantity: e.target.value})} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Unit of Measure</label>
              <select className="form-control" value={editFormData.unit} onChange={e => setEditFormData({...editFormData, unit: e.target.value})}>
                <option value="unit">Unit (Pieces)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="grams">Grams (g)</option>
                <option value="liter">Liters (L)</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="box">Boxes</option>
                <option value="pack">Packs</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2' }}>Update Product</button>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr><td colSpan="5" className="text-center text-muted" style={{ padding: '2rem' }}>No products found</td></tr>
              ) : filteredProducts.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 500 }}>{p.product_name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.stock_quantity} {p.unit}s</td>
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
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', width: 'auto' }} onClick={() => handleEditClick(p)}>
                      Edit
                    </button>
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

function OrdersView({ onViewInvoice }) {
  const [orders, setOrders] = useState([]);

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

  const handleStatus = async (id, status) => {
    try {
      await axios.put(`/api/orders/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
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
                  <td>{o.quantity} {o.unit}s</td>
                  <td>
                    <span className={`badge ${o.status === 'approved' ? 'badge-success' : o.status === 'paid' ? 'badge-success' : o.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`} style={{ textTransform: 'capitalize' }}>
                      {o.status === 'paid' ? '✅ Paid' : o.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {o.status === 'pending' && (
                        <>
                          <button className="btn btn-primary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.85rem', width: 'auto' }} onClick={() => handleStatus(o.id, 'approved')}>Approve</button>
                          <button className="btn btn-danger" style={{ padding: '0.375rem 0.75rem', fontSize: '0.85rem', width: 'auto' }} onClick={() => handleStatus(o.id, 'rejected')}>Reject</button>
                        </>
                      )}
                      {o.status === 'paid' && (
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '0.375rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
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
      </div>
    </div>
  );
}

function SalesAnalyticsView() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await axios.get('/api/orders/supplier-stats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <div className="text-center p-5">Loading analytics...</div>;
  if (!stats) return <div className="text-center p-5">Error loading data</div>;

  const productEntries = Object.entries(stats.productPerformance || {}).sort((a, b) => b[1].revenue - a[1].revenue);
  const maxRevenue = productEntries.length ? productEntries[0][1].revenue : 1;

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header mb-4">
        <h2>Sales Analytics</h2>
      </div>

      <div className="stats-grid mb-4">
        <div className="stat-card">
          <span className="stat-title">Total Revenue</span>
          <span className="stat-value">₹{stats.totalRevenue.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">Total Units Sold</span>
          <span className="stat-value">{stats.totalUnitsSold}</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">Total Orders</span>
          <span className="stat-value">{stats.orderCount}</span>
        </div>
      </div>

      <div className="card mb-4">
        <h3 className="mb-4">Product Performance</h3>
        {productEntries.length === 0 ? (
          <p className="text-muted text-center py-4">No sales data available yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {productEntries.map(([name, data]) => (
              <div key={name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>{name}</span>
                  <span style={{ fontWeight: 'bold' }}>
                    ₹{data.revenue.toLocaleString()} 
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal', marginLeft: '0.5rem' }}>
                      ({data.units} units)
                    </span>
                  </span>
                </div>
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${(data.revenue / maxRevenue) * 100}%`, 
                    background: 'linear-gradient(90deg, #6366f1, #0ea5e9)',
                    borderRadius: '4px',
                    transition: 'width 0.8s ease-out'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="mb-4">Recent Sales Record</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentSales.length === 0 ? (
                <tr><td colSpan="5" className="text-center text-muted py-4">No sales recorded yet</td></tr>
              ) : stats.recentSales.map(o => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td style={{ fontWeight: 500 }}>{o.product_name}</td>
                  <td>{o.quantity} units</td>
                  <td>₹{(o.quantity * o.price).toLocaleString()}</td>
                  <td className="text-muted" style={{ fontSize: '0.85rem' }}>{new Date(o.created_at).toLocaleDateString()}</td>
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
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadProducts();
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await axios.get('/api/orders/supplier-stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStats(res.data);
    } catch (err) { }
  };

  const loadProducts = async () => {
    try {
      const res = await axios.get('/api/products', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
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
                  <span className="stat-title">Units Sold</span>
                  <span className="stat-value">{stats?.totalUnitsSold || 0}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-title">Total Revenue</span>
                  <span className="stat-value">₹{stats?.totalRevenue?.toLocaleString() || '0'}</span>
                </div>
                <div className="stat-card" style={{ borderColor: lowStockCount > 0 ? 'var(--danger)' : 'var(--border)' }}>
                  <span className="stat-title">Low Stock Alerts</span>
                  <span className="stat-value" style={{ color: lowStockCount > 0 ? 'var(--danger)' : 'var(--text-main)' }}>{lowStockCount}</span>
                </div>
              </div>
              <div style={{ marginTop: '2rem' }}>
                <AiInsights />
              </div>
            </div>
          } />
          <Route path="inventory" element={<InventoryView products={products} loadProducts={loadProducts} />} />
          <Route path="orders" element={<OrdersView onViewInvoice={setSelectedInvoice} />} />
          <Route path="analytics" element={<SalesAnalyticsView />} />
          <Route path="profile" element={<ProfileView />} />
        </Routes>
      </div>
      {selectedInvoice && <InvoiceModal order={selectedInvoice} onClose={() => setSelectedInvoice(null)} />}
    </div>
  );
}