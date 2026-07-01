import express from "express";
import { createBanner, getBanners, submitContact, subscribeNewsletter, updateBanner } from "../controllers/contentController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/newsletter", subscribeNewsletter);
router.post("/contact", submitContact);
router.get("/banners", getBanners);
router.post("/banners", protect, admin, createBanner);
router.put("/banners/:id", protect, admin, updateBanner);

export default router;
