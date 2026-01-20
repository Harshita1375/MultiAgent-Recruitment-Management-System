import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './Login.css';

const Login = ({ setUser }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState('candidate'); // Default role
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google', {
        token: credentialResponse.credential,
        role: role // Send the selected role to the backend
      });

      localStorage.setItem('token', res.data.sessionToken);
      setUser(res.data.user);
      navigate('/profile');
    } catch (err) {
      console.error("Google Auth Failed", err);
    }
  };

  const handleManualAuth = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? 'register' : 'login';
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, {
        ...formData,
        role
      });
      localStorage.setItem('token', res.data.sessionToken);
      setUser(res.data.user);
      navigate('/profile');
    } catch (err) {
      alert("Authentication Failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>
        
        {/* Role Selection Tabs */}
        <div className="role-tabs">
          {['candidate', 'company', 'admin'].map((r) => (
            <button 
              key={r}
              className={role === r ? 'active' : ''} 
              onClick={() => setRole(r)}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleManualAuth}>
          {isSignup && (
            <input 
              type="text" 
              placeholder="Full Name" 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
            />
          )}
          <input 
            type="email" 
            placeholder="Email" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            required 
          />
          <button type="submit" className="auth-btn">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="divider"><span>OR</span></div>

        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.log('Error')} />

        <p className="toggle-link" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "Already have an account? Login" : "New user? Create an account"}
        </p>
      </div>
    </div>
  );
};

export default Login;