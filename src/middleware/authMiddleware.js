const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
const authHeader = req.headers.authorization || '';
if (!authHeader.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not authorized, no token');
}
const token = authHeader.split(' ')[1];
let decoded;
try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
} catch (error) {
    res.status(401);
    throw new Error('Not authorized, invalid token');
}
const user = await User.findById(decoded.id).select('-password');
if (!user) {
    res.status(401);
    throw new Error('Not authorized, user not found');
}
req.user = user;
next();
});
module.exports = { protect };