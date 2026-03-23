import React from 'react';

export default function Card({ title, children, className }) {
  return (
    <div style={styles.card} className={className}>
      {title && <h3 style={styles.title}>{title}</h3>}
      <div style={styles.content}>{children}</div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  title: {
    margin: '0 0 15px 0',
    fontSize: '18px',
    color: '#2c3e50',
    borderBottom: '2px solid #007bff',
    paddingBottom: '10px',
  },
  content: {
    lineHeight: '1.6',
  },
};
