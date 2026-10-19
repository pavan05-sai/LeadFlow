const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

const seedAdmin = async () => {
  const { MONGO_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('MONGO_URI, ADMIN_EMAIL, and ADMIN_PASSWORD are required');
  }
  if (ADMIN_PASSWORD.length < 12 || /^(replace-with|change-me|your-)/i.test(ADMIN_PASSWORD)) {
    throw new Error('ADMIN_PASSWORD must be a unique password of at least 12 characters');
  }

  await mongoose.connect(MONGO_URI);
  const email = ADMIN_EMAIL.trim().toLowerCase();
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (existingUser.role !== 'admin') {
      throw new Error('The configured admin email is already used by a non-admin account');
    }
    console.log('Admin account already exists; no changes made.');
    return;
  }

  await User.create({
    name: (ADMIN_NAME || 'Administrator').trim(),
    email,
    password: ADMIN_PASSWORD,
    role: 'admin',
  });
  console.log('Admin account created.');
};

const runSeed = async () => {
  try {
    await seedAdmin();
  } catch (error) {
    console.error('Admin seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    try {
      await mongoose.disconnect();
    } catch (error) {
      console.error('Admin seed cleanup failed:', error.message);
      process.exitCode = 1;
    }
  }
};

runSeed();
