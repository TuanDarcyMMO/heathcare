import React, { useEffect, useState } from 'react';
import { transactionAPI, inventoryAPI } from '../api/client';
import Card from '../components/Card';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    item_id: '',
    transaction_type: 'import',
    quantity: 0,
    notes: '',
    performed_by: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [transRes, itemsRes] = await Promise.all([
        transactionAPI.getAll(),
        inventoryAPI.getAll(),
      ]);
      setTransactions(transRes.data);
      setItems(itemsRes.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.item_id || formData.quantity <= 0) {
      alert('Please select an item and enter a quantity');
      return;
    }

    try {
      await transactionAPI.create(formData);
      setFormData({
        item_id: '',
        transaction_type: 'import',
        quantity: 0,
        notes: '',
        performed_by: '',
      });
      loadData();
      alert('Transaction recorded successfully!');
    } catch (err) {
      alert('Error recording transaction: ' + err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) return <div style={styles.container}><p>Loading...</p></div>;

  return (
    <div style={styles.container}>
      <h2>Import/Export Tracking</h2>

      <Card title="Record Transaction">
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
            <select
              name="item_id"
              value={formData.item_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Item *</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} (Current: {item.quantity})
                </option>
              ))}
            </select>

            <select
              name="transaction_type"
              value={formData.transaction_type}
              onChange={handleChange}
            >
              <option value="import">Import (Incoming)</option>
              <option value="export">Export (Outgoing)</option>
            </select>
          </div>

          <div style={styles.formRow}>
            <input
              type="number"
              name="quantity"
              placeholder="Quantity *"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="1"
            />
            <input
              type="text"
              name="performed_by"
              placeholder="Performed By (Name/ID)"
              value={formData.performed_by}
              onChange={handleChange}
            />
          </div>

          <textarea
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={handleChange}
            style={styles.textarea}
          />

          <button type="submit" style={styles.submitButton}>
            Record Transaction
          </button>
        </form>
      </Card>

      <Card title={`Transaction History (${transactions.length})`}>
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHead}>
                <th>Item</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Performed By</th>
                <th>Date/Time</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 50).map((trans) => (
                <tr key={trans.id} style={styles.tableRow}>
                  <td>{trans.item_name || 'Unknown'}</td>
                  <td style={trans.transaction_type === 'import' ? { color: 'green' } : { color: 'red' }}>
                    {trans.transaction_type.toUpperCase()}
                  </td>
                  <td>{trans.quantity}</td>
                  <td>{trans.performed_by_name || trans.performed_by || '-'}</td>
                  <td>{new Date(trans.performed_at).toLocaleString()}</td>
                  <td>{trans.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  textarea: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    minHeight: '80px',
    fontFamily: 'inherit',
  },
  submitButton: {
    background: '#007bff',
    width: 'fit-content',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
    fontSize: '14px',
  },
  tableHead: {
    backgroundColor: '#f0f0f0',
    borderBottom: '2px solid #ddd',
  },
  tableRow: {
    borderBottom: '1px solid #ddd',
  },
};
