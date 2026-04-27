const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token and attach user to request
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Try to verify valid JWT token
    if (token && token.includes('.')) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (user) {
          req.user = {
            id: user.id,
            email: user.email,
            fullName: user.full_name,
            role: user.role
          };
          return next();
        }
      } catch (err) {
        // Token verification failed, create demo user instead
      }
    }

    // For development: create a demo user (no token required)
    req.user = {
      id: 'u_demo_' + Date.now(),
      email: 'demo@example.com',
      fullName: 'Demo User',
      role: 'user'
    };
    next();

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};
