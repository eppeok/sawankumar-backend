const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const getConversationByPhone = async (phoneNumber) => {
    try {
        // Ensure phone number is in correct format
        if (!phoneNumber.startsWith('+')) {
            phoneNumber = `+${phoneNumber}`;
        }

        const response = await axios.get(
            'https://services.leadconnectorhq.com/conversations/search',
            {
                params: {
                    locationId: process.env.GOHIGHLEVEL_LOCATION_ID,
                    query: phoneNumber,
                    limit: 20
                },
                headers: {
                    'Authorization': `Bearer ${process.env.GOHIGHLEVEL_ACCESS_TOKEN}`,
                    'Version': '2021-04-15',
                    'Accept': 'application/json'
                }
            }
        );

        const { conversations } = response.data;

        if (!conversations || conversations.length === 0) {
            throw new Error(`No conversation found for phone number ${phoneNumber}`);
        }

        // Return the most recent conversation (first in the array)
        return {
            conversationId: conversations[0].id,
            contactId: conversations[0].contactId,
            locationId: conversations[0].locationId,
            fullName: conversations[0].fullName,
            phone: conversations[0].phone,
            lastMessageDate: conversations[0].lastMessageDate
        };

    } catch (error) {
        if (error.response) {
            // API responded with error status
            throw new Error(`GoHighLevel API error: ${error.response.data.message || error.response.statusText}`);
        }
        throw error; // Re-throw other errors
    }
};

const sendMessage = async (payload) => {
    try {
        const response = await axios.post(
            'https://services.leadconnectorhq.com/conversations/messages/inbound',
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GOHIGHLEVEL_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Version': '2021-04-15'
                }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(`Failed to send message: ${error.message}`);
    }
};

const updateMessageStatus = async (messageId, status) => {
    try {
        // Log the exact request that will be made
        console.log('Making request to:', `https://services.leadconnectorhq.com/conversations/messages/${messageId}/status`);
        console.log('With headers:', {
            'Authorization': `Bearer ${process.env.GOHIGHLEVEL_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
            'Version': '2021-04-15'
        });
        console.log('With body:', { status });

        const response = await axios.put(
            `https://services.leadconnectorhq.com/conversations/messages/${messageId}/status`,
            { status },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GOHIGHLEVEL_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Version': '2021-04-15'
                }
            }
        );
        console.log('Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Full error details:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            headers: error.response?.headers,
            request: {
                method: error.config?.method,
                url: error.config?.url,
                headers: error.config?.headers,
                data: error.config?.data
            }
        });
        throw new Error(`Failed to update message status: ${error.message}`);
    }
};

module.exports = {
    getConversationByPhone,
    sendMessage,
    updateMessageStatus
}; 