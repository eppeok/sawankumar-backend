/* eslint-disable @typescript-eslint/no-non-null-assertion */
const dotenv = require("dotenv");

// dotenv will silently fail on GitHub Actions, otherwise this breaks deployment
dotenv.config();

// Export config as JavaScript object
module.exports = {
  port: process.env.PORT || "4002",
  databaseURL: process.env.MONGODB_URI || "",
  clientURL: process.env.CLIENT_URL || "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET || "",
  encryptSecret: process.env.ENCRYPT_SECRET || "",
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD || "",
  gmailEmail: process.env.GMAIL_EMAIL || "",
  ghlAccessToken: process.env.GHL_ACCESS_TOKEN || "",
};
