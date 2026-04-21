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
import JobApplications from './JobApplications';
import InterviewScheduler from './InterviewScheduler'; // 1. ADD THIS IMPORT

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
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
        <h3>TalentSync Loading Session...</h3>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/select-role" element={<SelectRole setUser={setUser} />} />

        {/* Candidate Routes */}
        <Route
          path="/candidate-dashboard"
          element={user && user.role === 'candidate' ? <CandidateDashboard user={user} setUser={setUser} /> : <Navigate to="/" />}
        />
        <Route path="/recommendations" element={user ? <JobRecommendation /> : <Navigate to="/" />} />
        <Route
          path="/ats-checker"
          element={user && user.role === 'candidate' ? <ATSChecker user={user} /> : <Navigate to="/" />}
        />

        {/* 2. ADD THE MAIN COMPANY DASHBOARD ROUTE BACK */}
        <Route
          path="/company-dashboard"
          element={user && user.role === 'company' ? <CompanyDashboard user={user} handleLogout={handleLogout} /> : <Navigate to="/" />}
        />

        {/* 3. Company Specific Routes */}
        <Route
          path="/company/scheduler"
          element={user && user.role === 'company' ? <InterviewScheduler /> : <Navigate to="/" />}
        />

        <Route
          path="/job/:jobId/applications"
          element={user && user.role === 'company' ? <JobApplications /> : <Navigate to="/" />}
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