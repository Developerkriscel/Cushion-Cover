import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    image: String,
    ctaLabel: String,
    ctaLink: String,
    placement: { type: String, default: "home-hero" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Banner", bannerSchema);
