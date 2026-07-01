import mongoose from "mongoose";

const sizeChartRowSchema = new mongoose.Schema({
  sizeLabel: { type: String, required: true },
  width: { type: String, default: "" },
  length: { type: String, default: "" },
  height: { type: String, default: "" },
  notes: { type: String, default: "" }
}, { _id: false });

const sizeChartSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, unique: true },
  title: { type: String, default: "" },
  chartImage: { type: String, default: "" },
  rows: [sizeChartRowSchema],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("SizeChart", sizeChartSchema);
