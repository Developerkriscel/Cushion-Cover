import asyncHandler from "express-async-handler";
import SizeChart from "../models/SizeChart.js";

export const getSizeCharts = asyncHandler(async (_req, res) => {
  const charts = await SizeChart.find().populate("category", "name slug").sort({ createdAt: -1 });
  res.json(charts);
});

export const getSizeChartByCategory = asyncHandler(async (req, res) => {
  const chart = await SizeChart.findOne({ category: req.params.categoryId, isActive: true }).populate("category", "name slug");
  if (!chart) {
    res.status(404);
    throw new Error("Size chart not found for this category");
  }
  res.json(chart);
});

export const createSizeChart = asyncHandler(async (req, res) => {
  const existing = await SizeChart.findOne({ category: req.body.category });
  if (existing) {
    res.status(400);
    throw new Error("A size chart already exists for this category");
  }
  const chart = await SizeChart.create(req.body);
  const populated = await chart.populate("category", "name slug");
  res.status(201).json(populated);
});

export const updateSizeChart = asyncHandler(async (req, res) => {
  const chart = await SizeChart.findById(req.params.id);
  if (!chart) {
    res.status(404);
    throw new Error("Size chart not found");
  }
  Object.assign(chart, req.body);
  const saved = await chart.save();
  const populated = await saved.populate("category", "name slug");
  res.json(populated);
});

export const deleteSizeChart = asyncHandler(async (req, res) => {
  const chart = await SizeChart.findById(req.params.id);
  if (!chart) {
    res.status(404);
    throw new Error("Size chart not found");
  }
  await chart.deleteOne();
  res.json({ message: "Size chart deleted" });
});

export const toggleSizeChart = asyncHandler(async (req, res) => {
  const chart = await SizeChart.findById(req.params.id);
  if (!chart) {
    res.status(404);
    throw new Error("Size chart not found");
  }
  chart.isActive = !chart.isActive;
  const saved = await chart.save();
  const populated = await saved.populate("category", "name slug");
  res.json(populated);
});
