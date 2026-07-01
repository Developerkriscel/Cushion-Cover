import express from "express";
import { body } from "express-validator";
import { changePassword, getProfile, loginUser, logoutUser, registerUser, updateProfile } from "../controllers/authController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  [body("name").trim().notEmpty(), body("email").isEmail().normalizeEmail(), body("password").isLength({ min: 8 })],
  validate,
  registerUser
);
router.post("/login", [body("email").isEmail().normalizeEmail(), body("password").notEmpty()], validate, loginUser);
router.post("/admin/login", loginUser);
router.post("/logout", protect, logoutUser);
router.route("/profile").get(protect, getProfile).put(protect, updateProfile);
router.put("/password", protect, changePassword);
router.put("/change-password", protect, changePassword);
router.get("/admin/verify", protect, admin, (_req, res) => res.json({ valid: true }));

export default router;
