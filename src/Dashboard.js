import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chatbot from './Chatbot';
import Recommendations from './Recommendations';
import Analytics from './Analytics';
import Scanner from './Scanner';

function Dashboard({ user }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('food');
  const [foodData, setFoodData] = useState({
    riceQty: '',
    vegQty: '',
    fruitsQty: '',
    trustId: ''
  });
  const [apparelData, setApparelData] = useState({
    targetAge: ''
  });
  const [moneyData, setMoneyData] = useState({
    amount: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedQRData, setScannedQRData] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('dms_session');
    navigate('/login');
  };

  const handleFoodChange = (e) => {
    const { name, value } = e.target;
    setFoodData(prev => ({ ...prev, [name]: value }));
  };

  const handleApparelChange = (e) => {
    const { name, value } = e.target;
    setApparelData(prev => ({ ...prev, [name]: value }));
  };

  const handleMoneyChange = (e) => {
    const { name, value } = e.target;
    setMoneyData(prev => ({ ...prev, [name]: value }));
  };

  const handleScannedData = (data) => {
    setScannedQRData(data);
    setMessage({ type: 'success', text: `QR Code Scanned: ${data}` });
    // You can parse the QR data and auto-fill forms here
    setShowScanner(false);
  };

  const submitFoodDonation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = JSON.parse(localStorage.getItem('dms_session')).token;
      const response = await fetch('http://localhost:5000/api/donations/food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          riceQty: parseInt(foodData.riceQty),
          vegQty: parseInt(foodData.vegQty),
          fruitsQty: parseInt(foodData.fruitsQty),
          trustId: foodData.trustId
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'Food donation created successfully!' });
        setFoodData({ riceQty: '', vegQty: '', fruitsQty: '', trustId: '' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to create donation' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  const submitApparelDonation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = JSON.parse(localStorage.getItem('dms_session')).token;
      const response = await fetch('http://localhost:5000/api/donations/apparel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          targetAge: parseInt(apparelData.targetAge)
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'Apparel donation created successfully!' });
        setApparelData({ targetAge: '' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to create donation' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  const submitMoneyDonation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = JSON.parse(localStorage.getItem('dms_session')).token;
      const response = await fetch('http://localhost:5000/api/donations/money', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(moneyData.amount)
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'Money donation created successfully!' });
        setMoneyData({ amount: '' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to create donation' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1>DonateHub - Donation Dashboard</h1>
        <div style={styles.userInfo}>
          <span>Welcome, {user?.user?.fullName || 'User'}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{...styles.tab, ...(activeTab === 'food' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('food')}
        >
          🍚 Food Donation
        </button>
        <button
          style={{...styles.tab, ...(activeTab === 'apparel' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('apparel')}
        >
          👕 Apparel Donation
        </button>
        <button
          style={{...styles.tab, ...(activeTab === 'money' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('money')}
        >
          💰 Money Donation
        </button>
        <button
          style={{...styles.tab, ...(activeTab === 'ai' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('ai')}
        >
          🤖 AI Tools
        </button>
        <button
          style={{...styles.tab, ...(activeTab === 'scanner' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('scanner')}
        >
          📱 QR Scanner
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div style={{...styles.message, backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da'}}>
          {message.text}
        </div>
      )}

      {/* Forms */}
      <div style={styles.content}>
        {activeTab === 'food' && (
          <form onSubmit={submitFoodDonation} style={styles.form}>
            <h2>Food Donation</h2>
            <div style={styles.formGroup}>
              <label>Rice Quantity (kg)</label>
              <input type="number" name="riceQty" value={foodData.riceQty} onChange={handleFoodChange} required />
            </div>
            <div style={styles.formGroup}>
              <label>Vegetables Quantity (kg)</label>
              <input type="number" name="vegQty" value={foodData.vegQty} onChange={handleFoodChange} required />
            </div>
            <div style={styles.formGroup}>
              <label>Fruits Quantity (kg)</label>
              <input type="number" name="fruitsQty" value={foodData.fruitsQty} onChange={handleFoodChange} required />
            </div>
            <div style={styles.formGroup}>
              <label>Organization/Trust ID</label>
              <input type="text" name="trustId" value={foodData.trustId} onChange={handleFoodChange} required />
            </div>
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Food Donation'}
            </button>
          </form>
        )}

        {activeTab === 'apparel' && (
          <form onSubmit={submitApparelDonation} style={styles.form}>
            <h2>Apparel Donation</h2>
            <div style={styles.formGroup}>
              <label>Target Age Group</label>
              <select name="targetAge" value={apparelData.targetAge} onChange={handleApparelChange} required>
                <option value="">Select age group</option>
                <option value="10">Children (10 years)</option>
                <option value="19">Teenagers (13-19 years)</option>
                <option value="20">Young Adults (20-25 years)</option>
                <option value="30">Adults (30-40 years)</option>
                <option value="45">Senior (45+ years)</option>
              </select>
            </div>
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Apparel Donation'}
            </button>
          </form>
        )}

        {activeTab === 'money' && (
          <form onSubmit={submitMoneyDonation} style={styles.form}>
            <h2>Money Donation</h2>
            <div style={styles.formGroup}>
              <label>Amount (₹)</label>
              <input type="number" name="amount" value={moneyData.amount} onChange={handleMoneyChange} step="0.01" min="0.01" required />
            </div>
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Money Donation'}
            </button>
          </form>
        )}

        {activeTab === 'ai' && (
          <div style={styles.aiContainer}>
            <div style={styles.aiGrid}>
              <div style={styles.aiSection}>
                <Chatbot user={user?.user} />
              </div>
              <div style={styles.aiSection}>
                <Recommendations donations={[]} />
              </div>
            </div>
            <div style={styles.aiSection}>
              <Analytics donations={[]} userStats={{}} />
            </div>
          </div>
        )}

        {activeTab === 'scanner' && (
          <div style={styles.form}>
            <h2>QR Code Scanner</h2>
            <p style={{ marginBottom: '20px', color: '#666' }}>Scan QR codes to quickly fill donation data or retrieve information</p>
            <button 
              onClick={() => setShowScanner(true)}
              style={{...styles.submitBtn, marginBottom: '20px'}}
            >
              📱 Open Scanner
            </button>
            
            {scannedQRData && (
              <div style={styles.scannedDataBox}>
                <h3>Last Scanned Data:</h3>
                <p style={styles.scannedText}>{scannedQRData}</p>
              </div>
            )}

            <div style={styles.instructionBox}>
              <h3>How to use:</h3>
              <ul>
                <li>Click "Open Scanner" button</li>
                <li>Allow camera access when prompted</li>
                <li>Point camera at QR code</li>
                <li>Data will be automatically scanned</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {showScanner && (
        <Scanner 
          onScan={handleScannedData}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#3d5a6c',
    color: 'white',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  userInfo: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  },
  logoutBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    padding: '20px',
    backgroundColor: 'white',
    borderBottom: '1px solid #ddd',
    overflowX: 'auto'
  },
  tab: {
    padding: '10px 20px',
    border: 'none',
    backgroundColor: '#e9ecef',
    cursor: 'pointer',
    borderRadius: '4px',
    whiteSpace: 'nowrap'
  },
  activeTab: {
    backgroundColor: '#007bff',
    color: 'white'
  },
  message: {
    margin: '20px',
    padding: '15px',
    borderRadius: '4px',
    textAlign: 'center'
  },
  content: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  aiContainer: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  aiGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px'
  },
  aiSection: {
    minHeight: 'auto'
  },
  form: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  formGroup: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column'
  },
  submitBtn: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600'
  },
  scannedDataBox: {
    backgroundColor: '#d4edda',
    border: '1px solid #c3e6cb',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px'
  },
  scannedText: {
    fontFamily: 'monospace',
    fontSize: '14px',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '4px',
    marginTop: '10px',
    wordBreak: 'break-all'
  },
  instructionBox: {
    backgroundColor: '#e7f3ff',
    border: '1px solid #b3d9ff',
    borderRadius: '8px',
    padding: '20px',
    color: '#004085'
  }
};

export default Dashboard;
