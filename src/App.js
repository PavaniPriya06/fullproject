import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles.css';
import Register from './Register.js';
import Login from './Login.js';
import Dashboard from './Dashboard.js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const session = localStorage.getItem('dms_session');
    if (session) {
      try {
        const userData = JSON.parse(session);
        setIsLoggedIn(true);
        setUser(userData);
      } catch (e) {
        setIsLoggedIn(false);
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route 
          path="/" 
          element={isLoggedIn ? <Dashboard user={user} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/dashboard" 
          element={isLoggedIn ? <Dashboard user={user} /> : <Navigate to="/login" />} 
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
