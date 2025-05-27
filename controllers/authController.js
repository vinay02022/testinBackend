const { validationResult } = require('express-validator');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { generateAccessToken, generateRefreshToken, generateResetToken } = require('../utils/jwt');
const crypto = require('crypto');

// Signup
const signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshTokenValue = generateRefreshToken();

    // Save refresh token
    const refreshToken = new RefreshToken({
      token: refreshTokenValue,
      user: user._id
    });
    await refreshToken.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          permissions: user.permissions
        },
        accessToken,
        refreshToken: refreshTokenValue
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during signup',
      error: error.message
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshTokenValue = generateRefreshToken();

    // Save refresh token
    const refreshToken = new RefreshToken({
      token: refreshTokenValue,
      user: user._id
    });
    await refreshToken.save();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          permissions: user.permissions
        },
        accessToken,
        refreshToken: refreshTokenValue
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Delete refresh token
    await RefreshToken.findOneAndDelete({ token: refreshToken });

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during logout',
      error: error.message
    });
  }
};

// Refresh Token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Find refresh token
    const storedToken = await RefreshToken.findOne({ token }).populate('user');
    if (!storedToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Check if token is expired
    if (storedToken.expiresAt < new Date()) {
      await RefreshToken.findOneAndDelete({ token });
      return res.status(401).json({
        success: false,
        message: 'Refresh token expired'
      });
    }

    // Generate new access token
    const accessToken = generateAccessToken(storedToken.user._id);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during token refresh',
      error: error.message
    });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email'
      });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save reset token to user
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    // In a real application, you would send this token via email
    // For this mock implementation, we return it in the response
    res.json({
      success: true,
      message: 'Password reset token generated successfully',
      data: {
        resetToken, // In production, this would be sent via email
        message: 'In production, this token would be sent to your email'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during password reset request',
      error: error.message
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { token, newPassword } = req.body;

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Invalidate all refresh tokens for this user
    await RefreshToken.deleteMany({ user: user._id });

    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during password reset',
      error: error.message
    });
  }
};

module.exports = {
  signup,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword
}; 