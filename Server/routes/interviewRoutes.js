const express = require('express');
const router = express.Router();
const { scheduleInterview, getMyInterviews, updateInterview, deleteInterview } = require('../controllers/interviewController');
const auth = require('../middleware/authMiddleware');
router.post('/', auth, scheduleInterview);
router.get('/', auth, getMyInterviews);
router.put('/:id', auth, updateInterview);
router.delete('/:id', auth, deleteInterview);

module.exports = router;