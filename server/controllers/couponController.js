import asyncHandler from "express-async-handler";
import Coupon from "../models/Coupon.js";

export const getCoupons = asyncHandler(async (_req, res) => {
  res.json(await Coupon.find().sort({ createdAt: -1 }));
});

export const createCoupon = asyncHandler(async (req, res) => {
  res.status(201).json(await Coupon.create(req.body));
});

export const validateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase(), isActive: true });
  if (!coupon || (coupon.expiryDate && coupon.expiryDate < new Date()) || coupon.usedCount >= coupon.usageLimit) {
    res.status(404);
    throw new Error("Coupon is invalid or expired");
  }
  res.json(coupon);
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }
  Object.assign(coupon, req.body);
  res.json(await coupon.save());
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }
  await coupon.deleteOne();
  res.json({ message: "Coupon deleted" });
});
