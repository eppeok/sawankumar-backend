const express = require("express");
const router = express.Router();
const CourseCard = require("../models/courseCards");

// Create a new course card
router.post("/", async (req, res) => {
  try {
    const courseCard = new CourseCard(req.body);
    await courseCard.save();
    res.status(201).send(courseCard);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/demo", async (req, res) => {
  try {
    const demoCourseCard = new CourseCard({
      title: "Demo Course",
      description: "This is a demo course description.",
      image: "https://res.cloudinary.com/dyljwyytr/image/upload/v1733204483/certificate-image.webp.webp",
      link: "https://res.cloudinary.com/dyljwyytr/image/upload/v1733204483/certificate-image.webp.webp",
      price: "Free",
      rating: 5,
      reviewsCount: 100,
      badges: ["Demo", "Test"],
    });
    await demoCourseCard.save();
    res.status(201).send(demoCourseCard);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Read all course cards
router.get("/", async (req, res) => {
  try {
    const courseCards = await CourseCard.find();
    res.status(200).send(courseCards);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Read a single course card by ID
router.get("/:id", async (req, res) => {
  try {
    const courseCard = await CourseCard.findById(req.params.id);
    if (!courseCard) {
      return res.status(404).send();
    }
    res.status(200).send(courseCard);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a course card by ID
router.put("/:id", async (req, res) => {
  try {
    const courseCard = await CourseCard.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!courseCard) {
      return res.status(404).send();
    }
    res.status(200).send(courseCard);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a course card by ID
router.delete("/:id", async (req, res) => {
  try {
    const courseCard = await CourseCard.findByIdAndDelete(req.params.id);
    if (!courseCard) {
      return res.status(404).send();
    }
    res.status(200).send(courseCard);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
