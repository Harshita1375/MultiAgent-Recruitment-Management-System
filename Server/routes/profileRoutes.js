const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

// Line 7: Ensure profileController.getProfile matches the export name
router.get('/me', authMiddleware, profileController.getProfile);

router.post('/', authMiddleware, profileController.updateProfile);
router.put('/education', authMiddleware, profileController.addEducation);
router.put('/experience', authMiddleware, profileController.addExperience);
router.put('/certifications', authMiddleware, profileController.addCertification);

// NEW: Edit and Delete routes using dynamic parameters
router.put('/:collection/:itemId', authMiddleware, profileController.editItem);
router.delete('/:collection/:itemId', authMiddleware, profileController.deleteItem);
module.exports = router;