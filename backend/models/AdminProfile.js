const mongoose = require("mongoose");

const adminProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    position: {
      type: String,
    },
    contactNumber: {
      type: String,
    },
    achievements: {
      type: String,
    },
    skills: {
      type: String,
    },
    interests: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminProfile", adminProfileSchema);
