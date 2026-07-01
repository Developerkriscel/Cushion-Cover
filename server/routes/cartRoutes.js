import express from "express";
import { addToCart, clearCart, getCart, removeCartItem, syncCart, updateCartItem } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getCart).post(protect, addToCart).delete(protect, clearCart);
router.route("/:itemId").put(protect, updateCartItem).delete(protect, removeCartItem);
router.post("/sync", protect, syncCart);

export default router;
