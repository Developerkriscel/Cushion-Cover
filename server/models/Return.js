import mongoose from "mongoose";

const returnStatuses = [
  "Requested",
  "Under Review",
  "Approved",
  "Pickup Scheduled",
  "Picked Up",
  "Received at Warehouse",
  "Refund Initiated",
  "Refunded",
  "Rejected"
];

const returnReasons = [
  "Damaged product received",
  "Wrong item received",
  "Product quality issue",
  "Product not as described",
  "Size or fit issue",
  "Changed my mind",
  "Other"
];

const returnSchema = new mongoose.Schema(
  {
    returnId: { type: String, unique: true, index: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    returnReason: { type: String, enum: returnReasons, required: true },
    comments: { type: String, default: "" },
    images: [{ type: String }],
    status: { type: String, enum: returnStatuses, default: "Requested" },
    adminNotes: { type: String, default: "" },
    restock: { type: Boolean, default: true }
  },
  { timestamps: true }
);

returnSchema.pre("validate", function setReturnId(next) {
  if (!this.returnId) {
    const stamp = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    this.returnId = `RET-${stamp}-${rand}`;
  }
  next();
});

export default mongoose.model("Return", returnSchema);
export { returnStatuses, returnReasons };
