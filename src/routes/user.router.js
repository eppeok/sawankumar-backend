// src/routes/index.js
const express = require("express");
const Controller = require("../controllers/user.controller");
const router = express.Router();

router.get("/allUser", Controller.getAllUsers);
router.get("/", Controller.demoRequest);

router.post("/register", Controller.register);
router.post("/login", Controller.login);

module.exports = router;
