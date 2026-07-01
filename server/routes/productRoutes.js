import express from "express";
import {
  addProductReview,
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  toggleProductLike,
  updateProduct
} from "../controllers/productController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.post("/:idOrSlug/like", protect, toggleProductLike);
router.route("/:idOrSlug").get(getProduct);
router.route("/:id").put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);
router.post("/:id/reviews", protect, addProductReview);

export default router;
