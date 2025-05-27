const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  }
}, {
  timestamps: true
});

// Populate author information when querying
commentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'author',
    select: 'name email'
  });
  next();
});

module.exports = mongoose.model('Comment', commentSchema); 