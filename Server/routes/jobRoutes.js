const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
// Public: Candidates can see all jobs

console.log("Checking Controllers:", {
    create: jobController.createJob,
    getApps: jobController.getJobApplications,
    apply: jobController.applyToJob
});
router.get('/all', jobController.getAllJobs);

// Protected: Company specific routes
router.post('/', protect, jobController.createJob);
router.get('/my-jobs', protect, jobController.getMyJobs);
router.put('/:id', protect, jobController.updateJob);
router.delete('/:id', protect, jobController.deleteJob);

router.get('/:jobId/applications', protect, jobController.getJobApplications);

router.post('/apply/:jobId', protect, upload.single('resume'), jobController.applyToJob);

module.exports = router;