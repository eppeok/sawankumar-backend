const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    accessToken: {
      type: String,
      required: true,
      trim: true,
    },
    refreshToken: {
      type: String,
      required: true,
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
