import asyncHandler from "express-async-handler";
import Newsletter from "../models/Newsletter.js";
import Banner from "../models/Banner.js";

export const subscribeNewsletter = asyncHandler(async (req, res) => {
  const exists = await Newsletter.findOne({ email: req.body.email });
  if (exists) return res.json({ message: "You are already subscribed" });
  await Newsletter.create({ email: req.body.email });
  res.status(201).json({ message: "Subscription confirmed" });
});

export const submitContact = asyncHandler(async (req, res) => {
  console.log("Contact form submission", req.body);
  res.status(201).json({ message: "Thanks for reaching out. Our team will reply shortly." });
});

export const getBanners = asyncHandler(async (_req, res) => {
  res.json(await Banner.find({ isActive: true }).sort({ createdAt: -1 }));
});

export const createBanner = asyncHandler(async (req, res) => {
  res.status(201).json(await Banner.create(req.body));
});

export const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }
  Object.assign(banner, req.body);
  res.json(await banner.save());
});
