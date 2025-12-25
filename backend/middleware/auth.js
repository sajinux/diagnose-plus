// Authentication Middleware
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

// Verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    try {
        const decoded = jwt.verify(token, authConfig.jwt.secret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token.'
        });
    }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
    next();
};

// Check if user is partner
const isPartner = (req, res, next) => {
    if (req.user.role !== 'partner') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Partner account required.'
        });
    }
    next();
};

// Check if user owns the resource
const isOwner = (resourceIdParam = 'id') => {
    return (req, res, next) => {
        const resourceId = parseInt(req.params[resourceIdParam]);
        const userId = req.user.id;

        // Admin can access any resource
        if (req.user.role === 'admin') {
            return next();
        }

        // Partner can only access their own resources
        if (req.user.partnerId && req.user.partnerId === resourceId) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: 'Access denied. You can only access your own resources.'
        });
    };
};

module.exports = {
    verifyToken,
    isAdmin,
    isPartner,
    isOwner
};
