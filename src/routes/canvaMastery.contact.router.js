// src/routes/category.js
const express = require("express");
const Controller = require("../controllers/controller");
const router = express.Router();

router.get("/", Controller.demoRequest);

router.post("/create", Controller.createContact);
router.post("/update", Controller.updateContact);
module.exports = router;
