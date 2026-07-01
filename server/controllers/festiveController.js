import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary.js";
import FestiveTheme from "../models/FestiveTheme.js";

const uploadBuffer = (file) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "elegant-home-decor/festive-themes", resource_type: "image" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(file.buffer);
  });

const uploadField = async (files, fieldName) => {
  const file = files?.[fieldName]?.[0];
  if (!file) return "";
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error("Cloudinary is not configured");
  }
  const image = await uploadBuffer(file);
  return image.secure_url;
};

const buildThemePayload = async (body, files = {}, existingTheme = null) => {
  const topBannerImage = await uploadField(files, "topBannerImage");
  const heroBannerImage = await uploadField(files, "heroBannerImage");

  return {
    name: body.name,
    isActive: body.isActive === undefined ? existingTheme?.isActive ?? true : body.isActive === "true" || body.isActive === true,
    startDate: body.startDate,
    endDate: body.endDate,
    topBannerText: body.topBannerText,
    topBannerImage: topBannerImage || body.topBannerImage || existingTheme?.topBannerImage,
    heroBannerImage: heroBannerImage || body.heroBannerImage || existingTheme?.heroBannerImage,
    heroBannerText: body.heroBannerText,
    heroBannerSubtext: body.heroBannerSubtext,
    decorationStyle: body.decorationStyle || existingTheme?.decorationStyle || "none",
    themeColors: {
      primary: body.primary || body.themeColors?.primary,
      secondary: body.secondary || body.themeColors?.secondary,
      background: body.background || body.themeColors?.background
    }
  };
};

export const getActiveFestiveTheme = asyncHandler(async (_req, res) => {
  const today = new Date();
  const theme = await FestiveTheme.findOne({
    isActive: true,
    startDate: { $lte: today },
    endDate: { $gte: today }
  }).sort({ createdAt: -1 });

  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.json(theme || null);
});

export const getAllFestiveThemes = asyncHandler(async (_req, res) => {
  res.json(await FestiveTheme.find().sort({ createdAt: -1 }));
});

export const createFestiveTheme = asyncHandler(async (req, res) => {
  const payload = await buildThemePayload(req.body, req.files);
  if (!payload.heroBannerImage) {
    res.status(400);
    throw new Error("Hero banner image is required");
  }

  const theme = await FestiveTheme.create(payload);
  res.status(201).json(theme);
});

export const updateFestiveTheme = asyncHandler(async (req, res) => {
  const theme = await FestiveTheme.findById(req.params.id);
  if (!theme) {
    res.status(404);
    throw new Error("Festive theme not found");
  }

  Object.assign(theme, await buildThemePayload(req.body, req.files, theme));
  res.json(await theme.save());
});

export const deleteFestiveTheme = asyncHandler(async (req, res) => {
  const theme = await FestiveTheme.findById(req.params.id);
  if (!theme) {
    res.status(404);
    throw new Error("Festive theme not found");
  }

  await theme.deleteOne();
  res.json({ message: "Festive theme deleted" });
});

export const toggleFestiveTheme = asyncHandler(async (req, res) => {
  const theme = await FestiveTheme.findById(req.params.id);
  if (!theme) {
    res.status(404);
    throw new Error("Festive theme not found");
  }

  theme.isActive = !theme.isActive;
  res.json(await theme.save());
});
