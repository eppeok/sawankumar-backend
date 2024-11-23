// middleware/uploadMiddleware.js

const multer = require('multer');

const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size is too large. Max limit is 5MB'
      });
    }
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
  
  if (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
  
  next();
};

module.exports = { handleUploadError };