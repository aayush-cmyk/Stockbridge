const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check - test if function loads at all
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    db: process.env.DATABASE_URL ? 'postgres' : 'sqlite',
    node: process.version
  });
});

// Import Routes
let authRoutes, productsRoutes, ordersRoutes, paymentsRoutes, aiRoutes;
try {
  authRoutes = require('./routes/auth');
  productsRoutes = require('./routes/products');
  ordersRoutes = require('./routes/orders');
  paymentsRoutes = require('./routes/payments');
  aiRoutes = require('./routes/ai');
} catch (err) {
  console.error('Failed to load routes:', err.message);
  app.use('/api', (req, res) => {
    res.status(500).json({ msg: 'Route loading failed', error: err.message });
  });
}

// Route Middlewares
if (authRoutes) {
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productsRoutes);
  app.use('/api/orders', ordersRoutes);
  app.use('/api/payments', paymentsRoutes);
  app.use('/api/ai', aiRoutes);
}

// --- SERVE FRONTEND IN PRODUCTION ---
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // Any route that is not an API route or a static file, serve index.html
  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Database initialization (Tables are already initialized in Neon)
// require('./config/init_db');

const PORT = process.env.PORT || 5000;

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    msg: 'Backend Error',
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Only start the server if we're not in a serverless environment (like Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

// Export for Vercel
module.exports = app;
