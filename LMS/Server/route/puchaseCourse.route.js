import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { createOrder, getAllPurchasedCourse, getCourseDetailWithPurchaseStatus, razorpayViewOrder } from '../controller/coursePurchase.controller.js';

const router=express.Router();

router.route("/checkout/create-checkout-session").post(isAuthenticated,createOrder);
router.route("/webhook").post(razorpayViewOrder);

router.route("/course/:courseId/detail-with-status").get(isAuthenticated,getCourseDetailWithPurchaseStatus);

router.route("/").get(isAuthenticated,getAllPurchasedCourse);

export default router;