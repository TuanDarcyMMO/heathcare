import express from 'express';
import db from '../db.js';
import { generateId } from '../utils/helpers.js';

const router = express.Router();

// Get all transactions
router.get('/', (req, res) => {
  const sql = `
    SELECT t.*, i.name as item_name, u.username as performed_by_name
    FROM transactions t
    LEFT JOIN inventory_items i ON t.item_id = i.id
    LEFT JOIN users u ON t.performed_by = u.id
    ORDER BY t.performed_at DESC
  `;

  db.all(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// Create transaction (import/export)
router.post('/', (req, res) => {
  const { item_id, transaction_type, quantity, notes, performed_by } = req.body;

  if (!item_id || !transaction_type || quantity === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!['import', 'export'].includes(transaction_type)) {
    return res.status(400).json({ error: 'Invalid transaction type' });
  }

  const id = generateId();
  const sql = `
    INSERT INTO transactions 
    (id, item_id, transaction_type, quantity, notes, performed_by, performed_at, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `;

  db.run(sql, [id, item_id, transaction_type, quantity, notes || '', performed_by || null], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    // Update inventory quantity
    if (transaction_type === 'import') {
      db.run('UPDATE inventory_items SET quantity = quantity + ?, updated_at = datetime("now") WHERE id = ?', [quantity, item_id]);
    } else if (transaction_type === 'export') {
      db.run('UPDATE inventory_items SET quantity = quantity - ?, updated_at = datetime("now") WHERE id = ?', [quantity, item_id]);
    }

    res.status(201).json({ id, message: 'Transaction created successfully' });
  });
});

// Get transaction history by item
router.get('/item/:itemId', (req, res) => {
  const sql = `
    SELECT t.*, u.username as performed_by_name
    FROM transactions t
    LEFT JOIN users u ON t.performed_by = u.id
    WHERE t.item_id = ?
    ORDER BY t.performed_at DESC
  `;

  db.all(sql, [req.params.itemId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

export default router;
