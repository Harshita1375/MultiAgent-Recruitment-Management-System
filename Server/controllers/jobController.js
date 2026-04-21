const Job = require('../models/Job');

const Application = require('../models/Application');

const axios = require('axios');
const FormData = require('form-data');

const fs = require('fs');
const path = require('path');

exports.applyToJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await Job.findById(jobId);

        if (!req.file) return res.status(400).json({ message: "No resume uploaded" });

        // 1. MANUALLY SAVE THE FILE (Since we switched to memoryStorage)
        const folder = './uploads/resumes/';
        if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

        const fileName = `${req.user.id}-${Date.now()}${path.extname(req.file.originalname)}`;
        const filePath = path.join(folder, fileName);

        // Write the buffer to the disk
        fs.writeFileSync(filePath, req.file.buffer);

        // 2. CALL FASTAPI (req.file.buffer is now valid!)
        const nlpFormData = new FormData();
        nlpFormData.append('jd', job.description);
        nlpFormData.append('resumes', req.file.buffer, req.file.originalname);

        const nlpServiceUrl = process.env.NLP_SERVICE_URL || 'http://127.0.0.1:8000';
        const nlpResponse = await axios.post(`${nlpServiceUrl}/api/ats/rank`, nlpFormData, {
            headers: { ...nlpFormData.getHeaders() }
        });

        const score = nlpResponse.data[0]?.score || 0;

        // 3. SAVE TO DATABASE
        const application = new Application({
            job: new mongoose.Types.ObjectId(jobId),
            candidate: req.user.id,
            employer: job.employer,
            resumeUrl: filePath.replace('./', '').replace(/\\/g, '/'),
            atsScore: score,
            status: "Pending"
        });

        await application.save();

        res.status(201).json({ message: "Applied successfully", atsScore: score });
    } catch (err) {
        console.error("ATS Error:", err.message);
        res.status(500).json({ message: "ATS Scanning failed." });
    }
};


// 2. Get All Jobs (For Candidates)
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// 3. Get Jobs posted by specific Company
exports.getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ employer: req.user.id });

        const jobsWithCount = await Promise.all(
            jobs.map(async (job) => {
                const count = await Application.countDocuments({ job: job._id });
                
                return {
                    ...job._doc,
                    applicationCount: count
                };
            })
        );

        res.json(jobsWithCount);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// 4. Update Job
exports.updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        // Ensure user owns the job
        if (job.employer.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: "Update failed" });
    }
};

// 5. Delete Job
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        if (job.employer.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        await job.deleteOne();
        res.json({ message: "Job removed" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
};

// Get all applications for a specific job (For Employers)
exports.getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;

        // Verify the job exists and belongs to the employer
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });

        if (job.employer.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized to view these applications" });
        }

        // Fetch applications and sort by ATS score (highest first)
        const applications = await Application.find({ job: jobId })
            .populate('candidate', 'name email')
            .sort({ atsScore: -1 });

        res.json(applications);
    } catch (err) {
        console.error("Fetch Apps Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

// 1. Create a New Job (For Employers)
exports.createJob = async (req, res) => {
    try {
        const newJob = new Job({
            ...req.body,
            employer: req.user.id // Taken from your authMiddleware (protect)
        });
        const job = await newJob.save();
        res.status(201).json(job);
    } catch (err) {
        console.error("Create Job Error:", err);
        res.status(500).json({ message: "Failed to create job" });
    }
};