const mongoose = require("mongoose");

const violationTypeSchema = new mongoose.Schema(
  {
    violationName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Attendance", "Uniform", "Behavior", "Other"],
      default: "Other",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.ViolationType || mongoose.model("ViolationType", violationTypeSchema);