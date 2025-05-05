const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const mongoose = require('mongoose');
const Token = require('../models/Token');
const dotenv = require('dotenv');

dotenv.config();

const TOKEN_FILE_PATH = path.join(__dirname, '../../token.json');
const GHL_LOCATION_ID = 'dsWjBGIxUq1LzZXzCB9c';

// Check and create token.json if it doesn't exist
const initializeTokenFile = async () => {
    try {
        // Check if file exists
        try {
            await fs.access(TOKEN_FILE_PATH);
            console.log('token.json file exists');
        } catch (error) {
            // File doesn't exist, create it with empty token data
            const initialTokenData = {
                accessToken: '',
                refreshToken: '',
                expiresAt: null,
                createdAt: new Date().toISOString(),
                isActive: false
            };
            await fs.writeFile(TOKEN_FILE_PATH, JSON.stringify(initialTokenData, null, 2));
            console.log('Created new token.json file');
        }
    } catch (error) {
        console.error('Error initializing token.json:', error);
        throw error;
    }
};

// Initialize token service
const initialize = async () => {
    try {
        // First ensure token.json exists
        await initializeTokenFile();

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('🚀 Successfully connected to MongoDB! Ready for liftoff 🌟');

        // Try to get token from MongoDB
        try {
            const mongoToken = await Token.findOne({ isActive: true }).sort({ createdAt: -1 });
            
            if (mongoToken) {
                // Update JSON file with MongoDB token
                const tokenData = {
                    accessToken: mongoToken.accessToken,
                    refreshToken: mongoToken.refreshToken,
                    expiresAt: mongoToken.expiresAt,
                    createdAt: mongoToken.createdAt,
                    isActive: true
                };
                await fs.writeFile(TOKEN_FILE_PATH, JSON.stringify(tokenData, null, 2));
                console.log('Token data synced from MongoDB to JSON file');
            }
        } catch (error) {
            console.error('Error syncing MongoDB data:', error);
        }

        return true;
    } catch (error) {
        console.error('Token service initialization failed:', error);
        throw error;
    }
};

// Create a new token
const createToken = async (tokenData) => {
    try {
        // First, create in MongoDB
        const mongoToken = await Token.create({
            ...tokenData,
            isActive: true
        });

        // Then update JSON file
        const data = await fs.readFile(TOKEN_FILE_PATH, 'utf8');
        const tokens = JSON.parse(data);

        // Mark all other tokens as inactive
        tokens.tokens = tokens.tokens.map(token => ({
            ...token,
            isActive: false
        }));

        // Add new token
        tokens.tokens.push({
            accessToken: mongoToken.accessToken,
            refreshToken: mongoToken.refreshToken,
            expiresAt: mongoToken.expiresAt,
            createdAt: mongoToken.createdAt,
            isActive: true
        });

        // Save to file
        await fs.writeFile(TOKEN_FILE_PATH, JSON.stringify(tokens, null, 2));

        return mongoToken;
    } catch (error) {
        console.error('Error creating token:', error);
        throw error;
    }
};

// Get the latest token from JSON file
const getLatestToken = async () => {
    try {
        const data = await fs.readFile(TOKEN_FILE_PATH, 'utf8');
        const tokenData = JSON.parse(data);
        return tokenData;
    } catch (error) {
        console.error('Error reading token.json:', error);
        throw error;
    }
};

// Update token in JSON file
const updateToken = async (newTokenData) => {
    try {
        await fs.writeFile(TOKEN_FILE_PATH, JSON.stringify(newTokenData, null, 2));
        console.log('Token updated in token.json');
        return true;
    } catch (error) {
        console.error('Error updating token.json:', error);
        throw error;
    }
};

// Check if token is valid
const isTokenValid = async (accessToken) => {
    try {
        const response = await axios.get(
            'https://services.leadconnectorhq.com/conversations/search',
            {
                params: {
                    locationId: GHL_LOCATION_ID
                },
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json',
                    'Version': '2021-04-15'
                }
            }
        );

        return response.status === 200;
    } catch (err) {
        console.error("Token validation failed:", err.response?.status, err.response?.data || err.message);
        return false;
    }
};

// Refresh the access token using refresh token
const refreshAccessToken = async () => {
    try {
        // Read current token data to get refresh token
        const data = await fs.readFile(TOKEN_FILE_PATH, 'utf8');
        const tokenData = JSON.parse(data);
        
        if (!tokenData.refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await axios.post(
            'https://services.leadconnectorhq.com/oauth/token',
            new URLSearchParams({
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                grant_type: 'refresh_token',
                refresh_token: tokenData.refreshToken
            }),
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        // Calculate expiration time (current time + expires_in seconds)
        const expiresAt = new Date(Date.now() + (response.data.expires_in * 1000));

        // Update token data
        const newTokenData = {
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            expiresAt: expiresAt.toISOString(),
            createdAt: new Date().toISOString(),
            isActive: true
        };

        // Update token.json
        await fs.writeFile(TOKEN_FILE_PATH, JSON.stringify(newTokenData, null, 2));

        // Update MongoDB if needed
        if (mongoose.connection.readyState === 1) {
            await Token.findOneAndUpdate(
                { isActive: true },
                newTokenData,
                { upsert: true, new: true }
            );
        }

        console.log('Access token refreshed successfully');
        return newTokenData.accessToken;
    } catch (error) {
        console.error('Error refreshing access token:', error.response?.data || error.message);
        throw error;
    }
};

// Get only the access token from JSON file and validate it
const getAccessToken = async () => {
    try {
        const data = await fs.readFile(TOKEN_FILE_PATH, 'utf8');
        const tokenData = JSON.parse(data);
        
        // Validate the token before returning
        const isValid = await isTokenValid(tokenData.accessToken);
        
        if (!isValid) {
            console.log('Token is invalid, attempting to refresh...');
            // Try to refresh the token
            return await refreshAccessToken();
        }
        
        return tokenData.accessToken;
    } catch (error) {
        console.error('Error reading or validating access token:', error);
        throw error;
    }
};

module.exports = {
    initialize,
    createToken,
    getLatestToken,
    updateToken,
    getAccessToken,
    isTokenValid,
    refreshAccessToken
}; 