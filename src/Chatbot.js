import React, { useState } from 'react';

function Chatbot({ user }) {
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi! I\'m DonateHub assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: input }]);
    setInput('');
    setLoading(true);

    try {
      const token = JSON.parse(localStorage.getItem('dms_session')).token;
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, { type: 'bot', text: data.response || 'I didn\'t understand that. Please try again.' }]);
      } else {
        setMessages(prev => [...prev, { type: 'bot', text: 'Sorry, I encountered an error. Please try again.' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { type: 'bot', text: 'Error connecting to chat service.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.chatbot}>
      <div style={styles.header}>
        <h3>🤖 DonateHub Assistant</h3>
      </div>
      
      <div style={styles.messagesContainer}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ ...styles.message, ...styles[msg.type] }}>
            <p>{msg.text}</p>
          </div>
        ))}
        {loading && <div style={styles.typing}>Typing...</div>}
      </div>

      <form onSubmit={handleSend} style={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          style={styles.input}
          disabled={loading}
        />
        <button type="submit" style={styles.sendBtn} disabled={loading}>
          Send
        </button>
      </form>
    </div>
  );
}

const styles = {
  chatbot: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    height: '500px'
  },
  header: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '15px',
    borderRadius: '8px 8px 0 0',
    borderBottom: '1px solid #ddd'
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  message: {
    padding: '10px 15px',
    borderRadius: '8px',
    maxWidth: '80%',
    wordWrap: 'break-word'
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
    color: 'white'
  },
  bot: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    color: '#333'
  },
  typing: {
    alignSelf: 'flex-start',
    padding: '10px',
    color: '#666',
    fontSize: '12px',
    fontStyle: 'italic'
  },
  inputForm: {
    display: 'flex',
    gap: '10px',
    padding: '15px',
    borderTop: '1px solid #ddd'
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  sendBtn: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600'
  }
};

export default Chatbot;
