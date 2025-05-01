const express = require('express');
const dotenv = require("dotenv");
const axios = require('axios');
const webhookRoutes = require('./src/routes/webhookRoutes');
const { privacyPolicyContent, termsOfServiceContent } = require('./src/lib/policy-content');

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

app.post("/", async (req, res) => {
  try {
    console.log('Received request:', req.body);
    // Check message direction using GoHighLevel API
    const ghlApiUrl = `https://services.leadconnectorhq.com/conversations/messages/${req.body.messageId}`;
    const accessToken = process.env.GOHIGHLEVEL_ACCESS_TOKEN;

    const searchResponse = await axios.get(ghlApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Version: "2021-04-15",
      },
    });
    console.log('Search response:', searchResponse.data.message);

    // Check if the message is inbound (from customer)
    const isInbound = searchResponse.data.message.direction === "inbound";

    if (!isInbound) {
      const isAttachmentAvailable = searchResponse?.data?.message?.attachments?.length > 0;
      
      // for testing 
      const updateMessageStatus = await updateMessageStatus(req.body.messageId, "delivered");


      try {
        // If there's an attachment, send it first
        if (isAttachmentAvailable) {
          const attachmentUrl = searchResponse.data.message.attachments[0];
          const attachmentType = attachmentUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? 'image' : 'document';
          
          const attachmentResponse = await axios.post(
            `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
            {
              messaging_product: "whatsapp",
              to: req.body.phone.split("+")[1] || req.body.phone,
              type: attachmentType,
              [attachmentType]: {
                link: attachmentUrl,
                caption: req.body.message // Include the message as caption
              }
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log(`WhatsApp ${attachmentType} API Response:`, attachmentResponse.data);
        } else {
          // If no attachment, just send text message
          const textResponse = await axios.post(
            `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
            {
              messaging_product: "whatsapp",
              to: req.body.phone.split("+")[1] || req.body.phone,
              type: "text",
              text: {
                body: req.body.message,
              }
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log("WhatsApp Text API Response:", textResponse.data);
        }
      } catch (error) {
        console.error("Error sending WhatsApp message:", error.response?.data || error.message);
        throw error; // Re-throw to be caught by outer try-catch
      }
    }
    // Process the data as needed
    res.status(200).json({
      status: "delivered",
      success: true,
      messageId: req.body.messageId,
      message: req.body.message,
      contactId: req.body.contactId,
      conversationId: req.body.conversationId,
      note: "Message received successfully"
  });
  } catch (error) {
    console.error("Error processing data:", error);
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
        const apiUrl = 'https://services.leadconnectorhq.com/conversations/messages/inbound';
        
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


// Use webhook routes
app.use('/webhook', webhookRoutes);

// Privacy Policy endpoint
app.get('/privacy-policy', (req, res) => {
    try {
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 hour cache
        res.status(200).send(privacyPolicyContent);
    } catch (error) {
        console.error('Privacy Policy Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Terms of Service endpoint
app.get('/terms-of-service', (req, res) => {
    try {
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 hour cache
        res.status(200).send(termsOfServiceContent);
    } catch (error) {
        console.error('Terms of Service Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`App Listening on ${PORT}!`);
});
