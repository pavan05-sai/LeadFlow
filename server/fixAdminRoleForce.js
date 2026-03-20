const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const fixAdminRole = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const result = await User.updateOne(
      { email: 'admin@crm.com' },
      { $set: { role: 'admin' } }
    );

    console.log('Update result:', result);
    
    const updatedUser = await User.findOne({ email: 'admin@crm.com' });
    console.log('Updated user:', JSON.stringify(updatedUser, null, 2));

    process.exit();
  } catch (error) {
    console.error('Error fixing admin role:', error);
    process.exit(1);
  }
};

fixAdminRole();
