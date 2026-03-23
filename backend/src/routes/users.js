import express from 'express';
import db from '../db.js';
import { generateId } from '../utils/helpers.js';

const router = express.Router();

// Get all users
router.get('/', (req, res) => {
  db.all('SELECT id, username, email, role, created_at FROM users', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// Create user
router.post('/', (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  const id = generateId();
  const sql = `
    INSERT INTO users (id, username, email, password, role, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `;

  db.run(sql, [id, username, email, password, role || 'staff'], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Username or email already exists' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id, message: 'User created successfully' });
  });
});

// Get user by ID
router.get('/:id', (req, res) => {
  db.get('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'User not found' });
    res.json(row);
  });
});

export default router;
