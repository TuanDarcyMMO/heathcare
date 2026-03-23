import React from 'react';

export default function Navbar() {
  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <h1 style={styles.title}>🏥 Healthcare Inventory System</h1>
        <ul style={styles.menu}>
          <li><a href="/">Dashboard</a></li>
          <li><a href="/inventory">Inventory</a></li>
          <li><a href="/transactions">Transactions</a></li>
          <li><a href="/activity">Activity</a></li>
        </ul>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '15px 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: '24px',
  },
  menu: {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    gap: '30px',
  },
};
