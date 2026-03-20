const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Delete existing admin to ensure fresh start with role
    await User.deleteOne({ email: 'admin@crm.com' });

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@crm.com',
      password: 'admin123',
      role: 'admin',
    });

    console.log('Admin user seeded successfully with role:', admin.role);
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
