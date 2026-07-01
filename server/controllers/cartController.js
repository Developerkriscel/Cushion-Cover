import asyncHandler from "express-async-handler";
import Cart from "../models/Cart.js";

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

const populatedCart = (userId) => Cart.findOne({ user: userId }).populate("items.product", "name slug price discountPrice images stock");

const normalize = (value) => String(value || "").trim();
const getItemKey = (item) =>
  [item.product.toString(), normalize(item.color), normalize(item.size), normalize(item.fabric)].join("|");

const mergeDuplicateItems = async (cart) => {
  const byKey = new Map();
  const merged = [];
  let changed = false;

  cart.items.forEach((item) => {
    const key = getItemKey(item);
    const existing = byKey.get(key);
    if (existing) {
      existing.quantity += Number(item.quantity || 1);
      changed = true;
    } else {
      byKey.set(key, item);
      merged.push(item);
    }
  });

  if (changed) {
    cart.items = merged;
    await cart.save();
  }
};

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  await mergeDuplicateItems(cart);
  res.json(await populatedCart(req.user._id));
});

export const addToCart = asyncHandler(async (req, res) => {
  const { product, quantity = 1, color, size, fabric } = req.body;
  const cart = await getOrCreateCart(req.user._id);
  const existing = cart.items.find(
    (item) =>
      item.product.toString() === product &&
      item.color === color &&
      item.size === size &&
      item.fabric === fabric
  );
  if (existing) existing.quantity += Number(quantity);
  else cart.items.push({ product, quantity, color, size, fabric });
  await mergeDuplicateItems(cart);
  await cart.save();
  res.status(201).json(await populatedCart(req.user._id));
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(req.params.itemId);
  if (!item) {
    res.status(404);
    throw new Error("Cart item not found");
  }
  item.quantity = Math.max(1, Number(req.body.quantity));
  await cart.save();
  res.json(await populatedCart(req.user._id));
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items.pull(req.params.itemId);
  await cart.save();
  res.json(await populatedCart(req.user._id));
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();
  res.json(cart);
});

export const syncCart = asyncHandler(async (req, res) => {
  const { items } = req.body;
  if (!items?.length) return res.json({ message: "No items to sync" });

  const cart = await getOrCreateCart(req.user._id);
  const existingItems = cart.items.map((item) => ({
    product: item.product.toString(),
    color: item.color,
    size: item.size,
    fabric: item.fabric
  }));

  for (const item of items) {
    const key = `${item.product}|${item.color || ""}|${item.size || ""}|${item.fabric || ""}`;
    const exists = existingItems.find(
      (e) => `${e.product}|${e.color || ""}|${e.size || ""}|${e.fabric || ""}` === key
    );
    if (!exists) {
      cart.items.push({ product: item.product, quantity: item.quantity, color: item.color, size: item.size, fabric: item.fabric });
    } else {
      const idx = cart.items.findIndex(
        (i) =>
          i.product.toString() === item.product &&
          i.color === item.color &&
          i.size === item.size &&
          i.fabric === item.fabric
      );
      if (idx >= 0) cart.items[idx].quantity += Number(item.quantity || 1);
    }
  }

  await mergeDuplicateItems(cart);
  await cart.save();
  res.json(await populatedCart(req.user._id));
});
