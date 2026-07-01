import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.json(user.wishlist);
});

export const addWishlistItem = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user.wishlist.some((id) => id.toString() === req.params.productId)) {
    user.wishlist.push(req.params.productId);
    await user.save();
  }
  res.status(201).json({ message: "Added to wishlist" });
});

export const removeWishlistItem = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.wishlist = user.wishlist.filter((id) => id.toString() !== req.params.productId);
  await user.save();
  res.json({ message: "Removed from wishlist" });
});
