import asyncHandler from "express-async-handler";
import crypto from "crypto";
import Order from "../models/Order.js";
import { razorpay, stripe } from "../config/payments.js";

const ensurePaymentAccess = (req, res, order) => {
  if (order.is_guest) return;

  if (!req.user) {
    res.status(401);
    throw new Error("Login required for this order");
  }

  if (order.user?.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized for this order");
  }
};

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  if (!razorpay) {
    res.status(500);
    throw new Error("Razorpay is not configured");
  }
  const order = await Order.findById(req.body.orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  const paymentOrder = await razorpay.orders.create({
    amount: Math.round(order.totalPrice * 100),
    currency: "INR",
    receipt: order._id.toString()
  });
  res.json({ key: process.env.RAZORPAY_KEY_ID, paymentOrder });
});

export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(body)
    .digest("hex");

  if (expected !== razorpay_signature) {
    res.status(400);
    throw new Error("Payment verification failed");
  }

  const order = await Order.findById(orderId);
  order.isPaid = true;
  order.paidAt = new Date();
  order.orderStatus = "Confirmed";
  order.paymentResult = {
    id: razorpay_payment_id,
    orderId: razorpay_order_id,
    signature: razorpay_signature,
    status: "paid"
  };
  res.json(await order.save());
});

export const createStripeIntent = asyncHandler(async (req, res) => {
  const { currency = "inr", orderId } = req.body;
  if (!orderId) {
    res.status(400);
    throw new Error("orderId is required");
  }
  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  ensurePaymentAccess(req, res, order);
  const expectedAmount = Number(order.totalPrice);
  if (!stripe) {
    res.status(500);
    throw new Error("Stripe is not configured");
  }
  const intent = await stripe.paymentIntents.create({
    amount: Math.round(expectedAmount * 100),
    currency,
    automatic_payment_methods: { enabled: true },
    metadata: { orderId: order._id.toString() }
  });
  res.json({ clientSecret: intent.client_secret });
});

export const handlePaymentFailure = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.body.orderId);
  if (order) {
    ensurePaymentAccess(req, res, order);
    order.paymentResult = { status: "failed", id: req.body.paymentId };
    await order.save();
  }
  res.json({ message: "Payment failure recorded" });
});
