import React, { useState, useEffect } from 'react';

function Analytics({ donations, userStats }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getAuthToken = () => {
    try {
      const session = JSON.parse(localStorage.getItem('dms_session') || '{}');
      return session.token || null;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    if (userStats) {
      fetchAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStats]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:5000/api/ai/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          stats: userStats || {}
        })
      });

      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics || {});
      } else {
        setError('Could not fetch analytics');
      }
    } catch (err) {
      setError('Error fetching analytics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3>📊 AI Analytics</h3>
        <p style={styles.subtitle}>Insights about your donation patterns</p>
      </div>

      {loading && <div style={styles.loading}>Analyzing your data...</div>}
      {error && <div style={styles.error}>{error}</div>}

      {analytics && (
        <div style={styles.analyticsContent}>
          {analytics.insight && (
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>💡 Key Insight</h4>
              <p style={styles.text}>{analytics.insight}</p>
            </div>
          )}

          {analytics.trend && (
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>📈 Donation Trend</h4>
              <p style={styles.text}>{analytics.trend}</p>
            </div>
          )}

          {analytics.recommendation && (
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>🎯 Next Steps</h4>
              <p style={styles.text}>{analytics.recommendation}</p>
            </div>
          )}

          {analytics.impact && (
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>🌟 Your Impact</h4>
              <p style={styles.text}>{analytics.impact}</p>
            </div>
          )}
        </div>
      )}

      {!loading && !analytics && (
        <div style={styles.empty}>
          <p>No analytics data yet. Start donating to see insights!</p>
        </div>
      )}

      <button onClick={fetchAnalytics} style={styles.refreshBtn} disabled={loading}>
        {loading ? '⏳ Analyzing...' : '🔄 Refresh Analytics'}
      </button>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  header: {
    marginBottom: '20px'
  },
  subtitle: {
    margin: '5px 0 0 0',
    fontSize: '12px',
    color: '#666'
  },
  loading: {
    textAlign: 'center',
    padding: '30px',
    color: '#007bff',
    backgroundColor: '#f0f8ff',
    borderRadius: '6px'
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '15px'
  },
  analyticsContent: {
    display: 'grid',
    gap: '15px',
    marginBottom: '15px'
  },
  section: {
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
    border: '1px solid #eee'
  },
  sectionTitle: {
    margin: '0 0 10px 0',
    fontSize: '15px',
    fontWeight: '600',
    color: '#333'
  },
  text: {
    margin: '0',
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#555'
  },
  empty: {
    textAlign: 'center',
    padding: '30px',
    color: '#999'
  },
  refreshBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  }
};

export default Analytics;
