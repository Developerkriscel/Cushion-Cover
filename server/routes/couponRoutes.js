import express from "express";
import { createCoupon, deleteCoupon, getCoupons, updateCoupon, validateCoupon } from "../controllers/couponController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/validate/:code", validateCoupon);
router.route("/").get(protect, admin, getCoupons).post(protect, admin, createCoupon);
router.route("/:id").put(protect, admin, updateCoupon).delete(protect, admin, deleteCoupon);

export default router;
