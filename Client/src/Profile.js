import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = ({ user }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // modalConfig now tracks if we are editing and which item ID
    const [modalConfig, setModalConfig] = useState({ 
        type: null, 
        isOpen: false, 
        isEdit: false, 
        id: null 
    });

    // Unified form state for all sections
    const [formData, setFormData] = useState({
        school: '', degree: '', year: '', toYear: '', // Education
        company: '', role: '', from: '', to: '', description: '', // Experience
        name: '', issuingOrganization: '', issueDate: '', credentialUrl: '' // Certs
    });

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` }; //

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/profile/me`, { headers });
            setProfile(res.data);
        } catch (err) {
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProfile(); }, []);

    // Function to handle Deletion
    const handleDelete = async (collection, itemId) => {
        if (window.confirm("Are you sure you want to delete this entry?")) {
            try {
                await axios.delete(`${API_URL}/api/profile/${collection}/${itemId}`, { headers });
                fetchProfile();
            } catch (err) {
                alert("Failed to delete item.");
            }
        }
    };

    // Unified Submit for Add AND Edit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { type, isEdit, id } = modalConfig;
        const collection = type === 'exp' ? 'experience' : type === 'edu' ? 'education' : 'certifications';
        
        try {
            if (isEdit) {
                // PUT to a specific item ID for editing
                await axios.put(`${API_URL}/api/profile/${collection}/${id}`, formData, { headers });
            } else {
                // Standard PUT to add a new item to the array
                await axios.put(`${API_URL}/api/profile/${collection}`, formData, { headers });
            }
            setModalConfig({ type: null, isOpen: false, isEdit: false, id: null });
            fetchProfile();
        } catch (err) {
            alert("Error saving data. Please try again.");
        }
    };

    const openModal = (type, isEdit = false, item = null) => {
        if (isEdit && item) {
            // Populate form with existing data for editing
            setFormData({
                ...item,
                from: item.from ? item.from.split('T')[0] : '',
                to: item.to ? item.to.split('T')[0] : '',
                issueDate: item.issueDate ? item.issueDate.split('T')[0] : ''
            });
            setModalConfig({ type, isOpen: true, isEdit: true, id: item._id });
        } else {
            setFormData({}); // Clear form for new entry
            setModalConfig({ type, isOpen: true, isEdit: false, id: null });
        }
    };

    if (loading) return <div className="loader">Loading...</div>;

    if (!profile) {
        return (
            <div className="setup-container">
                <div className="profile-card setup-box">
                    <h2>Welcome, {user?.name}!</h2>
                    <p>Start your professional profile by adding your education details.</p>
                    <button className="save-btn" onClick={() => openModal('edu')}>Add Education</button>
                </div>
                {modalConfig.isOpen && renderModal()}
            </div>
        );
    }

    return (
        <div className="profile-page">
            <header className="profile-card profile-header">
                <div className="cover-photo"></div>
                <div className="header-body">
                    <div className="avatar-circle">👤</div>
                    <h2>{user?.name || "User"}</h2>
                    <p className="headline">Final-Year B.Tech CSE || Full-Stack Developer</p>
                </div>
            </header>

            {/* Experience Section */}
            <section className="profile-card section-padding">
                <div className="section-title-row">
                    <h3>Experience</h3>
                    <button className="icon-btn" onClick={() => openModal('exp')}>+</button>
                </div>
                {profile.experience?.map((exp, i) => (
                    <div key={i} className="list-row">
                        <div className="entity-icon">💼</div>
                        <div className="list-content">
                            <h4>{exp.role}</h4>
                            <p>{exp.company}</p>
                            <span className="sub-text">
                                {exp.from ? new Date(exp.from).toLocaleDateString() : 'N/A'} - {exp.to ? new Date(exp.to).toLocaleDateString() : 'Present'}
                            </span>
                            <p className="description-text">{exp.description}</p>
                        </div>
                        <div className="item-actions">
                            <button className="edit-btn" onClick={() => openModal('exp', true, exp)}>✎</button>
                            <button className="delete-btn" onClick={() => handleDelete('experience', exp._id)}>🗑</button>
                        </div>
                    </div>
                ))}
            </section>

            {/* Education Section */}
            <section className="profile-card section-padding">
                <div className="section-title-row">
                    <h3>Education</h3>
                    <button className="icon-btn" onClick={() => openModal('edu')}>+</button>
                </div>
                {profile.education?.map((edu, i) => (
                    <div key={i} className="list-row">
                        <div className="entity-icon">🎓</div>
                        <div className="list-content">
                            <h4>{edu.school}</h4>
                            <p>{edu.degree} • {edu.year} - {edu.toYear || 'Present'}</p>
                        </div>
                        <div className="item-actions">
                            <button className="edit-btn" onClick={() => openModal('edu', true, edu)}>✎</button>
                            <button className="delete-btn" onClick={() => handleDelete('education', edu._id)}>🗑</button>
                        </div>
                    </div>
                ))}
            </section>

            {/* Licenses & Certifications Section */}
            <section className="profile-card section-padding">
                <div className="section-title-row">
                    <h3>Licenses & certifications</h3>
                    <button className="icon-btn" onClick={() => openModal('cert')}>+</button>
                </div>
                {profile.certifications?.map((cert, i) => (
                    <div key={i} className="list-row">
                        <div className="entity-icon">📜</div>
                        <div className="list-content">
                            <h4>{cert.name}</h4>
                            <p>{cert.issuingOrganization}</p>
                            {cert.credentialUrl && <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="cert-link">Show credential</a>}
                        </div>
                        <div className="item-actions">
                            <button className="edit-btn" onClick={() => openModal('cert', true, cert)}>✎</button>
                            <button className="delete-btn" onClick={() => handleDelete('certifications', cert._id)}>🗑</button>
                        </div>
                    </div>
                ))}
            </section>

            {modalConfig.isOpen && renderModal()}
        </div>
    );

    function renderModal() {
        const { type, isEdit } = modalConfig;
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h3>{isEdit ? 'Edit' : 'Add'} {type === 'exp' ? 'Experience' : type === 'edu' ? 'Education' : 'Certification'}</h3>
                    <form onSubmit={handleSubmit} className="profile-form">
                        
                        {type === 'exp' && (
                            <>
                                <input type="text" placeholder="Role" required value={formData.role || ''} onChange={e => setFormData({...formData, role: e.target.value})} />
                                <input type="text" placeholder="Company" required value={formData.company || ''} onChange={e => setFormData({...formData, company: e.target.value})} />
                                <div className="date-row">
                                    <div className="date-input">
                                        <label>Start Date</label>
                                        <input type="date" required value={formData.from || ''} onChange={e => setFormData({...formData, from: e.target.value})} />
                                    </div>
                                    <div className="date-input">
                                        <label>End Date</label>
                                        <input type="date" value={formData.to || ''} onChange={e => setFormData({...formData, to: e.target.value})} />
                                    </div>
                                </div>
                                <textarea placeholder="Job Description" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
                            </>
                        )}

                        {type === 'edu' && (
                            <>
                                <input type="text" placeholder="University" required value={formData.school || ''} onChange={e => setFormData({...formData, school: e.target.value})} />
                                <input type="text" placeholder="Degree" required value={formData.degree || ''} onChange={e => setFormData({...formData, degree: e.target.value})} />
                                <div className="date-row">
                                    <input type="text" placeholder="Start Year" value={formData.year || ''} onChange={e => setFormData({...formData, year: e.target.value})} />
                                    <input type="text" placeholder="End Year" value={formData.toYear || ''} onChange={e => setFormData({...formData, toYear: e.target.value})} />
                                </div>
                            </>
                        )}

                        {type === 'cert' && (
                            <>
                                <input type="text" placeholder="Certification Name" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                                <input type="text" placeholder="Issuing Organization" required value={formData.issuingOrganization || ''} onChange={e => setFormData({...formData, issuingOrganization: e.target.value})} />
                                <label>Issue Date</label>
                                <input type="date" value={formData.issueDate || ''} onChange={e => setFormData({...formData, issueDate: e.target.value})} />
                                <input type="url" placeholder="Credential URL" value={formData.credentialUrl || ''} onChange={e => setFormData({...formData, credentialUrl: e.target.value})} />
                            </>
                        )}

                        <div className="modal-actions">
                            <button type="button" className="cancel-btn" onClick={() => setModalConfig({ isOpen: false })}>Cancel</button>
                            <button type="submit" className="save-btn">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
};

export default Profile;