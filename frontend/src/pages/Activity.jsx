import React, { useEffect, useState } from 'react';
import { activityAPI } from '../api/client';
import Card from '../components/Card';

export default function Activity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const response = await activityAPI.getAll();
      setActivities(response.data);
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
      <h2>Activity Logs</h2>

      <Card title={`Recent Activities (${activities.length})`}>
        {activities.length === 0 ? (
          <p>No activities recorded yet.</p>
        ) : (
          <div>
            {activities.slice(0, 100).map((activity) => (
              <div key={activity.id} style={styles.activityItem}>
                <div style={styles.activityHeader}>
                  <strong>{activity.action || 'Unknown'}</strong>
                  <span style={styles.timestamp}>
                    {new Date(activity.created_at).toLocaleString()}
                  </span>
                </div>
                <p style={styles.activityDetails}>
                  {activity.username && <span>User: {activity.username} | </span>}
                  {activity.entity_type && <span>Entity: {activity.entity_type} | </span>}
                  {activity.entity_id && <span>ID: {activity.entity_id}</span>}
                </p>
                {activity.details && (
                  <p style={styles.details}>{activity.details}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <button onClick={loadActivities} style={styles.button}>
        Refresh Activities
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
  activityItem: {
    borderLeft: '4px solid #007bff',
    paddingLeft: '15px',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee',
  },
  activityHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: '12px',
    color: '#666',
  },
  activityDetails: {
    fontSize: '13px',
    color: '#888',
    margin: '5px 0',
  },
  details: {
    fontSize: '12px',
    color: '#999',
    fontStyle: 'italic',
  },
  button: {
    marginTop: '20px',
  },
  error: {
    color: 'red',
  },
};
