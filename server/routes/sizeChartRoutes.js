import express from "express";
import {
  createSizeChart, deleteSizeChart, getSizeChartByCategory,
  getSizeCharts, toggleSizeChart, updateSizeChart
} from "../controllers/sizeChartController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getSizeCharts)
  .post(protect, admin, createSizeChart);

router.get("/category/:categoryId", getSizeChartByCategory);

router.route("/:id")
  .put(protect, admin, updateSizeChart)
  .delete(protect, admin, deleteSizeChart);

router.put("/:id/toggle", protect, admin, toggleSizeChart);

export default router;
