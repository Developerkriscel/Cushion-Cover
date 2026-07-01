import mongoose from "mongoose";

const refundSchema = new mongoose.Schema(
  {
    returnRef: { type: mongoose.Schema.Types.ObjectId, ref: "Return", required: true, unique: true },
    refundAmount: { type: Number, required: true },
    refundMethod: {
      type: String,
      enum: ["Original Payment Method", "Store Wallet", "Bank Transfer"],
      default: "Original Payment Method"
    },
    transactionId: { type: String, default: "" },
    refundStatus: {
      type: String,
      enum: ["Pending", "Initiated", "Completed", "Failed"],
      default: "Pending"
    },
    initiatedAt: Date,
    completedAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("Refund", refundSchema);
