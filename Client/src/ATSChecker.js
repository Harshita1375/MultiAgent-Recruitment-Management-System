import React, { useState } from 'react';
import axios from 'axios';
import './ATSChecker.css'; // New dedicated CSS file

const ATSChecker = () => {
    const [jobDescription, setJobDescription] = useState("");
    const [files, setFiles] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');

    const handleAnalyze = async () => {
        if (!jobDescription || files.length === 0) {
            return alert("Please provide both a JD and at least one resume.");
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('jd', jobDescription);
        files.forEach(file => formData.append('resumes', file));

        try {
            const res = await axios.post(`${API_URL}/api/ats/score`, formData, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' 
                }
            });
            setResults(res.data);
        } catch (err) {
            alert("Analysis failed. Check your NLP service.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ats-container">
            <div className="ats-card">
                <div className="ats-header">
                    <h2>📊 ATS Resume Ranker</h2>
                    <p>Local AI-powered analysis for privacy-first recruitment.</p>
                </div>

                <div className="ats-form">
                    <div className="input-group">
                        <label>Job Description</label>
                        <textarea 
                            placeholder="Paste the job requirements here..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>Upload Resumes (PDF only)</label>
                        <div className="file-upload-box">
                            <input 
                                type="file" 
                                multiple 
                                accept=".pdf"
                                onChange={(e) => setFiles(Array.from(e.target.files))}
                                id="resume-upload"
                            />
                            <p>{files.length > 0 ? `${files.length} files selected` : "Drag & drop or click to upload"}</p>
                        </div>
                    </div>

                    <button 
                        className="ats-btn" 
                        onClick={handleAnalyze}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Analyze Resumes"}
                    </button>
                </div>
            </div>

            {results.length > 0 && (
                <div className="ats-card results-card">
                    <h3>Ranking Results</h3>
                    <div className="results-list">
                        {results.map((res, index) => (
                            <div key={index} className="result-item">
                                <div className="result-info">
                                    <span className="file-name">{res.filename}</span>
                                    <span className="match-score">{res.score}% Match</span>
                                </div>
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill" 
                                        style={{ width: `${res.score}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ATSChecker;