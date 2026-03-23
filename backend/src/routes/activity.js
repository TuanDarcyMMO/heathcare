import express from 'express';
import db from '../db.js';
import { generateId } from '../utils/helpers.js';

const router = express.Router();

// Get all activity logs
router.get('/', (req, res) => {
  const sql = `
    SELECT a.*, u.username
    FROM activity_logs a
    LEFT JOIN users u ON a.user_id = u.id
    ORDER BY a.created_at DESC
    LIMIT 100
  `;

  db.all(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// Log activity
router.post('/', (req, res) => {
  const { user_id, action, entity_type, entity_id, details } = req.body;

  if (!action) {
    return res.status(400).json({ error: 'Action is required' });
  }

  const id = generateId();
  const sql = `
    INSERT INTO activity_logs (id, user_id, action, entity_type, entity_id, details, created_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `;

  db.run(sql, [id, user_id || null, action, entity_type || null, entity_id || null, details || null], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id, message: 'Activity logged' });
  });
});

// Get activity by user
router.get('/user/:userId', (req, res) => {
  db.all(
    'SELECT * FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
    [req.params.userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows || []);
    }
  );
});

export default router;
