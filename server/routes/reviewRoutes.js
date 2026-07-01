import express from "express";
import {
  submitReview,
  getProductReviews,
  checkPurchase
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, submitReview);
router.get("/product/:productId", getProductReviews);
router.get("/check-purchase/:productId", protect, checkPurchase);

export default router;
