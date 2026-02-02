const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

// FIX: Import the upload middleware
const upload = require('../middleware/upload'); 

router.get('/me', authMiddleware, profileController.getProfile);
router.post('/', authMiddleware, profileController.updateProfile);

router.put('/education', authMiddleware, profileController.addEducation);
router.put('/experience', authMiddleware, profileController.addExperience);
router.put('/certifications', authMiddleware, profileController.addCertification);

router.put('/:collection/:itemId', authMiddleware, profileController.editItem);
router.delete('/:collection/:itemId', authMiddleware, profileController.deleteItem);

// Image Upload Routes
// Server/routes/profile.js
router.post('/upload-avatar', authMiddleware, upload.single('avatar'), profileController.uploadAvatar); //
router.post('/upload-cover', authMiddleware, upload.single('cover'), profileController.uploadCover); //

module.exports = router;