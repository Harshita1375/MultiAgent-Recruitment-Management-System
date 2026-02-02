import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CandidateDashboard.css';

const CandidateDashboard = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const dashboardItems = [
    {
      title: "Profile Overview",
      description: "Keep your professional details up to date to attract recruiters.",
      buttonText: "Go to Profile",
      icon: "👤",
      action: () => navigate('/profile')
    },
    {
      title: "ATS Score Checker",
      description: "Analyze how well your resume matches job descriptions.",
      buttonText: "Upload Resume",
      icon: "📊",
      action: () => navigate('/ats-checker')
    },
    {
      title: "Job Recommendations",
      description: "Personalized job matches based on your tech stack.",
      buttonText: "Find Jobs",
      icon: "💼",
      action: () => alert("Job recommendations feature coming soon!")
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <nav className="dashboard-nav">
        <div className="nav-logo">TalentSync</div>
        <div className="nav-links">
          <span onClick={() => navigate('/profile')}>Profile</span>
          <span>Support</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="dashboard-header">
        <h1>Welcome, {user?.name || 'User'}!</h1>
        <p>Your portal for easy and fast job management.</p>
      </header>

      {/* Main Content Grid */}
      <main className="dashboard-grid">
        {dashboardItems.map((item, index) => (
          <div key={index} className="dashboard-card">
            <div className="card-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <button onClick={item.action} className="card-btn">
              {item.buttonText}
            </button>
          </div>
        ))}
      </main>
    </div>
  );
};

export default CandidateDashboard;