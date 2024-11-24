const express = require("express");
const Controller = require("../controllers/controller");
const Course = require("../models/Course");
const router = express.Router();

// Get course by slug
router.get("/getCourses", async (req, res) => {
  try {
    const courses = await Course.find({})
      .select({
        name: 1,
        slug: 1,
        _id: 1,
      })
      .lean();

    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Error fetching course",
    });
  }
});
// Get course by slug
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug }).lean();

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Error fetching course",
    });
  }
});

// Create new course
router.post("/create", async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Error creating course",
    });
  }
});

// Update course by slug
router.put("/:slug", async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Error updating course",
    });
  }
});
router.put("/update/:id", async (req, res) => {
  try {

    const course =  await Course.findOneAndUpdate(
      { _id: req.params.id },
      req.body.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Error updating course",
    });
  }
});

// Delete course by slug
router.delete('/:slug', async (req, res) => {
    try {
        const course = await Course.findOneAndDelete({ slug: req.params.slug });

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Error deleting course",
    });
  }
});

// Duplicate course by ID
router.post("/duplicate/:id", async (req, res) => {
  try {
    // Find the original course
    const originalCourse = await Course.findById(req.params.id).lean();

    if (!originalCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Create new course object from original
    const duplicatedCourse = {
      ...originalCourse,
      _id: undefined, // Remove _id to create new document
      name: `${originalCourse.name} - Duplicate`,
      slug: `${originalCourse.slug}-duplicate-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create new course
    const newCourse = new Course(duplicatedCourse);
    await newCourse.save();

    // Return only selected fields
    const selectedFields = {
      _id: newCourse._id,
      name: newCourse.name,
      slug: newCourse.slug,
    };

    res.status(201).json({
      success: true,
      data: selectedFields,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Error duplicating course",
    });
  }
});

// Get course by ID
router.get("/data/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Error fetching course",
    });
  }
});

module.exports = router;