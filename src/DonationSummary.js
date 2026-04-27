import React, { useState } from 'react';

function DonationSummary({ donation }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  const getAuthToken = () => {
    try {
      const session = JSON.parse(localStorage.getItem('dms_session') || '{}');
      return session.token || null;
    } catch (e) {
      return null;
    }
  };

  const generateSummary = async () => {
    setLoading(true);
    setError('');
    setSummary('');
    
    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:5000/api/ai/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          donation: donation
        })
      });

      const data = await response.json();
      if (data.success) {
        setSummary(data.summary || '');
        setShowSummary(true);
      } else {
        setError('Could not generate summary');
      }
    } catch (err) {
      setError('Error generating summary. Make sure OpenAI API key is configured.');
    } finally {
      setLoading(false);
    }
  };

  const copySummary = () => {
    navigator.clipboard.writeText(summary);
    alert('Summary copied to clipboard!');
  };

  const shareSummary = () => {
    const text = `Check out my donation: ${summary}`;
    if (navigator.share) {
      navigator.share({
        title: 'My DonateHub Donation',
        text: text
      });
    } else {
      alert('Share: ' + text);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h4>✨ AI Summary</h4>
        <p style={styles.subtitle}>Generate a shareable summary of this donation</p>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {!showSummary ? (
        <button onClick={generateSummary} style={styles.generateBtn} disabled={loading}>
          {loading ? '⏳ Generating...' : '✨ Generate Summary'}
        </button>
      ) : (
        <div style={styles.summaryBox}>
          <p style={styles.summaryText}>{summary}</p>
          <div style={styles.actions}>
            <button onClick={copySummary} style={styles.actionBtn} title="Copy to clipboard">
              📋 Copy
            </button>
            <button onClick={shareSummary} style={styles.actionBtn} title="Share">
              🔗 Share
            </button>
            <button onClick={() => setShowSummary(false)} style={styles.actionBtn} title="Generate new">
              🔄 New
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#f0f8ff',
    borderRadius: '6px',
    padding: '15px',
    border: '1px solid #b0d4ff',
    marginTop: '15px'
  },
  header: {
    marginBottom: '12px'
  },
  subtitle: {
    margin: '3px 0 0 0',
    fontSize: '12px',
    color: '#666'
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '10px',
    fontSize: '12px'
  },
  generateBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600'
  },
  summaryBox: {
    backgroundColor: 'white',
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #b0d4ff'
  },
  summaryText: {
    margin: '0 0 12px 0',
    fontSize: '13px',
    lineHeight: '1.5',
    color: '#333'
  },
  actions: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end'
  },
  actionBtn: {
    padding: '6px 12px',
    backgroundColor: '#e9ecef',
    border: '1px solid #ddd',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500'
  }
};

export default DonationSummary;
