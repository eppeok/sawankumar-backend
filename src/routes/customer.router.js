const express = require('express');
const Controller = require('../controllers/customer.controller');
const router = express.Router();

// Route to insert customer contact information
router.post('/insert-contact', Controller.insertContact);

module.exports = router;
