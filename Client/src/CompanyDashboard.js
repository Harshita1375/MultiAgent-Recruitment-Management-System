import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import './CompanyDashboard.css';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CompanyDashboard = ({ user, handleLogout }) => {
    const stats = [
        { label: "My Companies", count: "05", icon: "🏛️", color: "#27ae60" },
        { label: "My Jobs", count: "08", icon: "💼", color: "#2980b9" },
        { label: "Applied Resumes", count: "03", icon: "📄", color: "#f39c12" },
        { label: "Active Postings", count: "01", icon: "✨", color: "#e74c3c" }
    ];

    const jobsData = [
        { title: "Green Development Marketer", location: "Jamshedpur", salary: "₹50k-70k", candidates: 15, status: "Full Time" },
        { title: "AI Research Scientist", location: "Remote", salary: "₹1.2L-1.5L", candidates: 7, status: "Full Time" }
    ];

    // Chart Data Config
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Applications',
                data: [30, 90, 45, 80, 55, 95],
                borderColor: '#2980b9',
                backgroundColor: 'rgba(41, 128, 185, 0.2)',
                tension: 0.4, // This creates the "wavy" look from your image
            },
            {
                label: 'Interviews',
                data: [10, 40, 20, 60, 30, 70],
                borderColor: '#f39c12',
                backgroundColor: 'rgba(243, 156, 18, 0.2)',
                tension: 0.4,
            }
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    return (
        <div className="hq-company-dashboard">
            <header className="hq-top-nav">
                <div className="hq-brand-container">
                    <span className="hq-brand-icon">🚀</span>
                    <span className="hq-brand-name">MIRROR CHAOS</span>
                </div>
                <div className="hq-nav-links">
                    <span>Home</span>
                    <span>Dashboard</span>
                    <span>Candidates</span>
                </div>
                <div className="hq-profile-actions">
                    <button className="hq-post-job-btn">+ Post Job</button>
                    <button className="hq-logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </header>

            <div className="hq-header-banner">
                <h2>Employer Dashboard</h2>
                <p>Welcome back, {user?.name || "Admin"}</p>
            </div>

            <div className="hq-dashboard-main-area">
                <aside className="hq-sidebar">
                    <div className="hq-admin-card">
                        <img src={user?.profilePicture || '/default-avatar.png'} alt="Profile" className="hq-sidebar-avatar" />
                        <h4>{user?.name}</h4>
                    </div>
                    <nav className="hq-sidebar-nav">
                        <button className="sidebar-link active-link">➕ Create a Post</button>
                        <button className="sidebar-link">📊 Active Jobs</button>
                        <button className="sidebar-link">🗓️ Schedule Interview</button>
                        <button className="sidebar-link">📩 Messages</button>
                    </nav>
                </aside>

                <main className="hq-content">
                    <section className="hq-stats-row">
                        {stats.map((stat, i) => (
                            <div key={i} className="hq-stat-widget" style={{ borderColor: stat.color }}>
                                <div className="stat-widget-main" style={{ color: stat.color }}>
                                    <div className="stat-icon-wrapper">{stat.icon}</div>
                                    <div className="stat-num-wrapper">
                                        <h3>{stat.count}</h3>
                                        <p>{stat.label}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* NEW: Statistics Chart Section */}
                    <section className="hq-card chart-section">
                        <h3>Recruitment Analytics</h3>
                        <div className="chart-container">
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </section>

                    <section className="hq-card hq-jobs-card">
                        <div className="hq-card-header">
                            <h3>My Jobs</h3>
                        </div>
                        <div className="hq-jobs-list">
                            {jobsData.map((job, i) => (
                                <div key={i} className="hq-job-listing-item">
                                    <div className="job-meta-main">
                                        <div className="job-brand-icon">{job.title.charAt(0)}</div>
                                        <div className="job-details-text">
                                            <span className="job-status-tag">{job.status}</span>
                                            <h4>{job.title}</h4>
                                            <p>{job.location} • {job.salary}</p>
                                        </div>
                                    </div>
                                    <div className="applicant-pill">Resumes (<b>{job.candidates}</b>)</div>
                                    <div className="job-actions">
                                        <button className="job-action-icon">✎</button>
                                        <button className="job-action-icon">🗑</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default CompanyDashboard;