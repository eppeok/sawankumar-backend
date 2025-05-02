const Token = require('../models/Token');
const tokenService = require('../services/tokenService');

// Create a new token
const createToken = async (req, res) => {
    try {
        const { accessToken, refreshToken } = req.body;

        if (!accessToken || !refreshToken) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields'
            });
        }
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours in milliseconds

        const token = await tokenService.createToken({
            accessToken,
            refreshToken,
            expiresAt
        });

        res.status(201).json({
            status: 'success',
            data: {
                token: {
                    accessToken: token.accessToken,
                    refreshToken: token.refreshToken,
                    expiresAt: token.expiresAt,
                    createdAt: token.createdAt
                }
            }
        });
    } catch (error) {
        console.error('Error creating token:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to create token',
            error: error.message
        });
    }
};

// Get the latest active token
const getToken = async (req, res) => {
    try {
        const token = await tokenService.getLatestToken();

        res.status(200).json({
            status: 'success',
            data: {
                token: {
                    accessToken: token.accessToken,
                    refreshToken: token.refreshToken,
                    expiresAt: token.expiresAt,
                    createdAt: token.createdAt
                }
            }
        });
    } catch (error) {
        console.error('Error fetching token:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch token',
            error: error.message
        });
    }
};

// Refresh the current token - not needed right now
// const refreshToken = async (req, res) => {
//     try {
//         const currentToken = await Token.getLatestToken();

//         if (!currentToken) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'No active token found'
//             });
//         }

//         // Make request to refresh token endpoint
//         const response = await axios.post(process.env.TOKEN_REFRESH_ENDPOINT, {
//             refresh_token: currentToken.refreshToken
//         });

//         const { access_token, refresh_token, expires_in } = response.data;

//         const expiresAt = new Date(Date.now() + expires_in * 1000);

//         const newToken = await Token.createToken({
//             accessToken: access_token,
//             refreshToken: refresh_token,
//             expiresAt
//         });

//         res.status(200).json({
//             status: 'success',
//             data: {
//                 token: {
//                     id: newToken._id,
//                     accessToken: newToken.accessToken,
//                     refreshToken: newToken.refreshToken,
//                     expiresAt: newToken.expiresAt
//                 }
//             }
//         });
//     } catch (error) {
//         console.error('Error refreshing token:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Failed to refresh token',
//             error: error.message
//         });
//     }
// };

// Validate the current token
const validateToken = async (req, res) => {
    try {
        const token = await tokenService.getLatestToken();

        if (!token) {
            return res.status(404).json({
                status: 'error',
                message: 'No active token found'
            });
        }

        const isExpired = tokenService.isTokenExpired(token.expiresAt);

        res.status(200).json({
            status: 'success',
            data: {
                isValid: !isExpired,
                expiresAt: token.expiresAt
            }
        });
    } catch (error) {
        console.error('Error validating token:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to validate token',
            error: error.message
        });
    }
};

module.exports = {
    createToken,
    getToken,
    validateToken
    // refreshToken,
}; 