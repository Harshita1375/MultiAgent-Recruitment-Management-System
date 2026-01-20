import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './Login.css';

const Login = ({ setUser }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState('candidate');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  // Unified function to handle navigation based on user role
  const handlePostAuth = (user, token) => {
    localStorage.setItem('token', token);
    setUser(user);
    // Redirects to the specific dashboard based on the role stored in DB
    navigate(`/${user.role}-dashboard`);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google', {
        token: credentialResponse.credential,
        role: isSignup ? role : undefined // Only send role if signing up
      });
      handlePostAuth(res.data.user, res.data.sessionToken);
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
        role: isSignup ? role : undefined
      });
      handlePostAuth(res.data.user, res.data.sessionToken);
    } catch (err) {
      alert(err.response?.data?.message || "Authentication Failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="auth-title">{isSignup ? "Create Account" : "Welcome Back"}</h2>

        {/* Role tabs only appear when creating a new account */}
        {isSignup && (
          <div className="role-tabs">
            {['candidate', 'company', 'admin'].map((r) => (
              <button 
                key={r}
                type="button"
                className={role === r ? 'active' : ''} 
                onClick={() => setRole(r)}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleManualAuth} className="auth-form">
          {isSignup && (
            <input 
              type="text" 
              placeholder="Full Name" 
              className="auth-input"
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
            />
          )}
          <input 
            type="email" 
            placeholder="Email Address" 
            className="auth-input"
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="auth-input"
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            required 
          />
          <button type="submit" className="auth-btn">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="divider"><span>OR</span></div>

        <div className="google-wrapper">
          <GoogleLogin 
            onSuccess={handleGoogleSuccess} 
            onError={() => console.log('Login Failed')}
            text={isSignup ? "signup_with" : "signin_with"}
          />
        </div>

        <p className="toggle-link">
          {isSignup ? "Already have an account? " : "New user? "}
          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Login" : "Create an account"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;