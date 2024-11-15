// src/models/CanvaMasteryData.js
const mongoose = require("mongoose");

const CanvaMasteryDataSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const CanvaMasteryData = mongoose.model(
  "CanvaMasteryData",
  CanvaMasteryDataSchema
);

module.exports = CanvaMasteryData;
