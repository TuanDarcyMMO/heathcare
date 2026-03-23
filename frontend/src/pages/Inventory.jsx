import React, { useEffect, useState } from 'react';
import { inventoryAPI } from '../api/client';
import Card from '../components/Card';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    unit: '',
    supplier: '',
    expiry_date: '',
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await inventoryAPI.getAll();
      setItems(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await inventoryAPI.create(formData);
      setFormData({ name: '', category: '', quantity: 0, unit: '', supplier: '', expiry_date: '' });
      loadItems();
      alert('Item added successfully!');
    } catch (err) {
      alert('Error adding item: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await inventoryAPI.delete(id);
      loadItems();
      alert('Item deleted successfully!');
    } catch (err) {
      alert('Error deleting item: ' + err.message);
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
      <h2>Inventory Management</h2>

      <Card title="Add New Item">
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
            <input
              type="text"
              name="name"
              placeholder="Item Name *"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select Category *</option>
              <option value="medicine">Medicine</option>
              <option value="equipment">Equipment</option>
              <option value="supplies">Supplies</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={styles.formRow}>
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
            />
            <input
              type="text"
              name="unit"
              placeholder="Unit (e.g., tablets, boxes)"
              value={formData.unit}
              onChange={handleChange}
            />
          </div>

          <div style={styles.formRow}>
            <input
              type="text"
              name="supplier"
              placeholder="Supplier"
              value={formData.supplier}
              onChange={handleChange}
            />
            <input
              type="date"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
            />
          </div>

          <button type="submit" style={styles.addButton}>
            Add Item
          </button>
        </form>
      </Card>

      <Card title={`Inventory Items (${items.length})`}>
        {items.length === 0 ? (
          <p>No items yet. Add one using the form above.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHead}>
                <th>Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Supplier</th>
                <th>Expiry Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={styles.tableRow}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td style={item.quantity < 10 ? { color: 'red', fontWeight: 'bold' } : {}}>
                    {item.quantity}
                  </td>
                  <td>{item.unit}</td>
                  <td>{item.supplier || '-'}</td>
                  <td>{item.expiry_date || '-'}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </td>
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
  addButton: {
    background: '#28a745',
    width: 'fit-content',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  tableHead: {
    backgroundColor: '#f0f0f0',
    borderBottom: '2px solid #ddd',
  },
  tableRow: {
    borderBottom: '1px solid #ddd',
  },
  deleteButton: {
    background: '#dc3545',
    padding: '5px 10px',
    fontSize: '12px',
  },
};
