const express = require('express');
const router = express.Router();
const { loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', loginUser);

// GET /api/auth/me (protected)
router.get('/me', protect, getMe);

module.exports = router;
