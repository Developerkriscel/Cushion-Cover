import mongoose from "mongoose";
import { toSlug } from "../utils/slug.js";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true },
    image: String,
    description: String,
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

categorySchema.pre("validate", function setSlug(next) {
  if (!this.slug && this.name) this.slug = toSlug(this.name);
  next();
});

export default mongoose.model("Category", categorySchema);
