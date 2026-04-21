import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, isSunday } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const InterviewScheduler = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    
    // Form State
    const [formData, setFormData] = useState({
        title: '',
        candidateName: '',
        job: '',
        start: '',
        end: '',
        meetingLink: ''
    });

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [intRes, jobsRes] = await Promise.all([
                axios.get(`${API_URL}/api/interviews`, { headers }),
                axios.get(`${API_URL}/api/jobs/my-jobs`, { headers })
            ]);
            const formatted = intRes.data.map(event => ({
                ...event,
                start: new Date(event.start),
                end: new Date(event.end)
            }));
            setEvents(formatted);
            setJobs(jobsRes.data);
        } catch (err) { console.error(err); }
    };

    // Open form for new event
    const handleSelectSlot = ({ start, end }) => {
        setSelectedEvent(null);
        setFormData({
            title: '',
            candidateName: '',
            job: jobs[0]?._id || '',
            start: format(start, "yyyy-MM-dd'T'HH:mm"),
            end: format(end, "yyyy-MM-dd'T'HH:mm"),
            meetingLink: ''
        });
        setIsFormOpen(true);
    };

    // Open form for editing existing event
    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setFormData({
            title: event.title,
            candidateName: event.candidateName,
            job: event.job?._id || event.job,
            start: format(event.start, "yyyy-MM-dd'T'HH:mm"),
            end: format(event.end, "yyyy-MM-dd'T'HH:mm"),
            meetingLink: event.meetingLink || ''
        });
        setIsFormOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedEvent) {
                // Edit existing
                const res = await axios.put(`${API_URL}/api/interviews/${selectedEvent._id}`, formData, { headers });
                loadData();
            } else {
                // Create new
                await axios.post(`${API_URL}/api/interviews`, formData, { headers });
                loadData();
            }
            setIsFormOpen(false);
        } catch (err) { alert("Action failed"); }
    };

    const handleDelete = async () => {
        if (window.confirm("Delete this interview?")) {
            try {
                await axios.delete(`${API_URL}/api/interviews/${selectedEvent._id}`, { headers });
                loadData();
                setIsFormOpen(false);
            } catch (err) { alert("Delete failed"); }
        }
    };

    // Custom styling to mark Sundays as Holidays
    const dayPropGetter = (date) => {
        if (isSunday(date)) {
            return {
                style: {
                    backgroundColor: '#fff1f0',
                    cursor: 'not-allowed'
                },
            };
        }
        return {};
    };

    return (
        <div className="hq-scheduler-page">
            <header className="hq-top-nav">
                <span className="hq-brand-name">TalentSync Scheduler</span>
                <button onClick={() => navigate('/company-dashboard')}>← Back</button>
            </header>

            <div className="hq-content-area">
                <Calendar
                    localizer={localizer}
                    events={events}
                    selectable
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    dayPropGetter={dayPropGetter}
                    defaultView="week"
                    views={['month', 'week', 'day', 'agenda']}
                    style={{ height: '80vh', background: 'white', padding: '20px', borderRadius: '15px' }}
                />
            </div>

            {/* Event Form Modal */}
            {isFormOpen && (
            <div className="hq-modal-overlay">
                <div className="hq-modal-card animate-pop">
                    <div className="modal-header-accent">
                        <h3>{selectedEvent ? '📝 Edit Interview' : '📅 Schedule New Interview'}</h3>
                        <button className="close-x" onClick={() => setIsFormOpen(false)}>&times;</button>
                    </div>

                    <form className="scheduler-form-pro" onSubmit={handleSubmit}>
                        <div className="form-section">
                            <label>Interview Title</label>
                            <input 
                                type="text" 
                                required 
                                value={formData.title} 
                                onChange={e => setFormData({...formData, title: e.target.value})} 
                                placeholder="e.g. Frontend Technical Round" 
                            />
                        </div>

                        <div className="form-section">
                            <label>Candidate Name</label>
                            <input 
                                type="text" 
                                required 
                                value={formData.candidateName} 
                                onChange={e => setFormData({...formData, candidateName: e.target.value})} 
                                placeholder="Full Name"
                            />
                        </div>

                        <div className="form-section">
                            <label>Link to Job Position</label>
                            <select value={formData.job} onChange={e => setFormData({...formData, job: e.target.value})}>
                                {jobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}
                            </select>
                        </div>

                        <div className="form-row-grid">
                            <div className="form-section">
                                <label>Start Time</label>
                                <input type="datetime-local" value={formData.start} onChange={e => setFormData({...formData, start: e.target.value})} />
                            </div>
                            <div className="form-section">
                                <label>End Time</label>
                                <input type="datetime-local" value={formData.end} onChange={e => setFormData({...formData, end: e.target.value})} />
                            </div>
                        </div>

                        <div className="form-section">
                            <label>Meeting Link</label>
                            <input type="url" value={formData.meetingLink} onChange={e => setFormData({...formData, meetingLink: e.target.value})} placeholder="Zoom/Google Meet Link" />
                        </div>

                        <div className="modal-footer-actions">
                            {selectedEvent && (
                                <button type="button" className="btn-delete" onClick={handleDelete}>Delete</button>
                            )}
                            <div className="right-actions">
                                <button type="button" className="btn-cancel" onClick={() => setIsFormOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-save">
                                    {selectedEvent ? 'Save Changes' : 'Confirm Schedule'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
);
};

export default InterviewScheduler;