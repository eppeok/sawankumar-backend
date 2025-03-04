const express = require('express');
const dotenv = require("dotenv");

// dotenv will silently fail on GitHub Actions, otherwise this breaks deployment
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.post('/', (req, res) => {
    try {
        console.log('Received data:', req.body);
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

app.get('/initiate', require('./lib/initiate'));

app.get('/refresh', require('./lib/refresh'));

app.get('/oauth/callback', require('./lib/callback'));

app.listen(PORT, () => {
    console.log(`App Listening on ${PORT}!`);
});
