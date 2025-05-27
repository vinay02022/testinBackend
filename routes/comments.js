const express = require('express');
const router = express.Router();
const {
  getComments,
  createComment,
  deleteComment,
  getCommentById
} = require('../controllers/commentController');
const { authenticate } = require('../middleware/auth');
const {
  checkReadPermission,
  checkWritePermission,
  checkDeletePermission
} = require('../middleware/permissions');
const { validateComment } = require('../middleware/validation');

// GET /api/comments - Get all comments (requires read permission)
router.get('/', authenticate, checkReadPermission, getComments);

// GET /api/comments/:id - Get single comment (requires read permission)
router.get('/:id', authenticate, checkReadPermission, getCommentById);

// POST /api/comments - Create new comment (requires write permission)
router.post('/', authenticate, checkWritePermission, validateComment, createComment);

// DELETE /api/comments/:id - Delete comment (requires delete permission)
router.delete('/:id', authenticate, checkDeletePermission, deleteComment);

module.exports = router; 