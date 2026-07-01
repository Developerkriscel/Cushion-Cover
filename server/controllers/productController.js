import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Review from "../models/Review.js";
import { toSlug } from "../utils/slug.js";

const buildProductQuery = async (query) => {
  const filter = {};
  if (query.search) filter.$text = { $search: query.search };
  if (query.category) {
    const category = await Category.findOne({ slug: query.category });
    filter.category = category?._id || query.category;
  }
  if (query.color) filter.colors = query.color;
  if (query.fabric) filter.fabric = new RegExp(query.fabric, "i");
  if (query.size) filter.sizes = query.size;
  if (query.availability === "in-stock") filter.stock = { $gt: 0 };
  if (query.featured === "true") filter.featured = true;
  if (query.bestSeller === "true") filter.bestSeller = true;
  if (query.minPrice || query.maxPrice) {
    filter.discountPrice = {};
    if (query.minPrice) filter.discountPrice.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.discountPrice.$lte = Number(query.maxPrice);
  }
  return filter;
};

export const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const sortMap = {
    priceAsc: { discountPrice: 1, price: 1 },
    priceDesc: { discountPrice: -1, price: -1 },
    newest: { createdAt: -1 },
    rating: { ratings: -1 },
    popularity: { popularity: -1 }
  };
  const filter = await buildProductQuery(req.query);
  const sort = sortMap[req.query.sort] || sortMap.newest;
  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate("category", "name slug")
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({ products, page, pages: Math.ceil(total / limit), total });
});

export const getProduct = asyncHandler(async (req, res) => {
  const idOrSlug = req.params.idOrSlug;
  const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? { $or: [{ slug: idOrSlug }, { _id: idOrSlug }] } : { slug: idOrSlug };
  const product = await Product.findOne(query).populate("category", "name slug");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

export const toggleProductLike = asyncHandler(async (req, res) => {
  const idOrSlug = req.params.idOrSlug;
  const query = mongoose.Types.ObjectId.isValid(idOrSlug) ? { $or: [{ slug: idOrSlug }, { _id: idOrSlug }] } : { slug: idOrSlug };
  const product = await Product.findOne(query);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const userId = req.user._id.toString();
  const likedBy = product.likedBy || [];
  const alreadyLiked = likedBy.some((id) => id.toString() === userId);

  if (alreadyLiked) {
    product.likedBy = likedBy.filter((id) => id.toString() !== userId);
  } else {
    product.likedBy.push(req.user._id);
  }

  product.likesCount = product.likedBy.length;
  await product.save();

  res.json({
    liked: !alreadyLiked,
    likesCount: product.likesCount
  });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({ ...req.body, slug: req.body.slug || toSlug(req.body.name) });
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  Object.assign(product, req.body);
  if (req.body.name && !req.body.slug) product.slug = toSlug(req.body.name);
  res.json(await product.save());
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  await product.deleteOne();
  res.json({ message: "Product deleted" });
});

export const addProductReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  const alreadyReviewed = product.reviews.find((review) => review.user.toString() === req.user._id.toString());
  if (alreadyReviewed) {
    res.status(400);
    throw new Error("Product already reviewed");
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(req.body.rating),
    comment: req.body.comment || req.body.review
  };
  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.ratings = product.reviews.reduce((sum, item) => sum + item.rating, 0) / product.reviews.length;
  await product.save();
  await Review.create({ user: req.user._id, product: product._id, rating: review.rating, review: review.comment });
  res.status(201).json({ message: "Review added" });
});
