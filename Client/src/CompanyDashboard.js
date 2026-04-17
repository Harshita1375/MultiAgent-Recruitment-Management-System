import React, { useState, useEffect } from 'react'; // Added useEffect
import { Line } from 'react-chartjs-2';
import axios from 'axios'; // Ensure axios is imported
import JobPostForm from './JobPostForm'; // Ensure this is imported
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CompanyDashboard = ({ user, handleLogout }) => {
    // 1. ALL HOOKS MUST BE INSIDE THE COMPONENT
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [jobs, setJobs] = useState([]);
    
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    // 2. HELPER FUNCTIONS INSIDE THE COMPONENT
    const fetchJobs = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/jobs/my-jobs`, { headers });
            setJobs(res.data);
        } catch (err) {
            console.error("Error fetching jobs:", err);
        }
    };

    // Fetch jobs on initial load
    useEffect(() => {
        fetchJobs();
    }, []);

    const handleDelete = async (jobId) => {
        if (window.confirm("Delete this job posting?")) {
            try {
                await axios.delete(`${API_URL}/api/jobs/${jobId}`, { headers });
                fetchJobs();
            } catch (err) {
                alert("Failed to delete job.");
            }
        }
    };

    const handleEdit = (job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    const handleCreateNew = () => {
        setSelectedJob(null);
        setIsModalOpen(true);
    };

    // 3. UI DATA CONFIGS
    const stats = [
        { label: "My Companies", count: "05", icon: "🏛️", color: "#27ae60" },
        { label: "My Jobs", count: jobs.length || "0", icon: "💼", color: "#2980b9" }, // Dynamic count
        { label: "Applied Resumes", count: "03", icon: "📄", color: "#f39c12" },
        { label: "Active Postings", count: "01", icon: "✨", color: "#e74c3c" }
    ];

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Applications',
                data: [30, 90, 45, 80, 55, 95],
                borderColor: '#2980b9',
                backgroundColor: 'rgba(41, 128, 185, 0.2)',
                tension: 0.4,
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
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true } }
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
                    <button className="hq-post-job-btn" onClick={handleCreateNew}>+ Post Job</button>
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
                        <button className="sidebar-link active-link" onClick={handleCreateNew}>➕ Create a Post</button>
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
                            {/* Render REAL jobs from backend */}
                            {jobs.length > 0 ? jobs.map((job, i) => (
                                <div key={i} className="hq-job-listing-item">
                                    <div className="job-meta-main">
                                        <div className="job-brand-icon">{job.title?.charAt(0)}</div>
                                        <div className="job-details-text">
                                            <span className="job-status-tag">{job.jobType || 'Full Time'}</span>
                                            <h4>{job.title}</h4>
                                            <p>{job.location} • {job.salary}</p>
                                        </div>
                                    </div>
                                    <div className="applicant-pill">Resumes (<b>{job.applicants?.length || 0}</b>)</div>
                                    <div className="job-actions">
                                        <button className="job-action-icon" onClick={() => handleEdit(job)}>✎</button>
                                        <button className="job-action-icon" onClick={() => handleDelete(job._id)}>🗑</button>
                                    </div>
                                </div>
                            )) : <p>No jobs posted yet.</p>}
                        </div>
                    </section>
                </main>
            </div>

            <JobPostForm 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                fetchJobs={fetchJobs} 
                editJobData={selectedJob} 
            />
        </div>
    );
};

export default CompanyDashboard;