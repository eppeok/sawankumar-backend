const mongoose = require("mongoose");

const coursesCardSchema = new mongoose.Schema(
  {
    title: { type: String, require: true },
    description: { type: String, require: true },
    image: { type: String, require: true },
    link: { type: String, require: true },
    price: { type: Number },
    originalPrice: { type: Number },
    rating: { type: Number },
    reviewsCount: { type: Number },
    badges: { type: [String] },
    totalSections: { type: Number },
    totalLectures: { type: Number },
    totalDuration: { type: String },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
    },
  },
  {
    timestamps: true,
  }
);

const CourseCard = mongoose.model("coursescards", coursesCardSchema);

module.exports = CourseCard;
