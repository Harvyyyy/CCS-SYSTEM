const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    units: {
      type: Number,
      required: true,
      min: 1,
    },
    prereq: {
      type: String,
      default: "--",
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    sem: {
      type: Number,
      required: true,
      min: 1,
      max: 3,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Course || mongoose.model("Course", courseSchema);