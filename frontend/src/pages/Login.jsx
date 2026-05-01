import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const API = '/api/auth';

// ─── OTP Input Component ────────────────────────────────────────────────────
function OtpInput({ onComplete }) {
  const [digits, setDigits] = useState(Array(6).fill(''));
  const inputs = useRef([]);

  const handleKey = (e, idx) => {
    if (e.key === 'Backspace') {
      if (digits[idx] === '' && idx > 0) inputs.current[idx - 1].focus();
      const next = [...digits];
      next[idx] = '';
      setDigits(next);
      return;
    }
    if (!/^\d$/.test(e.key)) return;
    const next = [...digits];
    next[idx] = e.key;
    setDigits(next);
    if (idx < 5) inputs.current[idx + 1].focus();
    if (next.every(d => d !== '')) onComplete(next.join(''));
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!text) return;
    const next = text.split('').concat(Array(6).fill('')).slice(0, 6);
    setDigits(next);
    inputs.current[Math.min(text.length, 5)].focus();
    if (text.length === 6) onComplete(text);
  };

  return (
    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', margin: '2rem 0' }}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onKeyDown={e => handleKey(e, i)}
          onPaste={handlePaste}
          onChange={() => {}}
          className="otp-input-field"
          style={{
            borderColor: d ? 'var(--lp-primary)' : '#e2e8f0',
            background: d ? 'rgba(99,102,241,0.05)' : '#ffffff'
          }}
        />
      ))}
    </div>
  );
}

// ─── Countdown timer hook ────────────────────────────────────────────────────
function useCountdown(seconds) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    setRemaining(seconds);
    const id = setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [seconds]);
  return remaining;
}

// ─── Main Login Page ─────────────────────────────────────────────────────────
export default function Login() {
  const [mode, setMode] = useState('password'); // 'password' | 'otp'
  const [step, setStep] = useState(1);          // 1=email, 2=otp-verify
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const remaining = useCountdown(timerKey ? 300 : 0);
  const navigate = useNavigate();

  const saveSession = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('user_id', data.user_id);
    data.role === 'supplier' ? navigate('/supplier') : navigate('/retailer');
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await axios.post(`${API}/login`, { email, password });
      saveSession(res.data);
    } catch (err) {
      console.error('Login Error:', err);
      const msg = err.response?.data?.msg || err.message || 'Error logging in';
      setError(err.response ? `Server Error (${err.response.status}): ${msg}` : `Network Error: ${msg}. Is the backend running?`);
    } finally { setLoading(false); }
  };

  const sendOtp = async () => {
    setError(''); setInfo(''); setLoading(true);
    try {
      await axios.post(`${API}/send-otp`, { email });
      setStep(2);
      setTimerKey(k => k + 1);
      setInfo('Verification code sent to your email.');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    await sendOtp();
  };

  const handleVerifyOtp = async (otp) => {
    setError(''); setLoading(true);
    try {
      const res = await axios.post(`${API}/verify-otp`, { email, otp });
      saveSession(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid OTP');
      setLoading(false);
    }
  };

  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="auth-container">
      <div className="auth-card animate-fade-in">
        
        <div className="auth-header">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div className="auth-logo-box">📦</div>
          </Link>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Elevating B2B Inventory Management</p>
        </div>

        {/* Mode toggle */}
        <div className="auth-mode-toggle">
          <button
            className={`mode-btn ${mode === 'password' ? 'active' : ''}`}
            onClick={() => { setMode('password'); setStep(1); setError(''); setInfo(''); }}
          >
            Password
          </button>
          <button
            className={`mode-btn ${mode === 'otp' ? 'active' : ''}`}
            onClick={() => { setMode('otp'); setStep(1); setError(''); setInfo(''); }}
          >
            OTP Login
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="badge badge-danger mb-4" style={{ display: 'block', textAlign: 'center', padding: '0.8rem', borderRadius: '12px' }}>
            {error}
          </div>
        )}
        {info && (
          <div style={{
            background: '#dcfce7', border: '1px solid #86efac',
            borderRadius: 12, padding: '0.8rem', textAlign: 'center',
            color: '#166534', fontSize: '0.875rem', marginBottom: '1.5rem',
          }}>
            {info}
          </div>
        )}

        {/* ── PASSWORD FLOW ── */}
        {mode === 'password' && (
          <form onSubmit={handlePasswordLogin}>
            <div className="auth-input-group">
              <label className="auth-label">Email Address</label>
              <input 
                type="email" 
                className="auth-input" 
                required
                placeholder="name@company.com"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
            <div className="auth-input-group">
              <label className="auth-label">Password</label>
              <input 
                type="password" 
                className="auth-input" 
                required
                placeholder="••••••••"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* ── OTP FLOW – Step 1 ── */}
        {mode === 'otp' && step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="auth-input-group">
              <label className="auth-label">Email Address</label>
              <input 
                type="email" 
                className="auth-input" 
                required
                placeholder="Enter your registered email"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Sending Code...' : 'Get Verification Code'}
            </button>
          </form>
        )}

        {/* ── OTP FLOW – Step 2 ── */}
        {mode === 'otp' && step === 2 && (
          <div className="animate-fade-in">
            <p className="text-center" style={{ color: 'var(--lp-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              We've sent a 6-digit code to<br />
              <strong style={{ color: 'var(--lp-text)' }}>{email}</strong>
            </p>

            <OtpInput onComplete={handleVerifyOtp} />

            {loading && (
              <p className="text-center" style={{ color: '#6366f1', fontSize: '0.85rem', fontWeight: 600 }}>Verifying code...</p>
            )}

            {/* Countdown + Resend */}
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              {remaining > 0 ? (
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                  Code expires in <span style={{ color: '#f59e0b', fontWeight: 600 }}>{fmtTime(remaining)}</span>
                </p>
              ) : (
                <p style={{ color: '#f87171', fontSize: '0.85rem', fontWeight: 600 }}>Code expired</p>
              )}
              
              <button
                onClick={sendOtp}
                disabled={remaining > 240 || loading}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: remaining > 240 ? '#94a3b8' : 'var(--lp-primary)',
                  fontSize: '0.9rem', fontWeight: 700, marginTop: '0.5rem',
                  display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0.5rem auto',
                  opacity: remaining > 240 ? 0.5 : 1
                }}
              >
                {remaining > 240 ? `Resend in ${remaining - 240}s` : '↺ Resend Code'}
              </button>
            </div>

            <button
              onClick={() => { setStep(1); setError(''); setInfo(''); }}
              style={{
                width: '100%', marginTop: '1.5rem', background: '#f8fafc',
                border: '1px solid #cbd5e1', borderRadius: 12, padding: '0.8rem',
                color: 'var(--lp-text)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#f1f5f9'}
              onMouseOut={(e) => e.target.style.background = '#f8fafc'}
            >
              ← Use a different email
            </button>
          </div>
        )}

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create one for free</Link>
        </div>

        <div style={{ 
          marginTop: '2rem', textAlign: 'center', display: 'flex', 
          alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          color: '#475569', fontSize: '0.75rem' 
        }}>
          <span style={{ fontSize: '1rem' }}>🛡️</span> Secure 256-bit SSL Encryption
        </div>
      </div>
    </div>
  );
}