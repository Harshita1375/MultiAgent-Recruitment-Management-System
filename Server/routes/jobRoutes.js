const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const protect = require('../middleware/authMiddleware');

// Public: Candidates can see all jobs
router.get('/all', jobController.getAllJobs);

// Protected: Company specific routes
router.post('/', protect, jobController.createJob);
router.get('/my-jobs', protect, jobController.getMyJobs);
router.put('/:id', protect, jobController.updateJob);
router.delete('/:id', protect, jobController.deleteJob);

module.exports = router;