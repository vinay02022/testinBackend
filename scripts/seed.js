const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Comment = require('../models/Comment');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Comment.deleteMany({});

    // Create sample users
    const users = await User.insertMany([
      {
        name: 'Alice',
        email: 'alice@example.com',
        password: await bcrypt.hash('Password123', 12),
        permissions: ['read', 'write']
      },
      {
        name: 'Bob',
        email: 'bob@example.com',
        password: await bcrypt.hash('Password123', 12),
        permissions: ['read', 'delete']
      },
      {
        name: 'Charlie',
        email: 'charlie@example.com',
        password: await bcrypt.hash('Password123', 12),
        permissions: ['read']
      }
    ]);

    // Create sample comments
    await Comment.insertMany([
      {
        content: 'Hello, this is Alice!',
        author: users[0]._id
      },
      {
        content: 'Bob was here.',
        author: users[1]._id
      },
      {
        content: 'Charlie says hi!',
        author: users[2]._id
      }
    ]);

    console.log('Sample data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed(); 