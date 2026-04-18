const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const jobRecController = require('../controllers/jobRecController');
const protect = require('../middleware/authMiddleware');

// --- ADD THIS LINE BELOW ---
// ---------------------------
const upload = require('../middleware/upload');

// Standard Job Routes
router.post('/', protect, jobController.createJob);
router.get('/all', jobController.getAllJobs);
router.get('/my-jobs', protect, jobController.getMyJobs);

// Recommendation Logic Route
router.get('/recommendations', protect, jobRecController.getRecommendedJobs);

// Apply Route (Now 'upload' is defined!)
router.post('/apply/:jobId', protect, upload.single('resume'), jobController.applyToJob);

module.exports = router;