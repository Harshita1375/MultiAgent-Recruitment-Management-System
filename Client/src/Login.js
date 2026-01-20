import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Briefcase } from 'lucide-react';
import axios from 'axios';
import './Login.css'; // Import your new CSS file here

const Login = ({ setUser }) => {
  const navigate = useNavigate();

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google', {
        token: credentialResponse.credential,
      });

      localStorage.setItem('token', res.data.sessionToken);
      setUser(res.data.user);
      navigate('/profile');
    } catch (err) {
      console.error("Login Failed:", err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="icon-container">
          <Briefcase size={48} color="#2563eb" />
        </div>
        <h1 className="login-title">JobConnect MAS</h1>
        <p className="login-subtitle">Multi-Agent Recruitment Ecosystem</p>
        
        <div className="button-wrapper">
          <GoogleLogin 
            onSuccess={handleLoginSuccess} 
            onError={() => console.log('Login Failed')}
            theme="filled_blue"
            shape="pill"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;