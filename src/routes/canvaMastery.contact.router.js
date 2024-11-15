// src/routes/category.js
const express = require("express");
const Controller = require("../controllers/controller");
const router = express.Router();

const headers = {
  Authorization: `Bearer pit-2863e592-02f4-43a4-afd6-f0bf1b943681`, // Removed extra space
  "Content-Type": "application/json",
  Version: "2021-07-28",
};

router.get("/", Controller.demoRequest);

router.post("/create", Controller.createContact);
router.post("/update", Controller.updateContact);
module.exports = router;
