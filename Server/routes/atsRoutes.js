const express = require('express');
const router = express.Router();
const multer = require('multer');
const atsController = require('../controllers/atsController');
const authMiddleware = require('../middleware/authMiddleware');

// Store files in memory buffer for temporary processing
const upload = multer({ storage: multer.memoryStorage() });

// Route for checking multiple resumes
router.post('/score', authMiddleware, upload.array('resumes', 10), atsController.checkATS);

module.exports = router;