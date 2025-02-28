const config = require('../config');

async function initiateAuth(req, res) {
    const options = {
        requestType: "code",
        redirectUri: "http://localhost:3000/oauth/callback",
        clientId: config.clientId,
        scopes: [
            "conversations/message.readonly",
            "conversations/message.write",
            "conversations.readonly",
            "conversations.write",
            "conversations/reports.readonly",
            "conversations/livechat.write",
            "contacts.readonly",
            "contacts.write"
        ]
    };

    return res.redirect(`${config.baseUrl}/oauth/chooselocation?response_type=${options.requestType}&redirect_uri=${options.redirectUri}&client_id=${options.clientId}&scope=${options.scopes.join(' ')}`);
}

module.exports = initiateAuth;
