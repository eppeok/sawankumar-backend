const Coupon = require("../models/coupon");
const Course = require("../models/course");
const Customer = require("../models/customer");

const createCoupon = async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).send(coupon);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).send(coupons);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).send();
    }
    res.status(200).send(coupon);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!coupon) {
      return res.status(404).send();
    }
    res.status(200).send(coupon);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).send();
    }
    res.status(200).send(coupon);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getCoursesForCoupon = async (req, res) => {
  try {
    const courses = await Course.find({})
      .select({
        name: 1,
        _id: 1,
      })
      .lean();

    if (!courses || courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found",
      });
    }

    const data = courses.map((course) => ({
      label: course.name,
      value: course._id,
    }));
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Error fetching course",
    });
  }
};

const verifyCoupon = async (req, res) => {
  try {
    const { couponCode, courseSlug, userData = "" } = req.body;
    const coupon = await Coupon.findOne({ couponCode });

    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Coupon Code" });
    }

    const currentDate = new Date();
    if (currentDate < coupon.startDate) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Coupon Code" });
    }
    if (currentDate > coupon.endDate) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon has expired" });
    }

    const courseData = await Course.findOne({ slug: courseSlug }).select({
      _id: 1,
    });

    const isCourseValid = coupon.courses.find(
      (course) => course.value.toString() === courseData._id.toString()
    );
    if (!isCourseValid) {
      return res.status(400).json({
        success: false,
        message: "Coupon is not valid for this course",
      });
    }

    if (userData !== "") {
      const { email, phone } = userData;
      const customer = await Customer.findOne({ $or: [{ email }, { phone }] });
      if (customer) {
        const couponUsageCount = customer.coupons.get(couponCode) || 0;
        if (coupon.maxUsage !== 'unlimited' && couponUsageCount >= Number(coupon.maxUsage)) {
          return res.status(400).json({
            success: false,
            message: "Coupon is inValid",
          });
        }
      }
    }

    res.status(200).json({ success: true, message: "Coupon is valid", coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const checkCouponCodeExists = async (req, res) => {
  try {
    const { couponCode } = req.body;
    const existingCoupon = await Coupon.findOne({ couponCode });

    if (existingCoupon) {
      return res.status(409).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    res.status(200).json({
      success: true,
      message: "Coupon code is available",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  getCoursesForCoupon,
  verifyCoupon,
  checkCouponCodeExists,
};
