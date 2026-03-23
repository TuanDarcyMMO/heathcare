import express from 'express';
import db from '../db.js';
import { generateId, promisifyDb } from '../utils/helpers.js';

const router = express.Router();
const dbAsync = promisifyDb(db);

// Get all inventory items
router.get('/', (req, res) => {
  db.all('SELECT * FROM inventory_items WHERE status = "active" ORDER BY updated_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// Get single item
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM inventory_items WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Item not found' });
    res.json(row);
  });
});

// Create inventory item
router.post('/', (req, res) => {
  const { name, category, quantity, supplier, expiry_date, unit, cost_price, selling_price } = req.body;

  if (!name || !category) {
    return res.status(400).json({ error: 'Name and category are required' });
  }

  const id = generateId();
  const sql = `
    INSERT INTO inventory_items 
    (id, name, category, quantity, unit, supplier, expiry_date, cost_price, selling_price, status, created_at, updated_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `;

  db.run(sql, [id, name, category, quantity || 0, unit || '', supplier || '', expiry_date || null, cost_price || 0, selling_price || 0, 'active'], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id, message: 'Item created successfully' });
  });
});

// Update inventory item
router.put('/:id', (req, res) => {
  const { name, category, quantity, supplier, expiry_date, unit, cost_price, selling_price } = req.body;

  const sql = `
    UPDATE inventory_items 
    SET name = ?, category = ?, quantity = ?, unit = ?, supplier = ?, expiry_date = ?, cost_price = ?, selling_price = ?, updated_at = datetime('now')
    WHERE id = ?
  `;

  db.run(sql, [name, category, quantity, unit, supplier, expiry_date, cost_price, selling_price, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item updated successfully' });
  });
});

// Delete inventory item (soft delete)
router.delete('/:id', (req, res) => {
  db.run('UPDATE inventory_items SET status = "inactive", updated_at = datetime("now") WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  });
});

// Search items
router.get('/search/query', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  const sql = `
    SELECT * FROM inventory_items 
    WHERE status = "active" AND (name LIKE ? OR category LIKE ?)
    ORDER BY updated_at DESC
  `;
  
  db.all(sql, [`%${q}%`, `%${q}%`], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

export default router;
