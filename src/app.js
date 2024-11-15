const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
// const { connectDB } = require("./config/db");

// Routers
const canvaMastery = require("./routes/canvaMastery.contact.router");

const app = express();

// Connect to MongoDB
// connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    // origin: config.clientURL,
    origin: "*",
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});


app.use("/contact", canvaMastery);

module.exports = app;
