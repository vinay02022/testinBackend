const { validationResult } = require('express-validator');
const Comment = require('../models/Comment');

// Get all comments (requires read permission)
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: {
        comments,
        count: comments.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching comments',
      error: error.message
    });
  }
};

// Create a new comment (requires write permission)
const createComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { content } = req.body;
    const userId = req.user._id;

    const comment = new Comment({
      content,
      author: userId
    });

    await comment.save();

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: {
        comment
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating comment',
      error: error.message
    });
  }
};

// Delete a comment (requires delete permission - global delete rights)
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    await Comment.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting comment',
      error: error.message
    });
  }
};

// Get a single comment by ID
const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    res.json({
      success: true,
      data: {
        comment
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching comment',
      error: error.message
    });
  }
};

module.exports = {
  getComments,
  createComment,
  deleteComment,
  getCommentById
};