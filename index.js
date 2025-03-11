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
        console.log('WhatsApp Access Token:', process.env.WHATSAPP_ACCESS_TOKEN);
        console.log('WhatsApp Phone Number ID:', process.env.WHATSAPP_PHONE_NUMBER_ID);
        
        const response = await axios.post(
            `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: req.body.phone.split('+')[1] || req.body.phone,
                type: "text",
                text: {
                    body: req.body.message
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('WhatsApp API Response:', response.data);
        // Process the data as needed
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

// Webhook verification endpoint
app.get('/webhook', (req, res) => {
    try {
        // Get verify token from environment variable
        const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;
        
        // Parse params from the webhook verification request
        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];
        
        // Check if a token and mode were sent
        if (mode && token) {
            // Check the mode and token sent are correct
            if (mode === "subscribe" && token === VERIFY_TOKEN) {
                // Respond with 200 OK and challenge token from the request
                console.log("WEBHOOK_VERIFIED");
                res.status(200).send(challenge);
            } else {
                // Responds with '403 Forbidden' if verify tokens do not match
                res.sendStatus(403);
            }
        } else {
            // Returns a '404 Not Found' if mode or token are missing
            res.sendStatus(404);
        }
    } catch (error) {
        console.error('Webhook Verification Error:', error);
        res.sendStatus(500);
    }
});

// Webhook for receiving messages
app.post('/webhook', (req, res) => {
    try {
        const body = req.body;

        // Check if this is an event from a WhatsApp API
        if (body.object === 'whatsapp_business_account') {
            if (body.entry && body.entry[0].changes) {
                const change = body.entry[0].changes[0];
                const value = change.value;

                switch (change.field) {
                    case 'messages':
                        if (value.messages && value.messages[0]) {
                            const message = value.messages[0];
                            const phone_number_id = value.metadata.phone_number_id;
                            const from = message.from;

                            // Handle different message types
                            switch (message.type) {
                                case 'text':
                                    console.log('Received text message:', {
                                        from,
                                        message: message.text.body
                                    });
                                    break;

                                case 'image':
                                    console.log('Received image message:', {
                                        from,
                                        image_id: message.image.id
                                    });
                                    break;

                                case 'location':
                                    console.log('Received location:', {
                                        from,
                                        latitude: message.location.latitude,
                                        longitude: message.location.longitude
                                    });
                                    break;
                            }
                        }

                        // Handle message status updates
                        if (value.statuses && value.statuses[0]) {
                            const status = value.statuses[0];
                            console.log('Message Status Update:', {
                                message_id: status.id,
                                status: status.status,
                                timestamp: status.timestamp
                            });
                        }
                        break;

                    case 'message_template_status_update':
                        console.log('Template status update:', value);
                        break;

                    case 'phone_number_quality_update':
                        console.log('Phone number quality update:', value);
                        break;
                }
            }
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error('Webhook Error:', error);
        res.sendStatus(500);
    }
});

app.listen(PORT, () => {
    console.log(`App Listening on ${PORT}!`);
});
