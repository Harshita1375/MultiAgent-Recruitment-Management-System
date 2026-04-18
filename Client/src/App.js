import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Import your components
import Login from './Login';
import Profile from './Profile'; 
import SelectRole from './SelectRole';
import CandidateDashboard from './CandidateDashboard';
import ATSChecker from './ATSChecker';
import CompanyDashboard from './CompanyDashboard'; 
import JobRecommendation from './JobRecommendation';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use environment variable for the API
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // 2. Updated to use the dynamic API_URL instead of localhost
          const res = await axios.get(`${API_URL}/api/auth/me`, {
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
  }, [API_URL]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h3>Mirror Chaos: Loading Session...</h3>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/select-role" element={<SelectRole setUser={setUser} />} />

        {/* 3. Candidate Specific Routes */}
        <Route 
          path="/candidate-dashboard" 
          element={user && user.role === 'candidate' ? <CandidateDashboard user={user} setUser={setUser} /> : <Navigate to="/" />} 
        />
        <Route path="/recommendations" element={user ? <JobRecommendation /> : <Navigate to="/" />} />
        
        <Route 
          path="/ats-checker" 
          element={user && user.role === 'candidate' ? <ATSChecker user={user} /> : <Navigate to="/" />} 
        />

        {/* 4. Company Specific Route - Only opens CompanyDashboard if role is 'company' */}
        <Route 
          path="/company-dashboard" 
          element={user && user.role === 'company' ? <CompanyDashboard user={user} /> : <Navigate to="/" />} 
        />

        {/* General Protected Routes */}
        <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/" />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;