import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Import all your dashboard and auth components
import Login from './Login';
import Profile from './Profile'; 
import SelectRole from './SelectRole';
import CandidateDashboard from './CandidateDashboard';
import ATSChecker from './ATSChecker';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token and restore session
          const res = await axios.get('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
        } catch (err) {
          console.error("Session verification failed");
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  // Prevents the app from flickering or redirecting while checking the token
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h3>Loading Session...</h3>
      </div>
    );
  }

  console.log("Current API URL being used:", process.env.REACT_APP_API_URL);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/select-role" element={<SelectRole setUser={setUser} />} />

        {/* Protected Routes: Redirect to / if no user session exists */}
        <Route 
          path="/candidate-dashboard" 
          element={user ? <CandidateDashboard user={user} setUser={setUser} /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/ats-checker" 
          element={user ? <ATSChecker user={user} /> : <Navigate to="/" />} 
        />

        {/* Dynamic Dashboards based on role */}
        <Route path="/company-dashboard" element={user ? <Profile user={user} /> : <Navigate to="/" />} />
        <Route path="/admin-dashboard" element={user ? <Profile user={user} /> : <Navigate to="/" />} />
        
        <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/" />} />

        {/* Catch-all: Redirect unknown paths to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;