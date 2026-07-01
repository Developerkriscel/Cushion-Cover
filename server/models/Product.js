import mongoose from "mongoose";
import { toSlug } from "../utils/slug.js";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true }
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    images: [
      {
        url: String,
        publicId: String,
        alt: String
      }
    ],
    colors: [String],
    sizes: [String],
    fabric: String,
    stock: { type: Number, required: true, default: 0 },
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likesCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    popularity: { type: Number, default: 0 },
    care: String
  },
  { timestamps: true }
);

productSchema.pre("validate", function setSlug(next) {
  if (!this.slug && this.name) this.slug = toSlug(this.name);
  next();
});

productSchema.index({ name: "text", description: "text", fabric: "text" });

export default mongoose.model("Product", productSchema);
