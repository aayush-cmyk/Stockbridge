const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/db');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @route   POST api/payments/create-order
// @desc    Create a razorpay order for a specific application order
// @access  Private (Retailer Only)
router.post('/create-order', auth, async (req, res) => {
  if (req.user.role !== 'retailer') {
    return res.status(403).json({ msg: 'Access denied: Retailers only' });
  }

  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ msg: 'Order ID is required' });
  }

  try {
    // 1. Get the order from the DB
    const [orders] = await db.execute('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (orders.length === 0) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    const order = orders[0];

    // Ensure it belongs to the retailer and is approved
    if (order.retailer_id !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    if (order.status !== 'approved') {
      return res.status(400).json({ msg: 'Order must be approved before payment.' });
    }

    // 2. Get the product to calculate total price
    const [products] = await db.execute('SELECT price FROM products WHERE id = ?', [order.product_id]);
    if (products.length === 0) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    const price = products[0].price;
    const amountInINR = price * order.quantity;
    
    // Razorpay requires amount in subunits (paise)
    const amountInPaise = Math.round(amountInINR * 100);

    // 3. Create a Razorpay Order
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_order_${order.id}`
    };

    const razorpayOrder = await razorpay.orders.create(options);

    if (!razorpayOrder) {
      return res.status(500).json({ msg: 'Failed to create Razorpay order' });
    }

    // Store the razorpay order id in DB (optional, but good for tracking)
    await db.execute('UPDATE orders SET razorpay_order_id = ? WHERE id = ?', [razorpayOrder.id, order.id]);

    res.json({
      id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
      localOrderId: order.id
    });
    
  } catch (err) {
    console.error("Razorpay create-order error:", err);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/payments/verify
// @desc    Verify Razorpay payment signature and mark order as paid
// @access  Private (Retailer Only)
router.post('/verify', auth, async (req, res) => {
  if (req.user.role !== 'retailer') {
    return res.status(403).json({ msg: 'Access denied: Retailers only' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, localOrderId } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !localOrderId) {
     return res.status(400).json({ msg: 'Missing required payment verification details' });
  }

  try {
    // 1. Verify the signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ msg: 'Invalid payment signature' });
    }

    // 2. Signature is valid, update the order status and generate invoice number
    // Optional: Double check that the order belongs to this user
    const [orders] = await db.execute('SELECT * FROM orders WHERE id = ? AND retailer_id = ?', [localOrderId, req.user.id]);
    if (orders.length === 0) {
       return res.status(404).json({ msg: 'Order not found or unauthorized' });
    }

    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `INV-${year}-${localOrderId}${random}`;

    await db.execute(
      'UPDATE orders SET status = ?, razorpay_payment_id = ?, razorpay_signature = ?, invoice_number = ? WHERE id = ?',
      ['paid', razorpay_payment_id, razorpay_signature, invoiceNumber, localOrderId]
    );

    res.json({ msg: 'Payment verified successfully. Order marked as paid.' });
  } catch (err) {
    console.error("Razorpay verify error:", err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
