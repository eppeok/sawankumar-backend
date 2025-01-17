const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
});

const couponSchema = new mongoose.Schema(
  {
    couponName: { type: String, required: true },
    couponCode: { type: String, required: true, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    couponType: { type: String, required: true },
    value: { type: Number, required: true },
    maxUsage: { type: mongoose.Schema.Types.Mixed, required: true },
    courses: [courseSchema],
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
