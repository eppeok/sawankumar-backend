
require('dotenv').config();

// Override config values with environment variables if they exist
const finalConfig = {
    baseUrl: process.env.BASE_URL || '',
    clientId: process.env.CLIENT_ID || '',
    clientSecret: process.env.CLIENT_SECRET || ''
};

module.exports = finalConfig; 