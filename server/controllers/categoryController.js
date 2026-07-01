import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";
import { toSlug } from "../utils/slug.js";

export const getCategories = asyncHandler(async (_req, res) => {
  res.json(await Category.find().sort({ name: 1 }));
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({ ...req.body, slug: req.body.slug || toSlug(req.body.name) });
  res.status(201).json(category);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  Object.assign(category, req.body);
  if (req.body.name && !req.body.slug) category.slug = toSlug(req.body.name);
  res.json(await category.save());
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  await category.deleteOne();
  res.json({ message: "Category deleted" });
});
