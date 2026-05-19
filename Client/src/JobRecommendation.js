import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JobRecommendation.css';

const JobRecommendation = ({ user }) => {
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [appliedJobs, setAppliedJobs] = useState([]);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');

    useEffect(() => {
        const getRecommendations = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/jobs/recommendations`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("Recommendations:", res.data); // debug

                setRecommendedJobs(res.data);
                setLoading(false);

            } catch (err) {
                console.error("Recommendation Error:", err);
                setLoading(false);
            }
        };

        if (token) {
            getRecommendations();
        } else {
            setLoading(false);
        }

    }, [API_URL, token]);

    const [isApplying, setIsApplying] = useState(false); // New state

    const handleApply = async (jobId) => {
        if (!resumeFile) {
            alert("Please select a resume file.");
            return;
        }

        setIsApplying(true); // Start loading

        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('jobId', jobId);

        try {
            const res = await axios.post(`${API_URL}/api/jobs/apply/${jobId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Show the user their ATS score immediately!
            alert(`Application sent! Your ATS Match Score: ${res.data.atsScore}%`);

            setAppliedJobs(prev => [...prev, jobId]);
            setSelectedJob(null);
            setResumeFile(null);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to apply.");
        } finally {
            setIsApplying(false); // Stop loading
        }
    };

    if (loading) {
        return <div className="loader">Analyzing jobs for your profile...</div>;
    }

    return (
        <div className="recommendation-container">
            <header className="rec-header">
                <h2>Recommended for You 🎯</h2>
                <p>Welcome, {user?.name}</p>
            </header>

            <div className="job-grid">
                {recommendedJobs.length > 0 ? recommendedJobs.map((job) => (
                    <div key={job._id} className="rec-job-card">

                        {/* ✅ USE matchPercentage FROM BACKEND */}
                        <div
                            className="match-badge"
                            style={{
                                background: job.matchPercentage > 70
                                    ? '#27ae60'
                                    : job.matchPercentage > 40
                                        ? '#f39c12'
                                        : '#95a5a6'
                            }}
                        >
                            {job.matchPercentage}% Match
                        </div>

                        <div className="rec-job-info">
                            <h3>{job.title}</h3>
                            <p className="company-tag">🏢 {job.companyName}</p>
                            <p className="loc-tag">📍 {job.location} • 💰 {job.salary}</p>

                            <div className="matched-skills">
                                {job.matchedSkills?.map((s, i) => (
                                    <span key={i} className="skill-pill">{s}</span>
                                ))}
                            </div>
                        </div>

                        <button
                            className="apply-btn"
                            onClick={() => setSelectedJob(job)}
                        >
                            {appliedJobs.includes(job._id) ? "View Details" : "View Details & Apply"}
                        </button>
                    </div>
                )) : (
                    <div className="no-jobs">
                        <p>No jobs found. Try adding skills to your profile.</p>
                    </div>
                )}
            </div>

            {/* MODAL */}
            {selectedJob && (
                <div className="job-modal-overlay">
                    <div className="job-modal-content detail-modal">

                        <div className="modal-header">
                            <h2>{selectedJob.title}</h2>
                            <button
                                className="close-x"
                                onClick={() => setSelectedJob(null)}
                            >
                                &times;
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="detail-meta">
                                <span><strong>Company:</strong> {selectedJob.companyName}</span>
                                <span><strong>Location:</strong> {selectedJob.location}</span>
                                <span><strong>Salary:</strong> {selectedJob.salary}</span>
                            </div>

                            <div className="detail-description">
                                <h4>Job Description</h4>
                                <p>{selectedJob.description}</p>
                            </div>

                            <div className="mandatory-resume-section">
                                <h4>Upload Resume</h4>

                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => setResumeFile(e.target.files[0])}
                                />

                                {resumeFile && (
                                    <p>Selected: {resumeFile.name}</p>
                                )}
                            </div>

                            <div className="matched-skills-section">
                                <h4>Your Matched Skills</h4>
                                {selectedJob.matchedSkills?.map((s, i) => (
                                    <span key={i} className="skill-pill">{s}</span>
                                ))}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn-secondary"
                                onClick={() => setSelectedJob(null)}
                            >
                                Close
                            </button>

                            {appliedJobs.includes(selectedJob._id) ? (
                                <button className="btn-primary" disabled>
                                    Already Applied
                                </button>
                            ) : (
                                <button
                                    className="btn-primary"
                                    onClick={() => handleApply(selectedJob._id)}
                                >
                                    Confirm Application
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default JobRecommendation;