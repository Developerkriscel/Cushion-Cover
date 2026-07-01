import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const userPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  addresses: user.addresses,
  wishlist: user.wishlist,
  token: generateToken(user._id, user.role)
});

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error("Email is already registered");
  }

  const user = await User.create({ name, email, password, phone });
  res.status(201).json(userPayload(user));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) return res.json(userPayload(user));

  res.status(401);
  throw new Error("Invalid email or password");
});

export const getProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.name = req.body.name ?? user.name;
  user.phone = req.body.phone ?? user.phone;
  user.addresses = req.body.addresses ?? user.addresses;
  const updated = await user.save();
  res.json(userPayload(updated));
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!(await user.matchPassword(currentPassword))) {
    res.status(400);
    throw new Error("Current password is incorrect");
  }
  user.password = newPassword;
  await user.save();
  res.json({ message: "Password updated successfully" });
});

export const logoutUser = asyncHandler(async (_req, res) => {
  res.json({ message: "Logged out" });
});
