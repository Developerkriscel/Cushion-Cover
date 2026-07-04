import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import cloudinary from "../config/cloudinary.js";
import { toSlug } from "../utils/slug.js";
import { sendTestEmail, getEmailConfigStatus } from "../utils/email.js";

const uploadBuffer = (file) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "elegant-home-decor/products", resource_type: "image" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(file.buffer);
  });

const parseList = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const parseBoolean = (value) => value === true || value === "true" || value === "on";

const buildProductPayload = (body) => ({
  name: body.name,
  slug: body.slug || toSlug(body.name),
  description: body.description,
  category: body.category,
  price: Number(body.price || 0),
  discountPrice: body.discountPrice ? Number(body.discountPrice) : undefined,
  colors: parseList(body.colors),
  sizes: parseList(body.sizes),
  fabric: body.fabric,
  stock: Number(body.stock || 0),
  featured: parseBoolean(body.featured),
  bestSeller: parseBoolean(body.bestSeller),
  care: body.care
});

const uploadProductImages = async (files = []) => {
  if (!files.length) return [];
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error("Cloudinary is not configured");
  }
  const uploads = await Promise.all(files.map(uploadBuffer));
  return uploads.map((image) => ({
    url: image.secure_url,
    publicId: image.public_id,
    alt: ""
  }));
};

const getLowStockThreshold = () => Number(process.env.LOW_STOCK_THRESHOLD) || 5;

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const threshold = getLowStockThreshold();
  const [totalSalesAgg, totalOrders, totalUsers, totalProducts, totalCategories, lowStockProducts, recentOrders] =
    await Promise.all([
      Order.aggregate([{ $match: { isPaid: true } }, { $group: { _id: null, total: { $sum: "$totalPrice" } } }]),
      Order.countDocuments(),
      User.countDocuments({ role: "user" }),
      Product.countDocuments(),
      Category.countDocuments(),
      Product.find({ stock: { $lte: threshold } }).select("name stock slug images").limit(8),
      Order.find().populate("user", "name email").sort({ createdAt: -1 }).limit(8)
    ]);

  res.json({
    totalSales: totalSalesAgg[0]?.total || 0,
    totalOrders,
    totalUsers,
    totalProducts,
    totalCategories,
    lowStockProducts,
    recentOrders
  });
});

export const getAllOrders = asyncHandler(async (_req, res) => {
  res.json(await Order.find().populate("user", "name email").sort({ createdAt: -1 }));
});

export const getAllUsers = asyncHandler(async (_req, res) => {
  res.json(await User.find().select("-password").sort({ createdAt: -1 }));
});

export const getAdminProducts = asyncHandler(async (_req, res) => {
  res.json(await Product.find().populate("category", "name slug").sort({ createdAt: -1 }));
});

export const sendEmailTest = asyncHandler(async (req, res) => {
  const recipient = req.user?.email || process.env.ADMIN_EMAIL || process.env.EMAIL_USER || process.env.SMTP_USER;
  if (!recipient) {
    res.status(400);
    throw new Error("No recipient available for the test email");
  }

  await sendTestEmail({ to: recipient, label: "Admin Email Test" });
  res.json({ message: `Test email sent to ${recipient}` });
});

export const getEmailConfig = asyncHandler(async (_req, res) => {
  const config = getEmailConfigStatus();
  res.json({
    ...config,
    envVars: {
      SMTP_HOST: process.env.SMTP_HOST ? "✓ set" : "not set",
      SMTP_USER: process.env.SMTP_USER ? "✓ set" : "not set",
      SMTP_PORT: process.env.SMTP_PORT || "587 (default)",
      EMAIL_USER: process.env.EMAIL_USER ? "✓ set" : "not set",
      EMAIL_PASS: process.env.EMAIL_PASS ? "✓ set (hidden)" : "not set",
      MAIL_FROM: process.env.MAIL_FROM || "not set",
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || "not set",
      CLIENT_URL: process.env.CLIENT_URL || "not set",
      LOW_STOCK_THRESHOLD: process.env.LOW_STOCK_THRESHOLD || "5 (default)"
    }
  });
});

export const createAdminProduct = asyncHandler(async (req, res) => {
  const images = await uploadProductImages(req.files);
  if (!images.length) {
    res.status(400);
    throw new Error("At least one product image is required");
  }

  const product = await Product.create({
    ...buildProductPayload(req.body),
    images: images.map((image) => ({ ...image, alt: req.body.name }))
  });

  res.status(201).json(await product.populate("category", "name slug"));
});

export const updateAdminProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const images = await uploadProductImages(req.files);
  Object.assign(product, buildProductPayload(req.body));
  if (images.length) {
    product.images = images.map((image) => ({ ...image, alt: req.body.name || product.name }));
  }

  res.json(await (await product.save()).populate("category", "name slug"));
});

export const getLowStockProducts = asyncHandler(async (_req, res) => {
  const threshold = getLowStockThreshold();
  const products = await Product.find({ stock: { $lte: threshold } })
    .populate("category", "name slug")
    .sort({ stock: 1 });
  res.json(products);
});

export const deleteAdminProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();
  res.json({ message: "Product deleted" });
});
