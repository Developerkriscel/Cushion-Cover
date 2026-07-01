import express from "express";
import { createGuestOrder, createOrder, getMyOrders, getOrderById, trackGuestOrder } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.post("/guest", createGuestOrder);
router.post("/guest/track", trackGuestOrder);
router.get("/my", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

export default router;
