const express = require('express');
const router = express.Router();
const { googleAuth, register, login, finalizeRole } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware'); // Middleware you already wrote
const User = require('../models/User');

// Existing routes
router.post('/google', googleAuth);
router.post('/register', register);
router.post('/login', login);
router.post('/finalize-role', finalizeRole);

// ADD THIS: Endpoint for App.js to verify the session
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;