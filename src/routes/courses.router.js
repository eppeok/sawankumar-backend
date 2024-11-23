const express = require("express");
const Controller = require("../controllers/controller");
const Course = require('../models/Course');
const router = express.Router();

// Get course by slug
router.get('/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const course = await Course.findOne({ slug }).lean();
      
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }
  
      res.set('Cache-Control', 'public, max-age=30000');
      res.status(200).json({ success: true, data: course });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Error fetching course' 
      });
    }
});

// Create new course
router.post('/create', async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json({ success: true, data: course });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Error creating course'
        });
    }
});

// Update course by slug
router.put('/:slug', async (req, res) => {
    try {
        const course = await Course.findOneAndUpdate(
            { slug: req.params.slug },
            req.body,
            { new: true, runValidators: true }
        );

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Error updating course'
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
            message: error instanceof Error ? error.message : 'Error deleting course'
        });
    }
});

module.exports = router;