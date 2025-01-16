const Customer = require('../models/customer');

// Function to insert customer contact information and handle coupon usage
const insertContact = async (req, res) => {
  const { email, name, phone, couponCode } = req.body;

  try {
    // Check if customer already exists by email or phone
    let customer = await Customer.findOne({ $or: [{ email }, { phone }] });
    if (customer) {
      // If the customer exists and couponCode is provided, increment coupon usage
      if (couponCode) {
        if (!customer.coupons) {
          customer.coupons = new Map();
        }
        const usageCount = customer.coupons.get(couponCode) || 0;
        customer.coupons.set(couponCode, usageCount + 1);
      }

      // Update the existing customer's contact info
      customer.name = name;
      customer.phone = phone;
      customer.email = email;
      await customer.save();
      return res.status(200).json({ message: "Customer contact information updated successfully" });
    }

    // If customer does not exist, create a new customer with the contact details and coupon code
    const newCustomer = new Customer({
      email,
      name,
      phone,
      coupons: couponCode ? new Map([[couponCode, 1]]) : new Map(), // If couponCode is provided, set its usage count to 1
    });

    await newCustomer.save();
    res.status(201).json({ message: "Customer contact information added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { insertContact };
