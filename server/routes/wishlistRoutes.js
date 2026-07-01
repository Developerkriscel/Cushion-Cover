import express from "express";
import { addWishlistItem, getWishlist, removeWishlistItem } from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getWishlist);
router.route("/:productId").post(protect, addWishlistItem).delete(protect, removeWishlistItem);

export default router;
