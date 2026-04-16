const mongoose = require("mongoose");

const studentViolationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
    },
    violationType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ViolationType",
      required: true,
    },
    offenseLevel: {
      type: String,
      required: true,
      enum: ["1st", "2nd", "3rd", "4th"],
      default: "1st",
    },
    violationDate: {
      type: Date,
      required: true,
    },
    violationTime: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      trim: true,
    },
    concernedPersonnel: {
      type: String,
      trim: true,
    },
    disciplinaryAction: {
      type: String,
      trim: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.StudentViolation || mongoose.model("StudentViolation", studentViolationSchema);