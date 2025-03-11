const express = require('express');
const router = express.Router();
const { verifyWebhook, handleWebhookPost } = require('../controllers/webhookController');

router.get('/', verifyWebhook);
router.post('/', handleWebhookPost);

module.exports = router; 