const Job = require('../models/Job');

const Application = require('../models/Application');

exports.applyToJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        // 1. Check resume upload
        if (!req.file) {
            return res.status(400).json({ message: "Please upload your resume" });
        }

        // 2. Check job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // 3. ❗ Prevent duplicate applications
        const alreadyApplied = await Application.findOne({
            job: jobId,
            candidate: req.user.id
        });

        if (alreadyApplied) {
            return res.status(400).json({ message: "You already applied to this job" });
        }

        // 4. Create application
        const application = new Application({
            job: jobId,
            candidate: req.user.id,
            employer: job.employer,
            resumeUrl: req.file.path,
            status: "Pending"
        });

        await application.save();

        // 5. Optional: store applicant in Job (for quick count)
        await Job.findByIdAndUpdate(jobId, {
            $addToSet: { applicants: req.user.id } // avoids duplicates
        });

        res.status(201).json({
            message: "Application submitted successfully",
            application
        });

    } catch (err) {
        console.error("Apply Error:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.createJob = async (req, res) => {
    try {
        const newJob = new Job({
            ...req.body,
            employer: req.user.id // Taken from authMiddleware
        });
        const job = await newJob.save();
        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ message: "Failed to create job" });
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
        res.json(jobs);
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