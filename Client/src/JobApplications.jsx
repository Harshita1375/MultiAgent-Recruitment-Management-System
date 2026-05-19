import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './JobApplications.css';

const JobApplications = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/jobs/${jobId}/applications`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Sort by ATS score descending
                const sorted = res.data.sort((a, b) => b.atsScore - a.atsScore);
                setApplications(sorted);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching applications:", err);
                setLoading(false);
            }
        };
        fetchApplications();
    }, [jobId, API_URL, token]);

    const getScoreColor = (score) => {
        if (score >= 80) return '#27ae60'; // Green
        if (score >= 50) return '#f39c12'; // Orange
        return '#e74c3c'; // Red
    };

    if (loading) return <div className="loader">Loading Candidates...</div>;

    return (
        <div className="applications-view">
            <header className="app-header">
                <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
                <h2>Candidate Rankings</h2>
                <p>Applications for Job ID: {jobId}</p>
            </header>

            <div className="candidates-list">
                {applications.length > 0 ? applications.map((app) => (
                    <div key={app._id} className="candidate-card">
                        <div className="candidate-rank">
                            <div className="ats-circle" style={{ borderColor: getScoreColor(app.atsScore) }}>
                                <span>{app.atsScore}%</span>
                                <small>ATS</small>
                            </div>
                        </div>

                        <div className="candidate-info">
                            <h4>{app.candidate?.name}</h4>
                            <p>{app.candidate?.email}</p>
                            <span className={`status-tag ${app.status.toLowerCase()}`}>
                                {app.status}
                            </span>
                        </div>

                        <div className="candidate-actions">
                            <div className="candidate-actions">
                                <div className="candidate-actions">
                                    {/* ✅ Use app.resumeUrl here - ensure API_URL is used for the path */}
                                    <a
                                        href={app.resumeUrl?.startsWith('http') ? app.resumeUrl : `${API_URL}/${app.resumeUrl}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="view-resume-btn"
                                    >
                                        📄 View Resume
                                    </a>
                                    <button className="accept-btn">Shortlist</button>
                                    <button className="reject-btn">Reject</button>
                                </div>
                            </div>

                        </div>
                    </div>
                )) : (
                    <div className="no-apps">No candidates have applied yet.</div>
                )}
            </div>
        </div>
    );
};

export default JobApplications;