import mongoose from "mongoose";

const requirementSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true },
    eventType: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    location: { type: String, required: true },
    venue: { type: String },
    category: {
      type: String,
      enum: ["planner", "performer", "crew"],
      required: true,
      index: true,
    },
    details: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Requirement", requirementSchema);