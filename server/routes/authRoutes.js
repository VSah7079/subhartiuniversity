const express = require('express');
const router = express.Router();
const { studentLogin, getStudentProfile, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authRateLimiter } = require('../middleware/rateLimiter');

// Public routes (Rate limited to prevent credential brute-forcing)
router.post('/student-login', authRateLimiter, studentLogin);

// Protected routes
router.get('/profile', protect, getStudentProfile);
router.post('/logout', protect, logout);

module.exports = router;
