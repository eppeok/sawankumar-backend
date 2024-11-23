// app.js

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');
const { connectDB } = require("./config/db");

// Import routes
const canvaMastery = require("./routes/canvaMastery.contact.router");
const coursesRouter = require("./routes/courses.router");
const uploadRouter = require("./routes/upload.router");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  credentials: true,
  origin: "*",
}));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.use("/contact", canvaMastery);
app.use("/courses", coursesRouter);
app.use("/upload", uploadRouter);

module.exports = app;