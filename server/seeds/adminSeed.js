const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

/**
 * Seed script to create the default admin user.
 * Run: node seeds/adminSeed.js
 */
const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@crm.com' });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists. Skipping seed.');
      process.exit(0);
    }

    await User.create({
      name: 'Admin',
      email: 'admin@crm.com',
      password: 'admin123',
    });

    console.log('✅ Admin user created successfully!');
    console.log('   Email:    admin@crm.com');
    console.log('   Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
