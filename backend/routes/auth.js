const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('../config/db');

// ─── Nodemailer transporter ──────────────────────────────────────────────────
// In dev mode we use Ethereal (fake SMTP) so no real email is sent.
// Set SMTP_HOST / SMTP_USER / SMTP_PASS in .env to use a real provider.
async function getTransporter() {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  // Fallback: Ethereal test account
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
}

// ─── Helper: generate & sign JWT ────────────────────────────────────────────
function signToken(user) {
  return new Promise((resolve, reject) => {
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'jwt_secret_token',
      { expiresIn: '5 days' },
      (err, token) => (err ? reject(err) : resolve(token))
    );
  });
}

// ─── POST /api/auth/register ─────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, phone, password, role, business_name } = req.body;
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (name, email, phone, password, role, business_name) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone, hashedPassword, role, business_name]
    );

    const token = await signToken({ id: result.insertId, role });
    res.json({ token, role, user_id: result.insertId });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ─── POST /api/auth/login (password) ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(400).json({ msg: 'Invalid Credentials' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const token = await signToken(user);
    res.json({ token, role: user.role, user_id: user.id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ─── POST /api/auth/send-otp ──────────────────────────────────────────────────
// Generates a 6-digit OTP, stores it (hashed) with a 5-min expiry, and emails it.
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: 'Email is required' });

  try {
    // Verify the user exists
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(400).json({ msg: 'No account found with that email' });

    // Generate OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

    // Delete any previous OTPs for this email
    await db.execute('DELETE FROM otp_sessions WHERE email = ?', [email]);

    // Store new OTP
    await db.execute(
      'INSERT INTO otp_sessions (email, otp_hash, expires_at) VALUES (?, ?, ?)',
      [email, otpHash, expiresAt]
    );

    // Send email
    const transporter = await getTransporter();
    const info = await transporter.sendMail({
      from: '"StockBridge" <no-reply@stockbridge.app>',
      to: email,
      subject: 'Your StockBridge login OTP',
      html: `
        <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:2rem;border:1px solid #e2e8f0;border-radius:12px">
          <h2 style="color:#6366f1;margin-bottom:0.5rem">StockBridge</h2>
          <p style="color:#475569">Your one-time login code:</p>
          <div style="font-size:2.5rem;font-weight:700;letter-spacing:0.3em;color:#1e293b;margin:1rem 0">${otp}</div>
          <p style="color:#94a3b8;font-size:0.875rem">This code expires in 5 minutes. Do not share it with anyone.</p>
        </div>
      `,
    });

    // In dev mode print the preview URL so you can read the OTP
    if (!process.env.SMTP_HOST) {
      console.log('\n========================================');
      console.log(`📧 OTP for ${email}: ${otp}`);
      console.log(`🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      console.log('========================================\n');
    }

    res.json({ msg: 'OTP sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ─── POST /api/auth/verify-otp ────────────────────────────────────────────────
// Verifies the OTP and returns a JWT if valid.
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ msg: 'Email and OTP are required' });

  try {
    // Fetch latest OTP session
    const [sessions] = await db.execute(
      'SELECT * FROM otp_sessions WHERE email = ? ORDER BY created_at DESC LIMIT 1',
      [email]
    );
    if (sessions.length === 0) return res.status(400).json({ msg: 'No OTP requested for this email' });

    const session = sessions[0];

    // Check expiry
    if (new Date() > new Date(session.expires_at)) {
      await db.execute('DELETE FROM otp_sessions WHERE email = ?', [email]);
      return res.status(400).json({ msg: 'OTP has expired. Please request a new one.' });
    }

    // Verify OTP
    const isMatch = await bcrypt.compare(otp, session.otp_hash);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid OTP' });

    // Delete used OTP
    await db.execute('DELETE FROM otp_sessions WHERE email = ?', [email]);

    // Fetch user & return JWT
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(400).json({ msg: 'User not found' });

    const user = rows[0];
    const token = await signToken(user);
    res.json({ token, role: user.role, user_id: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

const auth = require('../middleware/auth');

// ─── GET /api/auth/profile ──────────────────────────────────────────────────
router.get('/profile', auth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, name, email, phone, role, business_name, address, gstin FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ msg: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ─── PUT /api/auth/profile ──────────────────────────────────────────────────
router.put('/profile', auth, async (req, res) => {
  const { business_name, address, gstin, phone } = req.body;
  try {
    await db.execute(
      'UPDATE users SET business_name = ?, address = ?, gstin = ?, phone = ? WHERE id = ?',
      [business_name, address, gstin, phone, req.user.id]
    );
    res.json({ msg: 'Profile updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
