import { Link } from 'react-router-dom';
import '../App.css';

export default function Pricing() {
  return (
    <div className="landing-page">
      {/* NAVBAR */}
      <nav className="landing-nav">
        <Link to="/" className="landing-logo">
          <span>📦</span> StockBridge
        </Link>
        <div className="landing-nav-links">
          <Link to="/features">Features</Link>
          <Link to="/how-it-works">How it works</Link>
          <Link to="/pricing" style={{ fontWeight: 'bold' }}>Pricing</Link>
          <Link to="/login">Login</Link>
          <Link to="/register" className="register-btn">Register</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="landing-hero-container" style={{ padding: '4rem 5%', minHeight: 'auto' }}>
        <div className="landing-hero-content" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div className="hero-badge">Flexible Plans</div>
          <h1>Transparent <span>Pricing</span></h1>
          <p>No hidden fees. No complex contracts. Scalable solutions for businesses of all sizes.</p>
        </div>
      </section>

      {/* PRICING GRID */}
      <section style={{ padding: '6rem 5%', background: '#ffffff' }}>
        <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* RETAILER PLAN */}
          <div className="glass-card" style={{ width: '340px', padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column' }}>
            <div className="hero-badge" style={{ background: '#f1f5f9', color: '#475569' }}>For Shopkeepers</div>
            <h3 style={{ fontSize: '1.8rem', marginTop: '1rem' }}>Retailer</h3>
            <div style={{ margin: '2rem 0' }}>
              <span style={{ fontSize: '3rem', fontWeight: '800' }}>Free</span>
            </div>
            <p className="text-muted" style={{ marginBottom: '2rem', minHeight: '60px' }}>Perfect for small retailers starting their digital journey.</p>
            <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', marginBottom: '3rem', flexGrow: 1 }}>
              <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.8rem' }}>
                <span style={{ color: '#10b981' }}>✓</span> Unlimited stock browsing
              </li>
              <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.8rem' }}>
                <span style={{ color: '#10b981' }}>✓</span> 50 order requests / month
              </li>
              <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.8rem' }}>
                <span style={{ color: '#10b981' }}>✓</span> Real-time notifications
              </li>
              <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.8rem', opacity: 0.5 }}>
                <span style={{ color: '#94a3b8' }}>✗</span> Priority fulfillment
              </li>
            </ul>
            <Link to="/register?role=retailer" className="btn-secondary-main" style={{ margin: 0, width: '100%', textAlign: 'center' }}>Join as Retailer</Link>
          </div>

          {/* SUPPLIER PLAN - HIGHLIGHTED */}
          <div className="glass-card" style={{ width: '360px', padding: '3rem 2.5rem', border: '2px solid var(--lp-primary)', position: 'relative', transform: 'scale(1.05)', zIndex: 1, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.15)' }}>
            <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'var(--lp-primary)', color: 'white', padding: '0.4rem 1.2rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '0.05em' }}>MOST POPULAR</div>
            <div className="hero-badge" style={{ background: '#eef2ff', color: 'var(--lp-primary)' }}>For Distributors</div>
            <h3 style={{ fontSize: '1.8rem', marginTop: '1rem' }}>Supplier Pro</h3>
            <div style={{ margin: '2rem 0' }}>
              <span style={{ fontSize: '3rem', fontWeight: '800' }}>₹2,499</span>
              <span style={{ color: 'var(--lp-text-muted)' }}> /mo</span>
            </div>
            <p className="text-muted" style={{ marginBottom: '2rem', minHeight: '60px' }}>Full-suite solution for distributors looking to scale operations.</p>
            <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', marginBottom: '3rem', flexGrow: 1 }}>
              <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.8rem' }}>
                <span style={{ color: 'var(--lp-primary)' }}>✓</span> Unlimited SKU listings
              </li>
              <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.8rem' }}>
                <span style={{ color: 'var(--lp-primary)' }}>✓</span> Order request pipeline
              </li>
              <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.8rem' }}>
                <span style={{ color: 'var(--lp-primary)' }}>✓</span> Advanced sales analytics
              </li>
              <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.8rem' }}>
                <span style={{ color: 'var(--lp-primary)' }}>✓</span> Premium Razorpay rates
              </li>
            </ul>
            <Link to="/register?role=supplier" className="btn-primary-main" style={{ width: '100%', textAlign: 'center' }}>Start 14-Day Trial</Link>
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="landing-faq">
        <div className="section-header">
          <h2>Pricing FAQs</h2>
        </div>
        <div className="faq-container">
          <div className="glass-card faq-item" style={{ padding: '2rem' }}>
            <h4>Can I cancel anytime?</h4>
            <p className="text-muted">Yes, you can cancel your subscription at any time from your dashboard. No long-term commitments required.</p>
          </div>
          <div className="glass-card faq-item" style={{ padding: '2rem' }}>
            <h4>Is there a transaction fee?</h4>
            <p className="text-muted">StockBridge does not charge transaction fees. Standard Razorpay gateway fees apply for online payments.</p>
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

