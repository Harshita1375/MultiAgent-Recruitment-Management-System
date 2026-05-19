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

  // FIX: Define API_URL to use the environment variable
  const API_URL = process.env.REACT_APP_API_URL;

  const handlePostAuth = (user, token) => {
    localStorage.setItem('token', token);
    setUser(user);

    // Redirect specifically based on role
    if (user.role === 'company') {
        navigate('/company-dashboard');
    } else if (user.role === 'candidate') {
        navigate('/candidate-dashboard');
    } else {
        navigate('/dashboard'); // Default
    }
};

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // FIX: Use ${API_URL} instead of localhost
      const res = await axios.post(`${API_URL}/api/auth/google`, {
        token: credentialResponse.credential
      });

      if (res.data.isNewUser) {
        navigate('/select-role', { state: { googleData: res.data.googleData } });
      } else {
        localStorage.setItem('token', res.data.sessionToken);
        setUser(res.data.user);
        navigate(`/${res.data.user.role}-dashboard`);
      }
    } catch (err) {
      console.error("Google Auth Failed", err);
    }
  };

  const handleManualAuth = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? 'register' : 'login';
    try {
      // FIX: Use ${API_URL} instead of localhost
      const res = await axios.post(`${API_URL}/api/auth/${endpoint}`, {
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