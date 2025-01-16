// app.js

const express = require("express");
const bodyParser = require("body-parser");
const crypto = require('crypto');
const axios = require('axios');
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./config/db");
const fs = require("fs");

// Import routes
const UserRouter = require("./routes/user.router");
const canvaMastery = require("./routes/canvaMastery.contact.router");
const coursesRouter = require("./routes/courses.router");
const uploadRouter = require("./routes/upload.router");
const courseCardsRouter = require("./routes/courseCards");
const sitemapRouter = require("./routes/sitemap");
const couponsRouter = require("./routes/coupon.router");
const customerRouter = require("./routes/customer.router");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: "*", // Allows all origins
  })
);

// Configuration
const STAPE_URL = "https://api.stape.info"; // Stape server domain
const ACCESS_TOKEN =
  "EAANJRYuAxagBO3Ck3TpIk98WArpc2V0Q2UukQmPzGKX5GllSefhN8jzMrAbIob5yzzD7DZAFUl3Ta6NiXgPxfu7d7XiJ9rV1KXWHRoRUv48fgA6ftM0SQ4EytC4pinqKRe14RJNB2hLZCveScTlqWig2IuQKeziCIfiWShPzXsJeML8UjvnWwIZAbaS99doNQZDZD";
const PIXEL_ID = "1153392686004885";

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Add this endpoint to your Express app
app.get("/uploaded/images", (req, res) => {
  const directoryPath = path.join(__dirname, "uploads/images");

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({
        error: "Unable to scan directory",
        details: err.message,
      });
    }

    // Filter out any non-image files (optional)
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"].includes(ext);
    });

    res.json({
      images: imageFiles.map((file) => ({
        name: file,
        url: `/uploads/images/${file}`,
      })),
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
app.use("/courseCards", courseCardsRouter);
app.use("/sitemap", sitemapRouter);
app.use("/coupons", couponsRouter);
app.use("/customer", customerRouter);

// Utility to hash user data
const hashData = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

// app.post("/api/track-event", async (req, res) => {
//   const { eventName, eventData } = req.body;

//   // Prepare event payload
//   const payload = {
//     data: [
//       {
//         event_name: eventName,
//         event_time: Math.floor(Date.now() / 1000), // Current timestamp
//         user_data: {
//           em: hashData(eventData.email), // Hash email
//           ph: hashData(eventData.phone), // Hash phone number
//         },
//         custom_data: {
//           value: eventData.value,
//           currency: "INR",
//           product_id: eventData.product_id,
//         },
//         event_source_url: eventData.eventSourceUrl,
//         action_source: "website",
//       },
//     ],
//     access_token: ACCESS_TOKEN,
//   };
//   try {
//     // Send event to Stape
//     const response = await axios.post(STAPE_URL, payload);
//     console.log("Event sent successfully:", response.data);
//     res.status(200).send(response.data);
//   } catch (error) {
//     console.error(
//       "Error sending event:",
//       error.response?.data || error.message
//     );
//     res.status(500).send("Error tracking event");
//   }
// });

app.post('/track-event', async (req, res) => {
  const { eventName, eventData } = req.body;

  // const payload = {
  //     data: [
  //         {
  //             event_name: eventName,
  //             event_time: Math.floor(Date.now() / 1000), // Current timestamp
  //             user_data: eventData.user_data, // Hashed user data
  //             custom_data: eventData.custom_data, // Custom event data (e.g., value, currency)
  //             event_source_url: eventData.event_source_url,
  //             action_source: 'website',
  //         },
  //     ],
  //     access_token: ACCESS_TOKEN,
  // };
  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(new Date().getTime() / 1000),
        user_data: {
          em: hashData(eventData.email), // Email, hashed
          ph: hashData(eventData.phone), // Phone number, hashed
          // Add additional user data as needed
        },
        custom_data: {
          currency: eventData.currency,
          value: eventData.value,
          // Add additional custom data as needed
        },
        event_source_url: eventData.eventSourceUrl,
        action_source: 'website',
      },
    ],
    access_token: ACCESS_TOKEN,
  };
  try {
    const url = `https://graph.facebook.com/v13.0/${PIXEL_ID}/events`;
      const response = await axios.post(url, payload);
      console.log('Event successfully sent to CAPIG:', response.data);
      res.status(200).send(response.data);
  } catch (error) {
      console.error('Error sending event to CAPIG:', error.response ? error.response.data : error.message);
      res.status(500).send('Error sending event');
  }
});

module.exports = app;
