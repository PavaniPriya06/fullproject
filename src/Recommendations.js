import React, { useState, useEffect } from 'react';

function Recommendations({ donations }) {
  const [recommendations, setRecommendations] = useState([]);
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
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [donations]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:5000/api/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          donationHistory: donations || []
        })
      });

      const data = await response.json();
      if (data.success) {
        setRecommendations(data.recommendations || []);
      } else {
        setError('Could not fetch recommendations');
      }
    } catch (err) {
      setError('Error fetching recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3>💡 AI Recommendations</h3>
        <p style={styles.subtitle}>Personalized donation suggestions</p>
      </div>

      {loading && <div style={styles.loading}>Generating recommendations...</div>}
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.content}>
        {recommendations.length === 0 && !loading && (
          <p style={styles.empty}>No recommendations yet. Start making donations!</p>
        )}

        {recommendations.map((rec, idx) => (
          <div key={idx} style={styles.card}>
            <div style={styles.icon}>
              {rec.type === 'food' && '🍚'}
              {rec.type === 'apparel' && '👕'}
              {rec.type === 'money' && '💰'}
            </div>
            <div style={styles.content}>
              <h4 style={styles.title}>{rec.type?.charAt(0).toUpperCase() + rec.type?.slice(1)} Donation</h4>
              <p style={styles.reason}>{rec.reason || 'This donation would help make a difference'}</p>
              {rec.amount && <p style={styles.amount}>Amount: ₹{rec.amount}</p>}
              {rec.details && <p style={styles.details}>{rec.details}</p>}
            </div>
          </div>
        ))}
      </div>

      <button onClick={fetchRecommendations} style={styles.refreshBtn} disabled={loading}>
        {loading ? '⏳ Generating...' : '🔄 Refresh'}
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
    padding: '20px',
    color: '#007bff'
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px'
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '15px',
    marginBottom: '15px'
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    padding: '20px'
  },
  card: {
    display: 'flex',
    gap: '15px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
    border: '1px solid #eee'
  },
  icon: {
    fontSize: '32px',
    minWidth: '40px'
  },
  cardContent: {
    flex: 1
  },
  title: {
    margin: '0 0 5px 0',
    fontSize: '16px',
    fontWeight: '600'
  },
  reason: {
    margin: '0 0 8px 0',
    fontSize: '14px',
    color: '#555'
  },
  amount: {
    margin: '0 0 5px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#28a745'
  },
  details: {
    margin: '0',
    fontSize: '13px',
    color: '#777'
  },
  refreshBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  }
};

export default Recommendations;
