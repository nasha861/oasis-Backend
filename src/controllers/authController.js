const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Customer = require('../models/Customer');
const Technician = require('../models/Technician');
const generateToken = require('../utils/generateToken');
const { sendSuccess } = require('../utils/apiResponse');

const toUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  token: generateToken(user._id)
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'customer', phoneNumber, billingAddress } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }
  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.findOne({ email, normalizedEmail });
  if (existingUser) {
    res.status(409);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    role,
    password: await User.hashPassword(password)
  });

  if (role === 'customer') {
    await Customer.create({ user: user._id, phoneNumber, billingAddress });
  }

  if (role === 'technician') {
    await Technician.create({ user: user._id });
  }

  sendSuccess(res, toUserResponse(user), 'Registration successful', 201);
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  sendSuccess(res, toUserResponse(user), 'Login successful');
});

const getProfile = asyncHandler(async (req, res) => {
  sendSuccess(res, req.user, 'Profile fetched');
});

const updateProfile = asyncHandler(async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email
  };

  Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

  if (req.body.password) {
    updates.password = await User.hashPassword(req.body.password);
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  });

  sendSuccess(res, toUserResponse(user), 'Profile updated');
});

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile
};
