const TokenService = require('../services/tokenService');

const tokenMiddleware = async (req, res, next) => {
    try {
        // Validate and refresh token if needed
        const accessToken = await TokenService.validateAndRefreshToken();
        
        // Add token to request for use in routes
        req.accessToken = accessToken;
        
        next();
    } catch (error) {
        console.error('Token validation failed:', error);
        res.status(401).json({
            status: 'error',
            message: 'Authentication failed',
            error: error.message
        });
    }
};

module.exports = tokenMiddleware; 