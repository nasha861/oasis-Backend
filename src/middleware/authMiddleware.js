const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    console.log('Auth middleware: authorization header present:', Boolean(authHeader));
    console.log(req.user);
    
    if (!authHeader.startsWith('Bearer ')) {
        console.log('Auth middleware: no Bearer token provided');
        res.status(401);
        throw new Error('Not authorized, no token');
    }

    const token = authHeader.split(' ')[1];
    console.log('Auth middleware: token received:', token ? 'present' : 'missing');

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Auth middleware: decoded token payload:', decoded);
    } catch (error) {
        console.log('Auth middleware: JWT verify error:', error.message);
        res.status(401);
        throw new Error('Not authorized, invalid token');
    }

    const user = await User.findById(decoded.id).select('-password');
    console.log('Auth middleware: user lookup for id', decoded.id, 'found:', Boolean(user));

    if (!user) {
        console.log('Auth middleware: user not found for id:', decoded.id);
        res.status(401);
        throw new Error('Not authorized, user not found');
    }

    req.user = user;
    next();
});

module.exports = { protect };