const express = require('express');
const couponController = require('../controllers/coupon.controller');

const router = express.Router();

router.get('/getCourses', couponController.getCoursesForCoupon);
router.post('/', couponController.createCoupon);
router.get('/', couponController.getCoupons);
router.get('/:id', couponController.getCouponById);
router.put('/:id', couponController.updateCoupon);
router.delete('/:id', couponController.deleteCoupon);
router.post('/verify', couponController.verifyCoupon);

module.exports = router;
