import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = ({ user }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Toggle states for different modals
    const [modalConfig, setModalConfig] = useState({ type: null, isOpen: false });

    // Individual form states
    const [eduData, setEduData] = useState({ school: '', degree: '', year: '' });
    const [expData, setExpData] = useState({ company: '', role: '', from: '', to: '', description: '' });
    const [certData, setCertData] = useState({ name: '', issuingOrganization: '', credentialUrl: '' });

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/api/profile/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProfile(res.data);
        } catch (err) {
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProfile(); }, []);

    // Reusable handler for all sub-resource updates
    const handleUpdate = async (e, endpoint, data) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/api/profile/${endpoint}`, data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setModalConfig({ type: null, isOpen: false });
            fetchProfile(); 
        } catch (err) {
            alert(`Error saving ${endpoint}`);
        }
    };

    if (loading) return <div className="loader">Loading...</div>;

    if (!profile) {
        return (
            <div className="setup-container">
                <div className="profile-card setup-box">
                    <h2>Welcome, {user?.name}!</h2>
                    <p>Build your professional presence by adding your experience and certifications.</p>
                    <button className="save-btn" onClick={() => setModalConfig({ type: 'edu', isOpen: true })}>
                        Get Started
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            {/* Header Section */}
            <header className="profile-card">
                <div className="cover-photo"></div>
                <div className="header-body">
                    <div className="avatar-circle">👤</div>
                    <h2>Harshita Tiwary</h2>
                    <p className="headline">Final-Year B.Tech CSE || Full-Stack Developer</p>
                </div>
            </header>

            {/* EXPERIENCE SECTION */}
            <section className="profile-card section-padding">
                <div className="section-title-row">
                    <h3>Experience</h3>
                    <button className="icon-btn" onClick={() => setModalConfig({ type: 'exp', isOpen: true })}>+</button>
                </div>
                {profile.experience?.map((exp, i) => (
                    <div key={i} className="list-row">
                        <div className="entity-icon">💼</div>
                        <div className="list-content">
                            <h4>{exp.role}</h4>
                            <p>{exp.company}</p>
                            <span className="sub-text">{exp.from} - {exp.to || 'Present'}</span>
                        </div>
                    </div>
                ))}
            </section>

            {/* EDUCATION SECTION */}
            <section className="profile-card section-padding">
                <div className="section-title-row">
                    <h3>Education</h3>
                    <button className="icon-btn" onClick={() => setModalConfig({ type: 'edu', isOpen: true })}>+</button>
                </div>
                {profile.education?.map((edu, i) => (
                    <div key={i} className="list-row">
                        <div className="entity-icon">🎓</div>
                        <div className="list-content">
                            <h4>{edu.school}</h4>
                            <p>{edu.degree} • Class of {edu.year}</p>
                        </div>
                    </div>
                ))}
            </section>

            {/* CERTIFICATIONS SECTION */}
            <section className="profile-card section-padding">
                <div className="section-title-row">
                    <h3>Licenses & certifications</h3>
                    <button className="icon-btn" onClick={() => setModalConfig({ type: 'cert', isOpen: true })}>+</button>
                </div>
                {profile.certifications?.map((cert, i) => (
                    <div key={i} className="list-row">
                        <div className="entity-icon">📜</div>
                        <div className="list-content">
                            <h4>{cert.name}</h4>
                            <p>{cert.issuingOrganization}</p>
                            {cert.credentialUrl && (
                                <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="cert-link">Show credential</a>
                            )}
                        </div>
                    </div>
                ))}
            </section>

            {/* MODAL RENDERER */}
            {modalConfig.isOpen && renderModal()}
        </div>
    );

    function renderModal() {
        const { type } = modalConfig;
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h3>Add {type === 'exp' ? 'Experience' : type === 'edu' ? 'Education' : 'Certification'}</h3>
                    <form onSubmit={(e) => {
                        const endpoint = type === 'exp' ? 'experience' : type === 'edu' ? 'education' : 'certifications';
                        const data = type === 'exp' ? expData : type === 'edu' ? eduData : certData;
                        handleUpdate(e, endpoint, data);
                    }}>
                        {type === 'exp' && (
                            <>
                                <input type="text" placeholder="Role" required onChange={e => setExpData({...expData, role: e.target.value})} />
                                <input type="text" placeholder="Company" required onChange={e => setExpData({...expData, company: e.target.value})} />
                                <input type="text" placeholder="From (MM/YY)" required onChange={e => setExpData({...expData, from: e.target.value})} />
                            </>
                        )}
                        {type === 'edu' && (
                            <>
                                <input type="text" placeholder="University" required onChange={e => setEduData({...eduData, school: e.target.value})} />
                                <input type="text" placeholder="Degree" required onChange={e => setEduData({...eduData, degree: e.target.value})} />
                                <input type="text" placeholder="Year" required onChange={e => setEduData({...eduData, year: e.target.value})} />
                            </>
                        )}
                        {type === 'cert' && (
                            <>
                                <input type="text" placeholder="Certification Name" required onChange={e => setCertData({...certData, name: e.target.value})} />
                                <input type="text" placeholder="Issuing Org" required onChange={e => setCertData({...certData, issuingOrganization: e.target.value})} />
                                <input type="text" placeholder="Credential URL" onChange={e => setCertData({...certData, credentialUrl: e.target.value})} />
                            </>
                        )}
                        <div className="modal-actions">
                            <button type="button" className="cancel-btn" onClick={() => setModalConfig({ type: null, isOpen: false })}>Cancel</button>
                            <button type="submit" className="save-btn">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
};

export default Profile;