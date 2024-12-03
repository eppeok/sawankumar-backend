// routes/upload.routes.js

const express = require('express');
const router = express.Router();
const uploadConfig = require("../config/uploadConfig");
const { handleUploadError } = require("../middleware/uploadMiddleware");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dyljwyytr",
  api_key: "189479382335773",
  api_secret: "rL_4jo9vi2mt-CJc_jmPg6ePzL8",
});

// // Single file upload route -- npt needed
// router.post(
//   "/single",
//   uploadConfig.single("image"),
//   handleUploadError,
//   (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({
//           success: false,
//           error: "No file uploaded",
//         });
//       }

//       const fileUrl = `/uploads/images/${req.file.filename}`;

//       res.json({
//         success: true,
//         message: "File uploaded successfully",
//         path: fileUrl,
//         file: {
//           filename: req.file.filename,
//           mimetype: req.file.mimetype,
//           size: req.file.size,
//         },
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         error: "Error uploading file",
//         details: error.message,
//       });
//     }
//   }
// );

// Upload image
router.post(
  "/single",
  uploadConfig.single("image"),
  handleUploadError,
  async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        public_id: req.file.originalname,
      });

      res.json({
        success: true,
        path: result.secure_url,
        public_id: result.public_id,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error uploading file',
        details: error.message
      });
    }
  }
);

// Multiple files upload route
router.post('/multiple',
  uploadConfig.array('images', 5),
  handleUploadError,
  (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'No files uploaded' 
        });
      }

      const fileUrls = req.files.map(file => `/uploads/images/${file.filename}`);

      res.json({
        success: true,
        message: 'Files uploaded successfully',
        path: fileUrls,
        files: req.files.map(file => ({
          filename: file.filename,
          mimetype: file.mimetype,
          size: file.size
        }))
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error uploading files',
        details: error.message
      });
    }
  }
);

module.exports = router;