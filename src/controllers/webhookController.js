const { getConversationByPhone, sendMessage, sendImageMessage } = require('../services/goHighLevel');
const axios = require('axios');

const verifyWebhook = (req, res) => {
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
};

const handleWebhookPost = (req, res) => {
    try {
        const body = req.body;

        // Check if this is an event from a WhatsApp API
        if (body.object === 'whatsapp_business_account') {
            if (body.entry && body.entry[0].changes) {
                const change = body.entry[0].changes[0];
                const value = change.value;

                switch (change.field) {
                    case 'messages':
                        handleMessages(value);
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
};

const handleMessages = async (value) => {
    if (value.messages && value.messages[0]) {
        const message = value.messages[0];
        const phone_number_id = value.metadata.phone_number_id;
        const from = message.from;

        // Handle different message types
        switch (message.type) {
            case 'text':
                try {
                    const conversation = await getConversationByPhone(from);
                    await sendMessage({
                        type: 'SMS',
                        message: message.text.body,
                        conversationId: conversation.conversationId
                    });
                } catch (error) {
                    console.error('Error forwarding message to GoHighLevel:', error.message);
                }
                break;

            case 'image':
                try {
                    const conversation = await getConversationByPhone(from);
                    // Get the image URL from WhatsApp
                    const imageUrl = message.image.link;
                    // Check if there's a caption with the image
                    const caption = message.image.caption || '';
                    
                    await sendImageMessage({
                        type: 'SMS',
                        conversationId: conversation.conversationId,
                        attachments: [imageUrl],
                        contentType: 'image/jpeg',
                        message: caption // Include the caption as the message
                    });
                } catch (error) {
                    console.error('Error forwarding image to GoHighLevel:', error.message);
                }
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
};

module.exports = {
    verifyWebhook,
    handleWebhookPost
}; 