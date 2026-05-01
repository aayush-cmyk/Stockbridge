const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

async function initNeon() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL not found in .env');
    return;
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  console.log('Connecting to Neon...');

  try {
    // Create Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'retailer',
        business_name TEXT NOT NULL,
        address TEXT,
        gstin TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        supplier_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        product_name TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        stock_quantity INTEGER NOT NULL,
        unit TEXT DEFAULT 'unit',
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        retailer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        supplier_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        razorpay_order_id TEXT,
        razorpay_payment_id TEXT,
        razorpay_signature TEXT,
        invoice_number TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create OTP Sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS otp_sessions (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        otp_hash TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Neon Database Schema Initialized Successfully!');
  } catch (err) {
    console.error('❌ Error initializing Neon:', err.message);
  } finally {
    await pool.end();
  }
}

initNeon();
