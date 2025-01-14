const express = require('express');
const couponController = require('../controllers/coupon.controller');

const router = express.Router();

router.post('/', couponController.createCoupon);
router.post('/verify', couponController.verifyCoupon);
router.post('/check', couponController.checkCouponCodeExists);

router.get('/getCourses', couponController.getCoursesForCoupon);
router.get('/', couponController.getCoupons);
router.get('/:id', couponController.getCouponById);

router.put('/:id', couponController.updateCoupon);

router.delete('/:id', couponController.deleteCoupon);

module.exports = router;
