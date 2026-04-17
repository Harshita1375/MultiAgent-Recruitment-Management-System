import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JobPostForm.css';

const JobPostForm = ({ isOpen, onClose, fetchJobs, editJobData }) => {
    const [formData, setFormData] = useState({
        title: '',
        companyName: '',
        location: '',
        salary: '',
        description: '',
        jobType: 'Full-time'
    });

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');

    // Populate form if we are in "Edit Mode"
    useEffect(() => {
        if (editJobData) {
            setFormData(editJobData);
        } else {
            setFormData({ title: '', companyName: '', location: '', salary: '', description: '', jobType: 'Full-time' });
        }
    }, [editJobData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            if (editJobData) {
                // Update existing job
                await axios.put(`${API_URL}/api/jobs/${editJobData._id}`, formData, config);
            } else {
                // Create new job
                await axios.post(`${API_URL}/api/jobs`, formData, config);
            }
            
            fetchJobs(); // Refresh the list in dashboard
            onClose();   // Close modal
        } catch (err) {
            alert("Error saving job posting.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="job-modal-overlay">
            <div className="job-modal-content">
                <header className="modal-header">
                    <h2>{editJobData ? "Edit Job Posting" : "Create New Job"}</h2>
                    <button className="close-x" onClick={onClose}>&times;</button>
                </header>

                <form onSubmit={handleSubmit} className="job-post-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Job Title</label>
                            <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Senior React Developer" />
                        </div>
                        <div className="form-group">
                            <label>Company Name</label>
                            <input type="text" required value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} placeholder="Mirror Chaos Tech" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Location</label>
                            <input type="text" required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="Jamshedpur / Remote" />
                        </div>
                        <div className="form-group">
                            <label>Salary Range</label>
                            <input type="text" required value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} placeholder="₹8L - ₹12L PA" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Job Description</label>
                        <textarea 
                            required 
                            rows="6" 
                            value={formData.description} 
                            onChange={(e) => setFormData({...formData, description: e.target.value})} 
                            placeholder="Enter job requirements, responsibilities, and benefits..."
                        ></textarea>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary">
                            {editJobData ? "Update Job" : "Publish Job"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobPostForm;