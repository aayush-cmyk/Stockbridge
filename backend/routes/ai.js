const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/db');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// @route   GET api/ai/inventory-insights
// @desc    Get AI-powered inventory insights for supplier
// @access  Private (Supplier Only)
router.get('/inventory-insights', auth, async (req, res) => {
  if (req.user.role !== 'supplier') {
    return res.status(403).json({ msg: 'Access denied: Suppliers only' });
  }

  try {
    // 1. Fetch current products
    const [products] = await db.execute(
      'SELECT product_name, price, stock_quantity, unit FROM products WHERE supplier_id = ?',
      [req.user.id]
    );

    // 2. Fetch recent orders (last 30 days or last 50 orders)
    const [orders] = await db.execute(
      `SELECT o.quantity, p.product_name, o.created_at, o.status 
       FROM orders o 
       JOIN products p ON o.product_id = p.id 
       WHERE o.supplier_id = ? 
       ORDER BY o.created_at DESC LIMIT 50`,
      [req.user.id]
    );

    if (products.length === 0) {
      return res.json({ insight: "You haven't added any products yet. Add some products to get AI insights!" });
    }

    // 3. Prepare data for Gemini
    const inventoryData = products.map(p => `${p.product_name}: ${p.stock_quantity} ${p.unit} ($${p.price})`).join('\n');
    const orderData = orders.map(o => `${o.product_name} (${o.quantity} units, Status: ${o.status})`).join('\n');

    const prompt = `
      You are an expert B2B Inventory Consultant for "StockBridge".
      Analyze the following inventory and recent order data for a supplier and provide actionable insights.
      
      Current Inventory:
      ${inventoryData}
      
      Recent Orders (Last 50):
      ${orderData}
      
      Please provide:
      1. A brief executive summary of the business health.
      2. Top 3 fast-moving items that might need restocking soon.
      3. Any slow-moving items that are overstocked.
      4. One strategic pricing or bundling suggestion to increase sales.
      
      Format the response in clean Markdown. Keep it professional and concise.
      If there are no orders yet, focus on inventory balance.
    `;

    // 4. Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ insight: text });
  } catch (err) {
    console.error('AI Insight Error:', err.message);
    // If API key is missing or invalid
    if (err.message.includes('API key')) {
        return res.status(500).json({ msg: 'AI integration is not configured. Please add a valid GOOGLE_API_KEY to the backend .env file.' });
    }
    res.status(500).send('Server Error generating AI insights');
  }
});

module.exports = router;
