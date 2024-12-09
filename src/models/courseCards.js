const mongoose = require("mongoose");

const coursesCardSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  image: { type: String },
  link: { type: String },
  price: { type: String, default: "Free" },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  badges: { type: [String], default: [] },
});



const CourseCard = mongoose.model("coursescards", coursesCardSchema);

module.exports = CourseCard;
