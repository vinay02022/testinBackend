const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const {
  validateSignup,
  validateLogin,
  validateForgotPassword,
  validateResetPassword
} = require('../middleware/validation');

// POST /api/auth/signup - Register a new user
router.post('/signup', validateSignup, signup);

// POST /api/auth/login - Login user
router.post('/login', validateLogin, login);

// POST /api/auth/logout - Logout user
router.post('/logout', logout);

// POST /api/auth/refresh - Refresh access token
router.post('/refresh', refreshToken);

// POST /api/auth/forgot-password - Request password reset
router.post('/forgot-password', validateForgotPassword, forgotPassword);

// POST /api/auth/reset-password - Reset password with token
router.post('/reset-password', validateResetPassword, resetPassword);

module.exports = router; 