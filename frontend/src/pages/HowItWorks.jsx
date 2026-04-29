import { Link } from 'react-router-dom';
import '../App.css';

export default function HowItWorks() {
  return (
    <div className="landing-page">
      {/* NAVBAR */}
      <nav className="landing-nav">
        <Link to="/" className="landing-logo">
          <span>📦</span> StockBridge
        </Link>
        <div className="landing-nav-links">
          <Link to="/features">Features</Link>
          <Link to="/how-it-works" style={{ fontWeight: 'bold' }}>How it works</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/login">Login</Link>
          <Link to="/register" className="register-btn">Register</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="landing-hero-container" style={{ padding: '4rem 5%', minHeight: 'auto' }}>
        <div className="landing-hero-content" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div className="hero-badge">Step-by-Step</div>
          <h1>How it <span>Works</span></h1>
          <p>We've simplified the complex world of B2B inventory into four easy steps.</p>
        </div>
      </section>

      {/* PROCESS TIMELINE */}
      <section style={{ padding: '6rem 5%', background: '#ffffff' }}>
        <div className="process-timeline" style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
          
          {/* STEP 1 */}
          <div className="process-step" style={{ display: 'grid', gridTemplateColumns: '1fr 100px 1fr', alignItems: 'center', marginBottom: '4rem' }}>
            <div style={{ textAlign: 'right' }}>
              <h3>Onboarding</h3>
              <p className="text-muted">Create your account and choose your role: Supplier or Retailer. Verification takes less than 2 minutes.</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="step-number" style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--lp-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', boxShadow: '0 0 0 10px #f5f3ff' }}>1</div>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', fontSize: '2.5rem' }}>🔐</div>
          </div>

          {/* STEP 2 */}
          <div className="process-step" style={{ display: 'grid', gridTemplateColumns: '1fr 100px 1fr', alignItems: 'center', marginBottom: '4rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', fontSize: '2.5rem', order: 1 }}>📤</div>
            <div style={{ display: 'flex', justifyContent: 'center', order: 2 }}>
              <div className="step-number" style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--lp-secondary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', boxShadow: '0 0 0 10px #f0f9ff' }}>2</div>
            </div>
            <div style={{ textAlign: 'left', order: 3 }}>
              <h3>Inventory Sync</h3>
              <p className="text-muted">Suppliers upload their current stock. Our platform processes the data and makes it instantly visible to verified retailers.</p>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="process-step" style={{ display: 'grid', gridTemplateColumns: '1fr 100px 1fr', alignItems: 'center', marginBottom: '4rem' }}>
            <div style={{ textAlign: 'right' }}>
              <h3>Discovery & Requests</h3>
              <p className="text-muted">Retailers browse live inventory. If a product is low, they send a formal "Stock Request" with a single tap.</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="step-number" style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--lp-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', boxShadow: '0 0 0 10px #f5f3ff' }}>3</div>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', fontSize: '2.5rem' }}>🔍</div>
          </div>

          {/* STEP 4 */}
          <div className="process-step" style={{ display: 'grid', gridTemplateColumns: '1fr 100px 1fr', alignItems: 'center' }}>
            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', fontSize: '2.5rem', order: 1 }}>🤝</div>
            <div style={{ display: 'flex', justifyContent: 'center', order: 2 }}>
              <div className="step-number" style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--lp-secondary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', boxShadow: '0 0 0 10px #f0f9ff' }}>4</div>
            </div>
            <div style={{ textAlign: 'left', order: 3 }}>
              <h3>Fulfillment</h3>
              <p className="text-muted">Suppliers receive notifications of requests, confirm availability, and process the order. Both parties stay updated throughout.</p>
            </div>
          </div>

        </div>
      </section>

      {/* DETAILED WORKFLOWS */}
      <section style={{ padding: '8rem 5%', background: '#f8fafc' }}>
        <div className="section-header">
          <h2>Deep Dive Workflows</h2>
          <p className="text-muted">Choose your path to see exactly how StockBridge works for you.</p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
          <div className="glass-card" style={{ maxWidth: '400px', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🏭</div>
            <h3>For Suppliers</h3>
            <ul style={{ textAlign: 'left', color: 'var(--lp-text-muted)', lineHeight: '2' }}>
              <li>Dashboard for stock overview</li>
              <li>Bulk CSV import for inventory</li>
              <li>Real-time request notifications</li>
              <li>Retailer management system</li>
            </ul>
          </div>
          <div className="glass-card" style={{ maxWidth: '400px', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🏪</div>
            <h3>For Retailers</h3>
            <ul style={{ textAlign: 'left', color: 'var(--lp-text-muted)', lineHeight: '2' }}>
              <li>Unified supplier directory</li>
              <li>Watchlist for out-of-stock items</li>
              <li>Instant order request tool</li>
              <li>Historical request tracking</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="landing-faq">
        <div className="section-header">
          <h2>Common Questions</h2>
        </div>
        <div className="faq-container">
          <div className="glass-card faq-item" style={{ padding: '2rem' }}>
            <h4>Is my data private?</h4>
            <p className="text-muted">Yes. Suppliers only share inventory with retailers they've specifically approved.</p>
          </div>
          <div className="glass-card faq-item" style={{ padding: '2rem' }}>
            <h4>How long does setup take?</h4>
            <p className="text-muted">Most businesses are up and running in under 10 minutes. Our bulk import tool makes it fast.</p>
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

