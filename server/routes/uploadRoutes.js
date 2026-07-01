import express from "express";
import { uploadImages } from "../controllers/uploadController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/images", protect, admin, upload.array("images", 8), uploadImages);

export default router;
