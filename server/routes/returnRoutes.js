import express from "express";
import {
  createReturn,
  getMyReturns,
  getReturnById,
  cancelReturn,
  getEligibleReturns
} from "../controllers/returnController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/eligible", getEligibleReturns);
router.get("/my", getMyReturns);
router.post("/", createReturn);
router.get("/:id", getReturnById);
router.put("/:id/cancel", cancelReturn);

export default router;
