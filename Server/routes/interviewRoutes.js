const express = require('express');
const router = express.Router();
const { scheduleInterview, getMyInterviews } = require('../controllers/interviewController');
const auth = require('../middleware/authMiddleware');
router.post('/', auth, scheduleInterview);
router.get('/', auth, getMyInterviews);

module.exports = router;