import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import festiveRoutes from "./routes/festiveRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import returnRoutes from "./routes/returnRoutes.js";
import sizeChartRoutes from "./routes/sizeChartRoutes.js";
import { getEmailConfigStatus } from "./utils/email.js";

connectDB();

const app = express();
const frontendOrigin = process.env.CLIENT_URL || process.env.FRONTEND_URL || process.env.VITE_FRONTEND_URL;
const allowedOrigins = [frontendOrigin, "http://localhost:5173", "http://127.0.0.1:5173"].filter(Boolean);

const vercelOriginRegex = /^https:\/\/.*\.vercel\.app$/;

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (vercelOriginRegex.test(origin)) return callback(null, true);
      console.warn(`[cors] rejected origin: ${origin}`);
      return callback(null, true);
    },
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Elegant Home Decor API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/size-charts", sizeChartRoutes);
app.use("/api", festiveRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  const emailConfig = getEmailConfigStatus();
  console.log(`API running on port ${PORT}`);
  console.log("[config] frontend origin:", frontendOrigin || "(not set)");
  console.log("[config] email transport:", emailConfig.configured ? emailConfig.mode : `disabled (${emailConfig.error})`);
});
