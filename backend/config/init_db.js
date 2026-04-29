const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const dotenv = require('dotenv');

dotenv.config();

async function initDB() {
  const usePostgres = process.env.DATABASE_URL;
  console.log(`Initializing ${usePostgres ? 'PostgreSQL' : 'SQLite'} database...`);

  try {
    let execute;

    if (usePostgres) {
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });
      execute = async (sql) => {
        // Convert SQLite syntax to PostgreSQL syntax
        let pgSql = sql
          .replace(/AUTOINCREMENT/g, '')
          .replace(/INTEGER PRIMARY KEY/g, 'SERIAL PRIMARY KEY')
          .replace(/DATETIME/g, 'TIMESTAMP')
          .replace(/REAL/g, 'DECIMAL(10,2)');

        await pool.query(pgSql);
      };
    } else {
      const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
      });
      execute = async (sql) => await db.exec(sql);
    }

    // Create Users table (includes address, gstin, phone from day-1)
    await execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'retailer',
        business_name TEXT NOT NULL,
        address TEXT,
        gstin TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Products table
    await execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        supplier_id INTEGER NOT NULL,
        product_name TEXT NOT NULL,
        price REAL NOT NULL,
        stock_quantity INTEGER NOT NULL,
        unit TEXT DEFAULT 'unit',
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (supplier_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Create Orders table (includes all razorpay + billing columns)
    await execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        retailer_id INTEGER NOT NULL,
        supplier_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        razorpay_order_id TEXT,
        razorpay_payment_id TEXT,
        razorpay_signature TEXT,
        invoice_number TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (retailer_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (supplier_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      );
    `);

    // Create OTP Sessions table
    await execute(`
      CREATE TABLE IF NOT EXISTS otp_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        otp_hash TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database tables initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

initDB();
