import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import Register from './components/Register';
import Login from './components/Login';
import '../css/admin-dashboard.css';

/**
 * Main App Component
 * Entry point for the React application
 */
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
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route 
            path="/" 
            element={isLoggedIn ? <AdminDashboard user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/dashboard" 
            element={isLoggedIn ? <AdminDashboard user={user} /> : <Navigate to="/login" />} 
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
