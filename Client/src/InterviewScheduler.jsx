import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const InterviewScheduler = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [jobs, setJobs] = useState([]); // 1. Added jobs state
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const loadData = async () => {
            try {
                // 2. Fetch both Interviews and Jobs in parallel
                const [interviewsRes, jobsRes] = await Promise.all([
                    axios.get(`${API_URL}/api/interviews`, { headers }),
                    axios.get(`${API_URL}/api/jobs/my-jobs`, { headers })
                ]);

                // Format Interviews for Calendar
                const formattedInterviews = interviewsRes.data.map(event => ({
                    ...event,
                    start: new Date(event.start),
                    end: new Date(event.end)
                }));

                setEvents(formattedInterviews);
                setJobs(jobsRes.data); // Store jobs to get valid _id
            } catch (err) {
                console.error("Error loading scheduler data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (token) loadData();
    }, [API_URL, token]);

    const handleSelectSlot = async ({ start, end }) => {
        // 3. Validation: Check if HR has at least one job
        if (!jobs || jobs.length === 0) {
            alert("You must have at least one job posted to schedule an interview.");
            return;
        }

        const title = window.prompt("Interview Title (e.g., Frontend Developer Interview):");
        const candidateName = window.prompt("Candidate Name:");
        
        // Use the ID of the first job found in the database
        const validJobId = jobs[0]._id; 

        if (title && candidateName) {
            try {
                const newEvent = { 
                    title, 
                    start, 
                    end, 
                    candidateName, 
                    job: validJobId // Sending a real 24-character hex ID
                }; 
                
                const res = await axios.post(`${API_URL}/api/interviews`, newEvent, { headers });

                setEvents([...events, { 
                    ...res.data, 
                    start: new Date(res.data.start), 
                    end: new Date(res.data.end) 
                }]);
            } catch (err) {
                console.error("Post Error:", err.response?.data);
                alert("Error: " + (err.response?.data?.message || "Server Error"));
            }
        }
    };

    if (loading) return <div className="loading-screen">Loading Calendar...</div>;

    return (
        <div className="hq-scheduler-page">
            <header className="hq-top-nav">
                <div className="hq-brand-container" onClick={() => navigate('/company-dashboard')}>
                    <span className="hq-brand-icon">🚀</span>
                    <span className="hq-brand-name">TalentSync</span>
                </div>
                <button className="hq-logout-btn" onClick={() => navigate('/company-dashboard')}>
                    ← Back to Dashboard
                </button>
            </header>

            <div className="hq-content-area" style={{ padding: '40px' }}>
                <div className="hq-card">
                    <div className="hq-card-header">
                        <h2>Interview Calendar</h2>
                        <p>Currently managing <b>{jobs.length}</b> active roles</p>
                    </div>
                    <div className="calendar-wrapper" style={{ height: '700px', backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        <Calendar
                            localizer={localizer}
                            events={events}
                            selectable
                            onSelectSlot={handleSelectSlot}
                            defaultView="week"
                            style={{ height: "100%" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewScheduler;