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
  // Public registration must never choose its own role.
  const { name, email, password, phoneNumber, billingAddress } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail
  });

  if (existingUser) {
    res.status(409);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    role: 'customer',
    password: await User.hashPassword(password)
  });
  await Customer.create({
    user: user._id,
    phoneNumber,
    billingAddress
  });

 sendSuccess(
    res,
    toUserResponse(user),
    'Registration successful',
    201
  );
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

const createTechnicianAccount = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phoneNumber,
    specialization = "both",
    certifications = [],
  } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (await User.findOne({ email: normalizedEmail })) {
    res.status(409);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: await User.hashPassword(password),
    role: "technician",
  });

  try {
    const technician = await Technician.create({
      user: user._id,
      phone: phoneNumber,
      specialization,
      certifications,
    });

    return sendSuccess(
      res,
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        technician,
      },
      "Technician account created successfully",
      201
    );
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw error;
  }
});

const createAdminAccount = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (await User.findOne({ email: normalizedEmail })) {
    res.status(409);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: await User.hashPassword(password),
    role: "admin",
  });

  return sendSuccess(
    res,
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    "Admin account created successfully",
    201
  );
});

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  createTechnicianAccount,
  createAdminAccount,
};