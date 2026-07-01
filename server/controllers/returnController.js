import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Return from "../models/Return.js";
import Refund from "../models/Refund.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { sendReturnStatusEmail, sendRefundEmail } from "../utils/email.js";

const RETURN_DAYS = 10;

export const createReturn = asyncHandler(async (req, res) => {
  const { orderId, productId, quantity, returnReason, comments } = req.body;

  const order = await Order.findOne({ _id: orderId, user: req.user._id });
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.orderStatus !== "Delivered") {
    res.status(400);
    throw new Error("Returns are only allowed for delivered orders");
  }

  const daysSinceDelivery = Math.floor((Date.now() - new Date(order.deliveredAt || order.updatedAt)) / (1000 * 60 * 60 * 24));
  if (daysSinceDelivery > RETURN_DAYS) {
    res.status(400);
    throw new Error(`Return window is ${RETURN_DAYS} days from delivery. Your order was delivered ${daysSinceDelivery} days ago.`);
  }

  const orderItem = order.orderItems.find((item) => item.product.toString() === productId);
  if (!orderItem) {
    res.status(400);
    throw new Error("Product not found in this order");
  }

  const existingReturns = await Return.find({ order: orderId, product: productId, user: req.user._id, status: { $nin: ["Rejected", "Refunded"] } });
  const alreadyReturnedQty = existingReturns.reduce((sum, r) => sum + r.quantity, 0);
  const availableQty = orderItem.quantity - alreadyReturnedQty;

  if (quantity > availableQty) {
    res.status(400);
    throw new Error(`You can only return up to ${availableQty} item(s) of this product`);
  }

  const returnReq = await Return.create({
    order: orderId,
    user: req.user._id,
    product: productId,
    quantity: Number(quantity),
    returnReason,
    comments: comments || "",
    images: req.body.images || [],
    status: "Requested"
  });

  sendReturnStatusEmail({
    to: req.user.email,
    name: req.user.name,
    returnId: returnReq.returnId,
    status: "Requested"
  }).catch(() => {});

  res.status(201).json(returnReq);
});

export const getMyReturns = asyncHandler(async (req, res) => {
  const returns = await Return.find({ user: req.user._id })
    .populate("product", "name slug images")
    .populate("order", "orderNumber")
    .sort({ createdAt: -1 });

  const result = await Promise.all(
    returns.map(async (r) => {
      const refund = await Refund.findOne({ returnRef: r._id });
      return {
        ...r.toObject(),
        refund: refund || null
      };
    })
  );

  res.json(result);
});

export const getReturnById = asyncHandler(async (req, res) => {
  const returnReq = await Return.findById(req.params.id)
    .populate("product", "name slug images price discountPrice")
    .populate("order", "orderNumber");

  if (!returnReq) {
    res.status(404);
    throw new Error("Return request not found");
  }

  if (returnReq.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized");
  }

  const refund = await Refund.findOne({ returnRef: returnReq._id });

  res.json({ ...returnReq.toObject(), refund: refund || null });
});

export const cancelReturn = asyncHandler(async (req, res) => {
  const returnReq = await Return.findOne({ _id: req.params.id, user: req.user._id });

  if (!returnReq) {
    res.status(404);
    throw new Error("Return request not found");
  }

  if (!["Requested", "Under Review"].includes(returnReq.status)) {
    res.status(400);
    throw new Error("Return can only be cancelled when in Requested or Under Review status");
  }

  returnReq.status = "Rejected";
  await returnReq.save();

  res.json({ message: "Return request cancelled", returnReq });
});

export const getAllReturns = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, "i");
    const users = await mongoose.model("User").find({ name: searchRegex }).select("_id");
    const userIds = users.map((u) => u._id);
    const orders = await Order.find({ orderNumber: searchRegex }).select("_id");
    const orderIds = orders.map((o) => o._id);
    const products = await Product.find({ name: searchRegex }).select("_id");
    const productIds = products.map((p) => p._id);

    filter.$or = [
      { returnId: searchRegex },
      { user: { $in: userIds } },
      { order: { $in: orderIds } },
      { product: { $in: productIds } }
    ];
  }

  const returns = await Return.find(filter)
    .populate("user", "name email")
    .populate("product", "name slug images")
    .populate("order", "orderNumber")
    .sort({ createdAt: -1 });

  const result = await Promise.all(
    returns.map(async (r) => {
      const refund = await Refund.findOne({ returnRef: r._id });
      return { ...r.toObject(), refund: refund || null };
    })
  );

  res.json(result);
});

export const getReturnDetail = asyncHandler(async (req, res) => {
  const returnReq = await Return.findById(req.params.id)
    .populate("user", "name email phone")
    .populate("product", "name slug images price discountPrice stock")
    .populate("order", "orderNumber orderItems shippingAddress totalPrice");

  if (!returnReq) {
    res.status(404);
    throw new Error("Return request not found");
  }

  const refund = await Refund.findOne({ returnRef: returnReq._id });

  res.json({ ...returnReq.toObject(), refund: refund || null });
});

export const updateReturnStatus = asyncHandler(async (req, res) => {
  const { status, restock } = req.body;
  const returnReq = await Return.findById(req.params.id)
    .populate("user", "name email")
    .populate("product", "name stock")
    .populate("order", "orderNumber");

  if (!returnReq) {
    res.status(404);
    throw new Error("Return request not found");
  }

  const validStatuses = ["Requested", "Under Review", "Approved", "Pickup Scheduled", "Picked Up", "Received at Warehouse", "Refund Initiated", "Refunded", "Rejected"];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  const oldStatus = returnReq.status;
  returnReq.status = status;
  if (restock !== undefined) returnReq.restock = restock;
  await returnReq.save();

  if (status === "Received at Warehouse" && returnReq.restock) {
    await Product.findByIdAndUpdate(returnReq.product._id, { $inc: { stock: returnReq.quantity } });
  }

  if (status === "Refunded" && !returnReq.restock) {
    await Product.findByIdAndUpdate(returnReq.product._id, { $inc: { stock: -returnReq.quantity } });
  }

  if (["Approved", "Rejected", "Pickup Scheduled"].includes(status)) {
    sendReturnStatusEmail({
      to: returnReq.user.email,
      name: returnReq.user.name,
      returnId: returnReq.returnId,
      status
    }).catch(() => {});
  }

  res.json(returnReq);
});

export const updateReturnNotes = asyncHandler(async (req, res) => {
  const returnReq = await Return.findById(req.params.id);
  if (!returnReq) {
    res.status(404);
    throw new Error("Return request not found");
  }

  returnReq.adminNotes = req.body.adminNotes || "";
  await returnReq.save();

  res.json(returnReq);
});

export const initiateRefund = asyncHandler(async (req, res) => {
  const returnReq = await Return.findById(req.params.id)
    .populate("user", "name email")
    .populate("order", "orderNumber itemsPrice totalPrice shippingPrice taxPrice");

  if (!returnReq) {
    res.status(404);
    throw new Error("Return request not found");
  }

  if (returnReq.status !== "Received at Warehouse" && returnReq.status !== "Refund Initiated") {
    res.status(400);
    throw new Error("Refund can only be initiated after product is received at warehouse");
  }

  const { refundMethod, transactionId, refundAmount } = req.body;

  const order = returnReq.order;
  const orderItem = order.orderItems.find((item) => item.product.toString() === returnReq.product._id?.toString() || item.product.toString() === returnReq.product.toString());
  const itemPrice = orderItem ? orderItem.price * returnReq.quantity : 0;

  const amount = refundAmount || itemPrice;

  let refund = await Refund.findOne({ returnRef: returnReq._id });

  if (refund) {
    refund.refundAmount = amount;
    refund.refundMethod = refundMethod || refund.refundMethod;
    refund.transactionId = transactionId || refund.transactionId;
    refund.refundStatus = "Initiated";
    refund.initiatedAt = new Date();
  } else {
    refund = await Refund.create({
      returnRef: returnReq._id,
      refundAmount: amount,
      refundMethod: refundMethod || "Original Payment Method",
      transactionId: transactionId || "",
      refundStatus: "Initiated",
      initiatedAt: new Date()
    });
  }

  await refund.save();

  returnReq.status = "Refund Initiated";
  await returnReq.save();

  sendReturnStatusEmail({
    to: returnReq.user.email,
    name: returnReq.user.name,
    returnId: returnReq.returnId,
    status: "Refund Initiated"
  }).catch(() => {});

  res.json({ returnReq, refund });
});

export const completeRefund = asyncHandler(async (req, res) => {
  const refund = await Refund.findOne({ returnRef: req.params.id }).populate({
    path: "returnRef",
    populate: { path: "user", select: "name email" }
  });

  if (!refund) {
    res.status(404);
    throw new Error("Refund not found");
  }

  const { transactionId } = req.body;

  refund.refundStatus = "Completed";
  refund.completedAt = new Date();
  if (transactionId) refund.transactionId = transactionId;
  await refund.save();

  const returnReq = refund.returnRef;
  returnReq.status = "Refunded";
  await returnReq.save();

  sendRefundEmail({
    to: returnReq.user.email,
    name: returnReq.user.name,
    returnId: returnReq.returnId,
    amount: refund.refundAmount,
    method: refund.refundMethod
  }).catch(() => {});

  res.json({ refund, returnReq });
});

export const getEligibleReturns = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
    orderStatus: "Delivered"
  }).populate("orderItems.product", "name slug images");

  const result = [];
  const now = Date.now();

  for (const order of orders) {
    const deliveryDate = order.deliveredAt || order.updatedAt;
    const daysSinceDelivery = Math.floor((now - new Date(deliveryDate)) / (1000 * 60 * 60 * 24));
    const isWithinWindow = daysSinceDelivery <= RETURN_DAYS;

    if (!isWithinWindow) continue;

    for (const item of order.orderItems) {
      const existingReturns = await Return.find({
        order: order._id,
        product: item.product?._id || item.product,
        user: req.user._id,
        status: { $nin: ["Rejected", "Refunded"] }
      });
      const alreadyReturnedQty = existingReturns.reduce((sum, r) => sum + r.quantity, 0);
      const returnableQty = item.quantity - alreadyReturnedQty;

      if (returnableQty > 0) {
        result.push({
          orderId: order._id,
          orderNumber: order.orderNumber,
          product: item.product,
          quantity: item.quantity,
          returnableQty,
          deliveredAt: deliveryDate,
          daysLeft: RETURN_DAYS - daysSinceDelivery
        });
      }
    }
  }

  res.json(result);
});
