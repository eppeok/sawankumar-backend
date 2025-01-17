const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    coupons: { type: Map, of: Number, default: {} }, // { couponCode: usageCount }
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
