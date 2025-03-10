const express = require('express');
const dotenv = require("dotenv");
const axios = require('axios');

// dotenv will silently fail on GitHub Actions, otherwise this breaks deployment
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.post('/', async (req, res) => {
    try {
        console.log('Received data:', req.body);
        
        const { messageId, conversationId } = req.body;
        
        if (messageId && conversationId) {
            // Get the access token from environment variables
            const accessToken = process.env.GOHIGHLEVEL_ACCESS_TOKEN;
            
            if (!accessToken) {
                console.error('GoHighLevel access token is not configured');
                return res.status(500).send('GoHighLevel access token is not configured');
            }

            // Update message status to delivered
            const apiUrl = `https://services.leadconnectorhq.com/conversations/messages/${messageId}/status`;
            await axios.put(apiUrl, {
                status: 'delivered'
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'Version': '2021-04-15' 
                }
            });

            console.log(`Message ${messageId} status updated to delivered`);
        }

        res.status(200).send("Backend sms received");
    } catch (error) {
        console.error('Error processing data:', error);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/', (req, res) => {
    res.send("Backend is working");
});

app.get('/initiate', require('./src/lib/initiate'));

app.get('/refresh', require('./src/lib/refresh'));

app.get('/oauth/callback', require('./src/lib/callback'));

app.post('/reply', async (req, res) => {
    try {
        const { messageId, phone, message, locationId, contactId, conversationId } = req.body;
        
        // GoHighLevel API endpoint for sending messages (corrected as per documentation)
        const apiUrl = 'https://services.leadconnectorhq.com/conversations/messages';
        
        // Get the access token from environment variables
        const accessToken = process.env.GOHIGHLEVEL_ACCESS_TOKEN;
        
        if (!accessToken) {
            throw new Error('GoHighLevel access token is not configured');
        }

        if (!conversationId) {
            throw new Error('Conversation ID is required for replying to messages');
        }

        // Prepare the request payload according to documentation
        const payload = {
            type: 'SMS',
            contactId: contactId,
            message: message,
            conversationId: conversationId,  // Added conversationId to maintain the thread
            // Optional fields if needed:
            // attachments: [],
            // scheduledTimestamp: Math.floor(Date.now() / 1000) // Current time in seconds
        };

        // Make the API request to GoHighLevel with correct headers
        const response = await axios.post(apiUrl, payload, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Version': '2021-04-15'  // Required API version as per documentation
            }
        });

        console.log('GoHighLevel API Response:', response.data);

        res.status(200).json({
            status: 'success',
            message: 'Reply sent successfully',
            data: {
                conversationId: response.data.conversationId,
                messageId: response.data.messageId,
                msg: response.data.msg
            }
        });

    } catch (error) {
        console.error('Error sending reply:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Failed to send reply',
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`App Listening on ${PORT}!`);
});
