const express = require('express');
const router = express.Router();
const { updateUserPermissions, getUserProfile } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { validatePermissions } = require('../middleware/validation');

// GET /api/users/profile - Get current user profile
router.get('/profile', authenticate, getUserProfile);

// PUT /api/users/:id/permissions - Update user permissions
router.put('/:id/permissions', authenticate, validatePermissions, updateUserPermissions);

module.exports = router; 