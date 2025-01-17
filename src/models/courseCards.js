const mongoose = require("mongoose");

const coursesCardSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    image: { type: String },
    link: { type: String },
    price: { type: String },
    rating: { type: Number },
    reviewsCount: { type: Number },
    badges: { type: [String] },
  },
  {
    timestamps: true,
  }
);

const CourseCard = mongoose.model("coursescards", coursesCardSchema);

module.exports = CourseCard;
