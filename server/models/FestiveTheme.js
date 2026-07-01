import mongoose from "mongoose";

const festiveThemeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  topBannerText: { type: String, trim: true },
  topBannerImage: { type: String },
  heroBannerImage: { type: String, required: true },
  heroBannerText: { type: String, trim: true },
  heroBannerSubtext: { type: String, trim: true },
  themeColors: {
    primary: { type: String },
    secondary: { type: String },
    background: { type: String }
  },
  decorationStyle: {
    type: String,
    enum: ['none', 'diwali', 'christmas', 'newyear', 'generic_sparkle'],
    default: 'none'
  },
  createdAt: { type: Date, default: Date.now }
});

festiveThemeSchema.index({ isActive: 1, startDate: 1, endDate: 1, createdAt: -1 });

export default mongoose.model("FestiveTheme", festiveThemeSchema);
