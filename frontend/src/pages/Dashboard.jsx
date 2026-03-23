import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../api/client';
import Card from '../components/Card';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.container}><p>Loading...</p></div>;
  if (error) return <div style={styles.container}><p style={styles.error}>Error: {error}</p></div>;

  return (
    <div style={styles.container}>
      <h2>Dashboard Overview</h2>

      <div style={styles.grid}>
        <Card title="Total Items">
          <h3 style={styles.statNumber}>{stats?.totalItems || 0}</h3>
          <p>Active inventory items</p>
        </Card>

        <Card title="Total Quantity">
          <h3 style={styles.statNumber}>{stats?.totalQuantity || 0}</h3>
          <p>Units in stock</p>
        </Card>

        <Card title="Low Stock Alert">
          <h3 style={{ ...styles.statNumber, color: '#ff6b6b' }}>{stats?.lowStockCount || 0}</h3>
          <p>Items with quantity &lt; 10</p>
        </Card>

        <Card title="Expired Items">
          <h3 style={{ ...styles.statNumber, color: '#ff6b6b' }}>{stats?.expiredCount || 0}</h3>
          <p>Items past expiry date</p>
        </Card>
      </div>

      <div style={styles.grid}>
        <Card title="Recent Activity">
          {stats?.recentItems?.length > 0 ? (
            <ul style={styles.list}>
              {stats.recentItems.slice(0, 5).map((item) => (
                <li key={item.id}>
                  <strong>{item.name}</strong> - {item.category} (Qty: {item.quantity})
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent items</p>
          )}
        </Card>

        <Card title="Transactions Summary">
          <div>
            <p>Import: {stats?.transactions?.import || 0}</p>
            <p>Export: {stats?.transactions?.export || 0}</p>
          </div>
        </Card>
      </div>

      <button onClick={loadStats} style={styles.button}>
        Refresh Stats
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statNumber: {
    fontSize: '42px',
    margin: '10px 0',
    color: '#007bff',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  error: {
    color: 'red',
  },
  button: {
    marginTop: '20px',
  },
};
