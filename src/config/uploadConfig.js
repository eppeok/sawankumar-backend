// config/uploadConfig.js

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create upload directories if they don't exist
const uploadDir = path.join(__dirname, "../uploads");
const imagesDir = path.join(uploadDir, "images");
fs.mkdirSync(uploadDir, { recursive: true });
fs.mkdirSync(imagesDir, { recursive: true });

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, GIF, and WEBP images are allowed."
      ),
      false
    );
  }
};

// Multer configuration
const uploadConfig = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

module.exports = uploadConfig;
