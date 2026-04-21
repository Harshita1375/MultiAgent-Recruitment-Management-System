const Interview = require('../models/Interview');

exports.scheduleInterview = async (req, res) => {
    try {
        const { job, candidateName, start, end, title, meetingLink } = req.body;

        // Validation Check
        if (!job || !start || !end || !title) {
            return res.status(400).json({ message: "Required fields are missing." });
        }

        const newInterview = new Interview({
            job,
            candidateName,
            start: new Date(start), // Ensure it's a Date object
            end: new Date(end),     // Ensure it's a Date object
            title,
            meetingLink,
            hrManager: req.user.id 
        });

        await newInterview.save();
        res.status(201).json(newInterview);
    } catch (err) {
        // This log will appear in your SERVER terminal
        console.error("Schedule Interview Error:", err); 
        res.status(500).json({ 
            message: "Server error scheduling interview", 
            error: err.message 
        });
    }
};

exports.getMyInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({ hrManager: req.user.id });
        res.json(interviews);
    } catch (err) {
        res.status(500).json({ message: "Error fetching interviews" });
    }
};