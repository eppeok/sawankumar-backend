const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController');

// Create a new token
router.post('/tokens', tokenController.createToken);

// Get the latest active token
router.get('/tokens', tokenController.getToken);

module.exports = router; 