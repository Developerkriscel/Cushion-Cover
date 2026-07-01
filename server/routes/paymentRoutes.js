import express from "express";
import {
  createRazorpayOrder,
  createStripeIntent,
  handlePaymentFailure,
  verifyRazorpayPayment
} from "../controllers/paymentController.js";
import { optionalProtect, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/razorpay/order", protect, createRazorpayOrder);
router.post("/razorpay/verify", protect, verifyRazorpayPayment);
router.post("/stripe/intent", protect, createStripeIntent);
router.post("/create-payment-intent", optionalProtect, createStripeIntent);
router.post("/failure", optionalProtect, handlePaymentFailure);

export default router;
