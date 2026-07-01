import express from "express";
import {
  createFestiveTheme,
  deleteFestiveTheme,
  getActiveFestiveTheme,
  getAllFestiveThemes,
  toggleFestiveTheme,
  updateFestiveTheme
} from "../controllers/festiveController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();
const themeUpload = upload.fields([
  { name: "topBannerImage", maxCount: 1 },
  { name: "heroBannerImage", maxCount: 1 }
]);

router.get("/festive/active", getActiveFestiveTheme);

router.post("/admin/festive/add", protect, admin, themeUpload, createFestiveTheme);
router.get("/admin/festive/all", protect, admin, getAllFestiveThemes);
router.put("/admin/festive/edit/:id", protect, admin, themeUpload, updateFestiveTheme);
router.delete("/admin/festive/delete/:id", protect, admin, deleteFestiveTheme);
router.patch("/admin/festive/toggle/:id", protect, admin, toggleFestiveTheme);

export default router;
