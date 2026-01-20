import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SelectRole.css';

const SelectRole = ({ setUser }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState('candidate');

  const handleFinalize = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/finalize-role', {
        googleData: state.googleData,
        role: role
      });
      localStorage.setItem('token', res.data.sessionToken);
      setUser(res.data.user);
      // Navigate to the role-specific dashboard
      navigate(`/${res.data.user.role}-dashboard`);
    } catch (err) {
      alert("Error saving role selection. Please try again.");
    }
  };

  return (
    <div className="role-container">
      <div className="role-card">
        <h2 className="role-title">Welcome!</h2>
        <p className="role-subtitle">Please select your role to continue to the Job Portal</p>
        
        <div className="role-grid">
          <div 
            className={`role-box ${role === 'candidate' ? 'active' : ''}`}
            onClick={() => setRole('candidate')}
          >
            <div className="role-icon">👤</div>
            <h3>Candidate</h3>
            <p>I am looking for a job</p>
          </div>

          <div 
            className={`role-box ${role === 'company' ? 'selected' : ''}`}
            onClick={() => setRole('company')}
          >
            <div className="role-icon">🏢</div>
            <h3>Company</h3>
            <p>I am hiring talent</p>
          </div>
        </div>

        <button onClick={handleFinalize} className="confirm-btn">
          Finish Setup
        </button>
      </div>
    </div>
  );
};

export default SelectRole; // This export resolves the compilation error