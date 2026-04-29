const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/db');
const multer = require('multer');

// Use memoryStorage — no disk writes (required for Vercel serverless)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @route   GET api/products
// @desc    Get all inventory products with supplier info
// @access  Private (Retailer & Supplier)
router.get('/', auth, async (req, res) => {
  try {
    const query = `
      SELECT p.id, p.product_name, p.price, p.stock_quantity, p.unit, p.image_url, u.business_name AS supplier_name, u.id AS supplier_id 
      FROM products p 
      JOIN users u ON p.supplier_id = u.id
    `;
    const [rows] = await db.execute(query);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/products
// @desc    Add new product inventory
// @access  Private (Supplier Only)
router.post('/', auth, upload.single('image'), async (req, res) => {
  if (req.user.role !== 'supplier') {
    return res.status(403).json({ msg: 'Access denied: Suppliers only' });
  }

  const { product_name, price, stock_quantity, unit } = req.body;
  const productUnit = unit || 'unit';

  // Store image as base64 data URL (works on serverless — no disk required)
  let image_url = null;
  if (req.file) {
    image_url = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO products (supplier_id, product_name, price, stock_quantity, unit, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, product_name, price, stock_quantity, productUnit, image_url]
    );

    const [newProduct] = await db.execute('SELECT * FROM products WHERE id = ?', [result.insertId]);
    res.json(newProduct[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/products/:id
// @desc    Update product inventory or price
// @access  Private (Supplier Only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'supplier') {
    return res.status(403).json({ msg: 'Access denied' });
  }

  const { product_name, price, stock_quantity, unit } = req.body;
  const productId = req.params.id;

  try {
    // Ensure product belongs to the supplier
    const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [productId]);
    if (products.length === 0) return res.status(404).json({ msg: 'Product not found' });
    if (products[0].supplier_id !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    await db.execute(
      'UPDATE products SET product_name = ?, price = ?, stock_quantity = ?, unit = ? WHERE id = ?',
      [product_name, price, stock_quantity, unit, productId]
    );

    res.json({ msg: 'Product updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/products/:id
// @desc    Delete product
// @access  Private (Supplier Only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'supplier') {
    return res.status(403).json({ msg: 'Access denied' });
  }

  try {
    // Ensure product belongs to the supplier
    const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (products.length === 0) return res.status(404).json({ msg: 'Product not found' });
    if (products[0].supplier_id !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
