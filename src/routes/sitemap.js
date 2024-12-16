// src/routes/index.js
const express = require("express");
const router = express.Router();
const Course = require("../models/course");

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find({}).select({ slug: 1, updatedAt: 1 });
    const sitemap = courses.map((course) => ({
      slug: course.slug,
      updatedAt: course.updatedAt,
      priority: 0.6, // You can adjust the priority value as needed
    }));

    res.json(sitemap);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
