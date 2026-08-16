const authorize = (...roles) => (req, res, next) => {
    console.log('User in authorize:', req.user);
    console.log('Allowed roles:', roles);

    if (!req.user || !roles.includes(req.user.role)) {
        res.status(403);
        return next(new Error("Forbidden: insufficient permissions"));
    }
    next();
};

module.exports = { authorize };