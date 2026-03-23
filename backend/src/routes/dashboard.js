import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get dashboard statistics
router.get('/', (req, res) => {
  Promise.all([
    new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as total FROM inventory_items WHERE status = "active"', (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    }),
    new Promise((resolve, reject) => {
      db.get('SELECT SUM(quantity) as total_quantity FROM inventory_items WHERE status = "active"', (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    }),
    new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as total FROM inventory_items WHERE status = "active" AND quantity < 10', (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    }),
    new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as total FROM inventory_items WHERE status = "active" AND expiry_date < date("now")', (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    }),
    new Promise((resolve, reject) => {
      db.all('SELECT transaction_type, COUNT(*) as count FROM transactions GROUP BY transaction_type', (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    }),
    new Promise((resolve, reject) => {
      db.all('SELECT * FROM inventory_items WHERE status = "active" ORDER BY updated_at DESC LIMIT 5', (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    }),
  ])
    .then(([totalItems, totalQuantity, lowStock, expiredItems, transactions, recentItems]) => {
      res.json({
        totalItems: totalItems?.total || 0,
        totalQuantity: totalQuantity?.total_quantity || 0,
        lowStockCount: lowStock?.total || 0,
        expiredCount: expiredItems?.total || 0,
        transactions: transactions.reduce((acc, t) => ({ ...acc, [t.transaction_type]: t.count }), {}),
        recentItems,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

export default router;
