import { Link } from 'react-router-dom';
import '../App.css';

export default function Landing() {
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
          <Link to="/pricing">Pricing</Link>
          <div className="nav-auth-btns">
            <Link to="/login" className="login-link">Login</Link>
            <Link to="/register" className="register-btn">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="landing-hero-container">
        <div className="landing-hero-content">
          <span className="hero-badge">New: Razorpay Integration Live 🚀</span>
          <h1>Revolutionize Your <span>B2B Supply Chain</span></h1>
          <p>The bridge between distributors and retailers. See live stock, place orders instantly, and grow your business with data-driven insights.</p>
          <div className="landing-hero-buttons">
            <Link to="/register"><button className="btn-primary-main">Start Free Trial</button></Link>
            <Link to="/how-it-works"><button className="btn-secondary-main">Watch How it Works</button></Link>
          </div>
          <div className="hero-stats">
            <div><strong>10k+</strong> <span>Retailers</span></div>
            <div><strong>500+</strong> <span>Suppliers</span></div>
            <div><strong>₹10Cr+</strong> <span>Processed</span></div>
          </div>
        </div>
        <div className="landing-hero-image">
          <img src="/assets/hero.png" alt="Supply Chain Illustration" className="animate-float" />
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="trust-bar">
        <p>Trusted by distributors from top brands</p>
        <div className="brand-logos">
          <span>TRUSTED BRAND</span>
          <span>DISTRIBUTION CO</span>
          <span>GLOBAL LOGISTICS</span>
          <span>RETAIL GIANT</span>
          <span>SMART STOCK</span>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="landing-features-detailed">
        <div className="section-header">
          <h2>Everything you need to scale</h2>
          <p>Powerful tools designed specifically for the Indian B2B market.</p>
        </div>
        
        <div className="feature-detailed-grid">
          <div className="feature-item card animate-fade-in">
            <img src="/assets/icon-inventory.png" alt="Inventory" />
            <h3>Live Visibility</h3>
            <p>Real-time inventory synchronization. Retailers see what's actually on your shelves, reducing cancelled orders.</p>
          </div>

          <div className="feature-item card animate-fade-in">
            <img src="/assets/icon-order.png" alt="Ordering" />
            <h3>Secure Payments</h3>
            <p>Integrated Razorpay checkout. Accept UPI, Cards, and Net Banking with instant order confirmation.</p>
          </div>

          <div className="feature-item card animate-fade-in">
            <img src="/assets/icon-analytics.png" alt="Analytics" />
            <h3>Growth Insights</h3>
            <p>Track your top-selling products and identify market trends before your competitors do.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <h2>What our partners say</h2>
        <div className="testimonial-grid">
          <div className="testimonial-card card">
            <p>"StockBridge reduced our coordination time by 80%. No more calling suppliers every hour for stock updates."</p>
            <div className="user-info">
              <div className="user-avatar">RK</div>
              <div>
                <strong>Rajesh Kumar</strong>
                <span>Retailer, Mumbai</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card card">
            <p>"The Razorpay integration is a game-changer. We get paid instantly and our cash flow has never been better."</p>
            <div className="user-info">
              <div className="user-avatar">AS</div>
              <div>
                <strong>Amit Sharma</strong>
                <span>Supplier, Delhi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="landing-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-container">
          <div className="faq-item">
            <h4>Is it secure?</h4>
            <p>Yes, all transactions are encrypted and processed through industry-standard gateways like Razorpay.</p>
          </div>
          <div className="faq-item">
            <h4>Can I use it on mobile?</h4>
            <p>Absolutely! StockBridge is a PWA, meaning you can install it on your phone just like a native app.</p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="landing-cta-v2">
        <div className="cta-content">
          <h2>Ready to bridge the gap?</h2>
          <p>Join thousands of businesses already scaling with StockBridge.</p>
          <Link to="/register"><button className="btn-white">Create Your Account</button></Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>StockBridge</h3>
            <p>Building the future of B2B commerce.</p>
          </div>
          <div className="footer-links">
            <Link to="/features">Features</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/login">Login</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 StockBridge | Proudly made for India 🇮🇳</p>
        </div>
      </footer>
    </div>
  );
}