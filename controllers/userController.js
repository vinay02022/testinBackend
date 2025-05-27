const { validationResult } = require('express-validator');
const User = require('../models/User');

// Update user permissions
const updateUserPermissions = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { permissions } = req.body;

    // Validate permissions array
    const validPermissions = ['read', 'write', 'delete'];
    const invalidPermissions = permissions.filter(p => !validPermissions.includes(p));
    
    if (invalidPermissions.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid permissions: ${invalidPermissions.join(', ')}. Valid permissions are: ${validPermissions.join(', ')}`
      });
    }

    // Find and update user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update permissions
    user.permissions = [...new Set(permissions)]; // Remove duplicates
    await user.save();

    res.json({
      success: true,
      message: 'User permissions updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          permissions: user.permissions
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during permission update',
      error: error.message
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          permissions: user.permissions
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile',
      error: error.message
    });
  }
};

module.exports = {
  updateUserPermissions,
  getUserProfile
}; 