import asyncHandler from "express-async-handler";
import User from "../models/User.js";

const normalizeAddress = (body) => ({
  label: body.label || "Home",
  name: body.name || body.fullName,
  fullName: body.fullName || body.name,
  phone: body.phone,
  line1: body.line1 || body.addressLine1,
  addressLine1: body.addressLine1 || body.line1,
  line2: body.line2 || body.addressLine2,
  addressLine2: body.addressLine2 || body.line2,
  city: body.city,
  state: body.state,
  pincode: body.pincode || body.postalCode,
  postalCode: body.postalCode || body.pincode,
  country: body.country || "India",
  isDefault: Boolean(body.isDefault)
});

const formatAddress = (address) => ({
  _id: address._id,
  label: address.label,
  fullName: address.fullName,
  name: address.name || address.fullName,
  phone: address.phone,
  addressLine1: address.addressLine1,
  line1: address.line1 || address.addressLine1,
  addressLine2: address.addressLine2,
  line2: address.line2 || address.addressLine2,
  city: address.city,
  state: address.state,
  postalCode: address.postalCode,
  pincode: address.pincode || address.postalCode,
  country: address.country,
  isDefault: address.isDefault
});

export const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user.addresses.map(formatAddress));
});

export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = normalizeAddress(req.body);

  if (address.isDefault || user.addresses.length === 0) {
    user.addresses.forEach((item) => {
      item.isDefault = false;
    });
    address.isDefault = true;
  }

  user.addresses.push(address);
  await user.save();
  res.status(201).json(user.addresses.map(formatAddress));
});

export const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.id);

  if (!address) {
    res.status(404);
    throw new Error("Address Not Found");
  }

  const updates = normalizeAddress(req.body);
  Object.assign(address, updates);

  if (updates.isDefault) {
    user.addresses.forEach((item) => {
      item.isDefault = item._id.toString() === req.params.id;
    });
  }

  await user.save();
  res.json(user.addresses.map(formatAddress));
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.id);

  if (!address) {
    res.status(404);
    throw new Error("Address Not Found");
  }

  const wasDefault = address.isDefault;
  user.addresses.pull(req.params.id);

  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();
  res.json(user.addresses.map(formatAddress));
});

export const setDefaultAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.id);

  if (!address) {
    res.status(404);
    throw new Error("Address Not Found");
  }

  user.addresses.forEach((item) => {
    item.isDefault = item._id.toString() === req.params.id;
  });

  await user.save();
  res.json(user.addresses.map(formatAddress));
});
