const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/db');

// @route   POST api/orders
// @desc    Place a new order request
// @access  Private (Retailer Only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'retailer') {
    return res.status(403).json({ msg: 'Access denied: Retailers only' });
  }

  const { product_id, supplier_id, quantity } = req.body;

  try {
    // Check product availability
    const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [product_id]);
    if (products.length === 0) return res.status(404).json({ msg: 'Product not found' });
    if (products[0].stock_quantity < quantity) return res.status(400).json({ msg: 'Insufficient stock' });

    // Ensure it matches supplier
    if (products[0].supplier_id !== supplier_id) return res.status(400).json({ msg: 'Invalid supplier for product' });

    // Place order
    const [result] = await db.execute(
      'INSERT INTO orders (retailer_id, supplier_id, product_id, quantity, status) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, supplier_id, product_id, quantity, 'pending']
    );

    res.json({ msg: 'Order request placed successfully', orderId: result.insertId });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/orders
// @desc    Get user's orders (Supplier sees incoming, Retailer sees outgoing)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let query = '';
    let params = [req.user.id];

    if (req.user.role === 'supplier') {
      // Get orders received by supplier
      query = `
        SELECT o.*, p.product_name, p.price, p.unit, 
               u.business_name AS retailer_name, u.address AS retailer_address, u.gstin AS retailer_gstin, u.email AS retailer_email, u.phone AS retailer_phone,
               s.business_name AS supplier_name, s.address AS supplier_address, s.gstin AS supplier_gstin, s.email AS supplier_email, s.phone AS supplier_phone
        FROM orders o
        JOIN products p ON o.product_id = p.id
        JOIN users u ON o.retailer_id = u.id
        JOIN users s ON o.supplier_id = s.id
        WHERE o.supplier_id = ?
        ORDER BY o.created_at DESC
      `;
    } else {
      // Get orders placed by retailer
      query = `
        SELECT o.*, p.product_name, p.price, p.unit, 
               u.business_name AS supplier_name, u.address AS supplier_address, u.gstin AS supplier_gstin, u.email AS supplier_email, u.phone AS supplier_phone,
               r.business_name AS retailer_name, r.address AS retailer_address, r.gstin AS retailer_gstin, r.email AS retailer_email, r.phone AS retailer_phone
        FROM orders o
        JOIN products p ON o.product_id = p.id
        JOIN users u ON o.supplier_id = u.id
        JOIN users r ON o.retailer_id = r.id
        WHERE o.retailer_id = ?
        ORDER BY o.created_at DESC
      `;
    }

    const [orders] = await db.execute(query, params);
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/orders/:id
// @desc    Get single order details
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const query = `
      SELECT o.*, p.product_name, p.price, p.unit, 
             u.business_name AS retailer_name, u.address AS retailer_address, u.gstin AS retailer_gstin, u.email AS retailer_email, u.phone AS retailer_phone,
             s.business_name AS supplier_name, s.address AS supplier_address, s.gstin AS supplier_gstin, s.email AS supplier_email, s.phone AS supplier_phone
      FROM orders o
      JOIN products p ON o.product_id = p.id
      JOIN users u ON o.retailer_id = u.id
      JOIN users s ON o.supplier_id = s.id
      WHERE o.id = ? AND (o.retailer_id = ? OR o.supplier_id = ?)
    `;
    const [orders] = await db.execute(query, [req.params.id, req.user.id, req.user.id]);
    
    if (orders.length === 0) return res.status(404).json({ msg: 'Order not found' });
    res.json(orders[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/orders/:id/status
// @desc    Update order status (Approve/Reject)
// @access  Private (Supplier Only)
router.put('/:id/status', auth, async (req, res) => {
  if (req.user.role !== 'supplier') {
    return res.status(403).json({ msg: 'Access denied' });
  }

  const { status } = req.body;
  const validStatuses = ['approved', 'rejected'];
  if (!validStatuses.includes(status)) return res.status(400).json({ msg: 'Invalid status' });

  try {
    // Basic order check
    const [orders] = await db.execute('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (orders.length === 0) return res.status(404).json({ msg: 'Order not found' });
    const order = orders[0];

    if (order.supplier_id !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    // Begin a simple check before update
    if (status === 'approved' && order.status !== 'approved') {
       // Reduce product quantity first
       const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [order.product_id]);
       if (products.length === 0) return res.status(404).json({ msg: 'Product deleted' });
       
       if (products[0].stock_quantity < order.quantity) {
           return res.status(400).json({ msg: 'Insufficient stock to approve this order.' });
       }
       
       await db.execute('UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?', [order.quantity, order.product_id]);
    }

    // if changing FROM approved TO rejected (rollback stock)
    if (status === 'rejected' && order.status === 'approved') {
       await db.execute('UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?', [order.quantity, order.product_id]);
    }

    await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ msg: `Order status updated to ${status}` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/orders/supplier-stats
// @desc    Get sales analytics for supplier
// @access  Private (Supplier Only)
router.get('/supplier-stats', auth, async (req, res) => {
  if (req.user.role !== 'supplier') {
    return res.status(403).json({ msg: 'Access denied' });
  }

  try {
    // Get all approved/paid orders for this supplier
    const query = `
      SELECT o.*, p.product_name, p.price
      FROM orders o
      JOIN products p ON o.product_id = p.id
      WHERE o.supplier_id = ? AND (o.status = 'approved' OR o.status = 'paid')
    `;
    const [orders] = await db.execute(query, [req.user.id]);

    const totalUnitsSold = orders.reduce((sum, o) => sum + o.quantity, 0);
    const totalRevenue = orders.reduce((sum, o) => sum + (o.quantity * o.price), 0);

    // Group by product
    const productPerformance = {};
    orders.forEach(o => {
      if (!productPerformance[o.product_name]) {
        productPerformance[o.product_name] = { units: 0, revenue: 0 };
      }
      productPerformance[o.product_name].units += o.quantity;
      productPerformance[o.product_name].revenue += o.quantity * o.price;
    });

    // Recent sales (last 10)
    const recentSales = orders.slice(0, 10);

    res.json({
      totalUnitsSold,
      totalRevenue,
      productPerformance,
      recentSales,
      orderCount: orders.length
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
