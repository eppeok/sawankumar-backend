const { getConversationByPhone, sendMessage } = require('../services/goHighLevel');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "duwxuhvn2",
  api_key: "576673113496659",
  api_secret: "dbiZaKWhzU5H2C_7CR7GrOYa8fU",
});

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
                console.log('Received WhatsApp event:', change);
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
        console.log('---------------------------------Received message:', message);
        const from = message.from;
        const conversation = await getConversationByPhone(from);

        // Handle different message types
        switch (message.type) {
          case "text":
            try {
              await sendMessage({
                type: "SMS",
                message: message.text.body,
                conversationId: conversation.conversationId,
              });
            } catch (error) {
              console.error(
                "Error forwarding message to GoHighLevel:",
                error.message
              );
            }
            break;

          case "image":
            try {
              const imageId = message.image.id;
              const captionMessage = message.image.caption;

              // Step 1: Get the secure media URL from WhatsApp
              const token = process.env.WHATSAPP_ACCESS_TOKEN; // Your WhatsApp API token
              const mediaResponse = await axios.get(
                `https://graph.facebook.com/v22.0/${imageId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (!mediaResponse.data || !mediaResponse.data.url) {
                throw new Error("Failed to get media URL from WhatsApp");
              }

              const mediaUrl = mediaResponse.data.url;

              // Step 2: Download the image from WhatsApp's media URL (with authentication)
              const imageResponse = await axios.get(mediaUrl, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: "arraybuffer", // Required for binary data
              });

              // Step 3: Upload the image to Cloudinary
              const uploadedImage = await new Promise((resolve, reject) => {
                cloudinary.uploader
                  .upload_stream(
                    { resource_type: "image" },
                    (error, result) => {
                      if (error) reject(error);
                      else resolve(result);
                    }
                  )
                  .end(imageResponse.data);
              });

            //   console.log(
            //     "Image uploaded to Cloudinary:",
            //     uploadedImage.secure_url
            //   );

            const imageUrl = 'https://res.cloudinary.com/duwxuhvn2/image/upload/v1743666414/cbjbsszoz1hyfzk7v6oo.jpg'
              await sendMessage({
                type: "SMS",
                ...(captionMessage ? { message: captionMessage } : {}),
                attachments: [imageUrl],
                conversationId: conversation.conversationId,
              });


            } catch (error) {
              console.error("Error handling image message:", error.message);
            }
            break;

          case "location":
            console.log("Received location:", {
              from,
              latitude: message.location.latitude,
              longitude: message.location.longitude,
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