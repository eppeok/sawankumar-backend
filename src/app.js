// app.js

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./config/db");
const fs = require('fs');

// Import routes
const UserRouter = require("./routes/user.router");
const canvaMastery = require("./routes/canvaMastery.contact.router");
const coursesRouter = require("./routes/courses.router");
const uploadRouter = require("./routes/upload.router");
const courseCardsRouter = require('./routes/courseCards');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  credentials: true,
  origin: "*", // Allows all origins
}));
// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Add this endpoint to your Express app
app.get('/uploaded/images', (req, res) => {
  const directoryPath = path.join(__dirname, 'uploads/images');

  fs.readdir(directoryPath, (err, files) => {
      if (err) {
          return res.status(500).json({
              error: 'Unable to scan directory',
              details: err.message
          });
      }

    // Filter out any non-image files (optional)
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"].includes(ext);
    });

      res.json({
          images: imageFiles.map(file => ({
              name: file,
              url: `/uploads/images/${file}`
          }))
      });
  });
});
// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the API! - course");
});

app.use("/user", UserRouter);
app.use("/contact", canvaMastery);
app.use("/courses", coursesRouter);
app.use("/upload", uploadRouter);
app.use('/courseCards', courseCardsRouter);
module.exports = app;