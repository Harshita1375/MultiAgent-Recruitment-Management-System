const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    let token;
    // Checks for Bearer token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Attach user id from token payload to req object
            req.user = { id: decoded.id }; 
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// CRITICAL: Export function directly for router compatibility
module.exports = protect;