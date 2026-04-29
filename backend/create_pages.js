const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../frontend/src');
const pagesDir = path.join(srcDir, 'pages');
const componentsDir = path.join(srcDir, 'components');

try { fs.mkdirSync } catch(e) {}(pagesDir, { recursive: true });
try { fs.mkdirSync } catch(e) {}(componentsDir, { recursive: true });

const files = {
  [path.join(pagesDir, 'Landing.jsx')]: `import { Link } from 'react-router-dom';
export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', background: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <h1 style={{ color: 'var(--primary)', margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>StockBridge</h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" className="btn btn-secondary" style={{ width: 'auto' }}>Log In</Link>
            <Link to="/register" className="btn btn-primary" style={{ width: 'auto' }}>Get Started</Link>
          </div>
        </div>
      </header>
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', background: 'linear-gradient(135deg, white 0%, var(--primary-light) 200%)' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.5rem', maxWidth: '800px' }}>
          Real-time Inventory Visibility for B2B Retail
        </h2>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px' }}>
          Stop calling suppliers for stock checks. StockBridge connects distributors and shopkeepers for instant inventory access and seamless order requests.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem' }} className="animate-fade-in">
          <Link to="/register?role=supplier" className="btn btn-primary" style={{ width: 'auto', padding: '1rem 2rem', fontSize: '1.1rem' }}>I am a Supplier</Link>
          <Link to="/register?role=retailer" className="btn btn-secondary" style={{ width: 'auto', padding: '1rem 2rem', fontSize: '1.1rem' }}>I am a Retailer</Link>
        </div>
      </main>
    </div>
  );
}`,

  [path.join(pagesDir, 'Login.jsx')]: `import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('user_id', res.data.user_id);
      
      res.data.role === 'supplier' ? navigate('/supplier') : navigate('/retailer');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error logging in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card animate-fade-in">
        <h2 className="text-center mb-1">Welcome Back</h2>
        <p className="text-center text-muted mb-4">Login to your StockBridge account</p>
        
        {error && <div className="badge badge-danger mb-4" style={{ display: 'block', textAlign: 'center', padding: '0.75rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-control" required value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control" required value={formData.password} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-muted" style={{ marginTop: '2rem' }}>
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}`,

  [path.join(pagesDir, 'Register.jsx')]: `import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'supplier' ? 'supplier' : 'retailer';
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', role: defaultRole, business_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('user_id', res.data.user_id);
      
      res.data.role === 'supplier' ? navigate('/supplier') : navigate('/retailer');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error registering');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card animate-fade-in" style={{ maxWidth: '450px' }}>
        <h2 className="text-center mb-1">Create Account</h2>
        <p className="text-center text-muted mb-4">Join StockBridge today</p>
        
        {error && <div className="badge badge-danger mb-4" style={{ display: 'block', textAlign: 'center', padding: '0.75rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select name="role" className="form-control" value={formData.role} onChange={handleChange}>
              <option value="retailer">Retailer (Shopkeeper)</option>
              <option value="supplier">Supplier (Distributor)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" className="form-control" required value={formData.name} onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label className="form-label">Business Name</label>
            <input type="text" name="business_name" className="form-control" required value={formData.business_name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-control" required value={formData.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control" required value={formData.password} onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-muted" style={{ marginTop: '2rem' }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}`
};

for (const [filePath, content] of Object.entries(files)) {
  fs.writeFileSync(filePath, content);
  console.log('Created:', filePath);
}
