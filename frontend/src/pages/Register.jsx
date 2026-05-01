import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

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
      const res = await axios.post('/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('user_id', res.data.user_id);
      
      res.data.role === 'supplier' ? navigate('/supplier') : navigate('/retailer');
    } catch (err) {
      console.error('Registration Error:', err);
      const msg = err.response?.data?.msg || err.message || 'Error registering';
      setError(err.response ? `Server Error (${err.response.status}): ${msg}` : `Network Error: ${msg}. Is the backend running?`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-fade-in" style={{ maxWidth: '480px' }}>
        
        <div className="auth-header">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div className="auth-logo-box">📦</div>
          </Link>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join the modern B2B inventory network</p>
        </div>
        
        {error && (
          <div className="badge badge-danger mb-4" style={{ display: 'block', textAlign: 'center', padding: '0.8rem', borderRadius: '12px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label className="auth-label">Business Role</label>
            <select 
              name="role" 
              className="auth-input" 
              style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2rem', backgroundActive: '#fff' }}
              value={formData.role} 
              onChange={handleChange}
            >
              <option value="retailer">Retailer (Shopkeeper)</option>
              <option value="supplier">Supplier (Distributor)</option>
            </select>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="auth-input-group">
              <label className="auth-label">Full Name</label>
              <input 
                type="text" 
                name="name" 
                className="auth-input" 
                required 
                placeholder="John Doe"
                value={formData.name} 
                onChange={handleChange} 
              />
            </div>
            <div className="auth-input-group">
              <label className="auth-label">Business Name</label>
              <input 
                type="text" 
                name="business_name" 
                className="auth-input" 
                required 
                placeholder="Acme Corp"
                value={formData.business_name} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Email Address</label>
            <input 
              type="email" 
              name="email" 
              className="auth-input" 
              required 
              placeholder="name@company.com"
              value={formData.email} 
              onChange={handleChange} 
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Phone Number</label>
            <input 
              type="text" 
              name="phone" 
              className="auth-input" 
              placeholder="+91 9876543210"
              value={formData.phone} 
              onChange={handleChange} 
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Password</label>
            <input 
              type="password" 
              name="password" 
              className="auth-input" 
              required 
              placeholder="••••••••"
              value={formData.password} 
              onChange={handleChange} 
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Get Started Now'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in here</Link>
        </div>

        <div style={{ 
          marginTop: '2rem', textAlign: 'center', display: 'flex', 
          alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          color: '#94a3b8', fontSize: '0.75rem' 
        }}>
          <span style={{ fontSize: '1rem' }}>🛡️</span> Secure 256-bit SSL Encryption
        </div>
      </div>
    </div>
  );
}