import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar({ role }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navLinks = role === 'supplier' ? [
    { name: 'Dashboard', icon: '📊', path: '/supplier' },
    { name: 'Inventory', icon: '📦', path: '/supplier/inventory' },
    { name: 'Orders', icon: '🛒', path: '/supplier/orders' },
    { name: 'Analytics', icon: '📈', path: '/supplier/analytics' }
  ] : [
    { name: 'Browse', icon: '🔍', path: '/retailer' },
    { name: 'My Orders', icon: '🛍️', path: '/retailer/orders' },
    { name: 'Analytics', icon: '📈', path: '/retailer/analytics' }
  ];

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={closeSidebar}></div>
      
      <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '☰'}
      </button>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '1rem' }}>
          <Link to="/" className="sidebar-logo" style={{ textDecoration: 'none', marginBottom: 0 }}>
            <span style={{ fontSize: '1.25rem' }}>📦</span> StockBridge
          </Link>
          {isOpen && (
            <button className="mobile-close" onClick={closeSidebar} style={{ display: 'none', border: 'none', background: 'transparent', fontSize: '1.5rem', color: 'var(--text-muted)' }}>
              ✕
            </button>
          )}
        </div>
        
        <div style={{ padding: '0 1.5rem', marginBottom: '2rem', marginTop: '1rem' }}>
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
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span style={{ marginRight: '12px' }}>{link.icon}</span>
                <span className="nav-link-text">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-group">
            <p className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.5rem', paddingLeft: '1rem' }}>Settings</p>
            <Link to="profile" className={`sidebar-link ${location.pathname.includes('profile') ? 'active' : ''}`}>
              <span className="sidebar-icon">⚙️</span> Business Profile
            </Link>
          </div>

          <button className="sidebar-link" onClick={handleLogout} style={{ marginTop: 'auto', border: 'none', background: 'transparent', width: '100%', textAlign: 'left' }}>
            🚪 Log out
          </button>
        </div>
      </div>
    </>
  );
}