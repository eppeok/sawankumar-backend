// src/config/db.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const mongoDB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://admin:Evolv@109@sawankumar.xxce6.mongodb.net/";

const connectDB = async () => {
  try {
    // Connect to MongoDB using the URI from the environment variable
    const connection = await mongoose.connect(mongoDB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`
      ################################################
       🛡️  MongoDB connection Successful! 🛡️
      ################################################`);
    return connection.connection.db;
  } catch (error) {
    console.error("Unable to connect to MongoDB:", error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = { connectDB };
