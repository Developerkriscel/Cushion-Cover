import asyncHandler from "express-async-handler";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { sendReviewStatusEmail } from "../utils/email.js";

const recalcProductRatings = async (productId) => {
  const result = await Review.aggregate([
    { $match: { product: productId, status: "approved" } },
    { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
  ]);
  const avg = result[0]?.avgRating || 0;
  const count = result[0]?.count || 0;
  await Product.findByIdAndUpdate(productId, { ratings: Math.round(avg * 10) / 10, numReviews: count });
};

export const submitReview = asyncHandler(async (req, res) => {
  const { productId, rating, title, review } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const hasPurchased = await Order.findOne({
    user: req.user._id,
    orderStatus: "Delivered",
    "orderItems.product": productId
  });
  if (!hasPurchased) {
    res.status(400);
    throw new Error("You can only review products you have purchased");
  }

  const existing = await Review.findOne({ user: req.user._id, product: productId });
  if (existing) {
    res.status(400);
    throw new Error("You have already reviewed this product");
  }

  const newReview = await Review.create({
    user: req.user._id,
    product: productId,
    rating: Number(rating),
    title: title || "",
    review,
    status: "pending"
  });

  res.status(201).json({
    message: "Thank you for your review. It will be visible after admin approval.",
    review: newReview
  });
});

export const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId).select("ratings numReviews");
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const reviews = await Review.find({ product: productId, status: "approved" })
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .lean();

  const mapped = reviews.map((r) => ({
    _id: r._id,
    name: r.user?.name || "Anonymous",
    rating: r.rating,
    title: r.title,
    review: r.review,
    createdAt: r.createdAt,
    verifiedPurchase: true
  }));

  res.json({
    reviews: mapped,
    ratings: product.ratings,
    numReviews: product.numReviews
  });
});

export const getAllReviews = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status && ["pending", "approved", "rejected"].includes(req.query.status)) {
    filter.status = req.query.status;
  }

  const reviews = await Review.find(filter)
    .populate("user", "name email")
    .populate("product", "name slug images")
    .sort({ createdAt: -1 });

  res.json(reviews);
});

export const approveReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id).populate("user", "name email");
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  review.status = "approved";
  await review.save();
  await recalcProductRatings(review.product);

  if (review.user?.email) {
    sendReviewStatusEmail({
      to: review.user.email,
      name: review.user.name,
      status: "approved",
      productName: (await Product.findById(review.product).select("name"))?.name || "Product"
    }).catch((emailErr) => {
      console.error("[email] review approval notification failed:", {
        message: emailErr.message,
        stack: emailErr.stack
      });
    });
  }

  res.json({ message: "Review approved successfully", review });
});

export const rejectReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id).populate("user", "name email");
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  review.status = "rejected";
  await review.save();
  await recalcProductRatings(review.product);

  if (review.user?.email) {
    sendReviewStatusEmail({
      to: review.user.email,
      name: review.user.name,
      status: "rejected",
      productName: (await Product.findById(review.product).select("name"))?.name || "Product"
    }).catch((emailErr) => {
      console.error("[email] review rejection notification failed:", {
        message: emailErr.message,
        stack: emailErr.stack
      });
    });
  }

  res.json({ message: "Review rejected", review });
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  if (req.body.rating !== undefined) review.rating = Number(req.body.rating);
  if (req.body.title !== undefined) review.title = req.body.title;
  if (req.body.review !== undefined) review.review = req.body.review;

  await review.save();

  if (review.status === "approved") {
    await recalcProductRatings(review.product);
  }

  res.json({ message: "Review updated", review });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  const { product, status } = review;
  await review.deleteOne();

  if (status === "approved") {
    await recalcProductRatings(product);
  }

  res.json({ message: "Review deleted" });
});

export const checkPurchase = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const hasPurchased = await Order.findOne({
    user: req.user._id,
    orderStatus: "Delivered",
    "orderItems.product": productId
  });

  const existing = await Review.findOne({ user: req.user._id, product: productId });

  res.json({
    canReview: Boolean(hasPurchased) && !existing,
    hasPurchased: Boolean(hasPurchased),
    hasReviewed: Boolean(existing),
    existingReview: existing
  });
});
