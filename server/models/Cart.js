import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, default: 1, min: 1 },
        color: String,
        size: String,
        fabric: String
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
