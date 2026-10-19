const User = require('../models/User');
const Lead = require('../models/Lead');

const handleControllerError = (res, error, context) => {
  console.error(context, error);
  const status = error.name === 'ValidationError' || error.name === 'CastError'
    ? 400
    : error.code === 11000 ? 409 : 500;
  res.status(status).json({
    message: status === 400
      ? 'Invalid request data'
      : status === 409 ? 'A user with this email already exists' : 'Server error',
  });
};

/**
 * @desc    Get all users (Agents only for admin)
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'agent' }).select('-password');
    res.json(users);
  } catch (error) {
    handleControllerError(res, error, 'Get Users Error:');
  }
};

/**
 * @desc    Create a new user (Agent)
 * @route   POST /api/users
 * @access  Private/Admin
 */
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedName = typeof name === 'string' ? name.trim() : '';
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!normalizedName || normalizedName.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ message: 'A valid name and email are required' });
    }
    if (typeof password !== 'string' || password.length < 12) {
      return res.status(400).json({ message: 'Password must be at least 12 characters' });
    }
    if (role && role !== 'agent') {
      return res.status(400).json({ message: 'Only agent accounts can be created here' });
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password,
      role: 'agent',
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    handleControllerError(res, error, 'Create User Error:');
  }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, role: 'agent' });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await Lead.updateMany({ assignedTo: user._id }, { $set: { assignedTo: null } });
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (error) {
    handleControllerError(res, error, 'Delete User Error:');
  }
};

module.exports = { getUsers, createUser, deleteUser };
