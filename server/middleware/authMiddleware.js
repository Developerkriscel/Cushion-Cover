import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Not authorized, token missing");
  }

  try {
    const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      res.status(401);
      throw new Error("User no longer exists");
    }
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});

export const optionalProtect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next();
  }

  try {
    const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }

  next();
});

export const admin = (req, res, next) => {
  if (req.user?.role === "admin") return next();
  res.status(403);
  throw new Error("Admin access required");
};
