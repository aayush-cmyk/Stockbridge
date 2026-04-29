import { Link } from 'react-router-dom';
import '../App.css';

export default function Features() {
  return (
    <div className="landing-page">
      {/* NAVBAR */}
      <nav className="landing-nav">
        <Link to="/" className="landing-logo">
          <span>📦</span> StockBridge
        </Link>
        <div className="landing-nav-links">
          <Link to="/features" style={{ fontWeight: 'bold' }}>Features</Link>
          <Link to="/how-it-works">How it works</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/login">Login</Link>
          <Link to="/register" className="register-btn">Register</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="landing-hero-container" style={{ padding: '4rem 5%', minHeight: 'auto' }}>
        <div className="landing-hero-content" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div className="hero-badge">Full Feature Set</div>
          <h1>Platform <span>Capabilities</span></h1>
          <p>Discover the tools designed to eliminate inventory blind spots and accelerate B2B transactions.</p>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="landing-features-detailed" style={{ background: '#f8fafc' }}>
        <div className="section-header">
          <h2>Core Technology</h2>
          <p className="text-muted">Built for reliability, speed, and security.</p>
        </div>
        
        <div className="feature-detailed-grid">
          <div className="glass-card feature-item">
            <div className="feature-icon">🛡️</div>
            <h3>OTP Security</h3>
            <p className="text-muted">Secure passwordless login with one-time passcodes. No more forgotten passwords or compromised accounts.</p>
          </div>
          <div className="glass-card feature-item">
            <div className="feature-icon">⚡</div>
            <h3>Real-Time Updates</h3>
            <p className="text-muted">Stock changes are reflected instantly across the network. Retailers always see what's actually in stock.</p>
          </div>
          <div className="glass-card feature-item">
            <div className="feature-icon">📊</div>
            <h3>Smart Dashboards</h3>
            <p className="text-muted">Intuitive interfaces for both suppliers and retailers to manage their specific workflows efficiently.</p>
          </div>
        </div>
      </section>

      {/* ROLE BASED FEATURES */}
      <section className="landing-features-detailed">
        <div className="feature-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '8rem' }}>
          <div>
            <div className="hero-badge" style={{ background: '#dcfce7', color: '#166534' }}>For Suppliers</div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Master Your Distribution</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <span style={{ color: 'var(--lp-primary)', fontWeight: 'bold' }}>✓</span>
                <div>
                  <strong>Bulk Inventory Management</strong>
                  <p className="text-muted">Upload and manage thousands of SKUs with ease.</p>
                </div>
              </li>
              <li style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <span style={{ color: 'var(--lp-primary)', fontWeight: 'bold' }}>✓</span>
                <div>
                  <strong>Order Request Pipeline</strong>
                  <p className="text-muted">View and manage incoming stock requests from all your retailers in one place.</p>
                </div>
              </li>
              <li style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <span style={{ color: 'var(--lp-primary)', fontWeight: 'bold' }}>✓</span>
                <div>
                  <strong>Storefront Visibility</strong>
                  <p className="text-muted">Control which products are visible to which retailers.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="glass-card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', background: 'linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 100%)' }}>
            🏢
          </div>
        </div>

        <div className="feature-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div className="glass-card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', order: 2 }}>
            🛒
          </div>
          <div style={{ order: 1 }}>
            <div className="hero-badge" style={{ background: '#fef9c3', color: '#854d0e' }}>For Retailers</div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Never Miss a Sale</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <span style={{ color: 'var(--lp-secondary)', fontWeight: 'bold' }}>✓</span>
                <div>
                  <strong>Supplier Discovery</strong>
                  <p className="text-muted">Find new products and reliable suppliers for your shop.</p>
                </div>
              </li>
              <li style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <span style={{ color: 'var(--lp-secondary)', fontWeight: 'bold' }}>✓</span>
                <div>
                  <strong>One-Tap Requests</strong>
                  <p className="text-muted">Request stock updates or place orders directly from the product view.</p>
                </div>
              </li>
              <li style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <span style={{ color: 'var(--lp-secondary)', fontWeight: 'bold' }}>✓</span>
                <div>
                  <strong>Real-time Notifications</strong>
                  <p className="text-muted">Get notified the moment your favorite supplier restocks a hot item.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="landing-cta-v2">
        <div className="cta-content">
          <h2>Ready to bridge the gap?</h2>
          <p>Join hundreds of businesses already optimizing their inventory with StockBridge.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <Link to="/register" className="btn-white">Create Account</Link>
            <Link to="/how-it-works" className="btn-white" style={{ background: 'transparent', color: 'white', border: '1px solid white' }}>Learn More</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="landing-logo" style={{ color: 'white' }}>
            <span>📦</span> StockBridge
          </div>
          <div className="footer-links">
            <Link to="/features">Features</Link>
            <Link to="/how-it-works">How it works</Link>
            <Link to="/pricing">Pricing</Link>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; 2026 StockBridge. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

