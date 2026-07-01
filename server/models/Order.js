import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    name: String,
    quantity: { type: Number, required: true },
    image: String,
    price: { type: Number, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    color: String,
    size: String,
    fabric: String
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    is_guest: { type: Boolean, default: false },
    guestInfo: {
      fullName: String,
      email: { type: String, lowercase: true, trim: true },
      phone: String
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
      fullName: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    paymentMethod: { type: String, enum: ["Razorpay", "Stripe", "COD", "Online Payment"], default: "Razorpay" },
    paymentResult: {
      id: String,
      orderId: String,
      signature: String,
      status: String,
      emailAddress: String
    },
    coupon: {
      code: String,
      discountAmount: Number
    },
    itemsPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
    orderStatus: {
      type: String,
      enum: ["Processing", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"],
      default: "Processing"
    },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    deliveredAt: Date
  },
  { timestamps: true }
);

orderSchema.pre("validate", function setOrderNumber(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const stamp = date.toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    this.orderNumber = `EHD-${stamp}-${random}`;
  }
  next();
});

export default mongoose.model("Order", orderSchema);
