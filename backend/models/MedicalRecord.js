const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
  {
    scope: {
      type: String,
      enum: ["Standalone", "Event Requirement"],
      default: "Standalone",
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: null,
    },
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    bloodType: {
      type: String,
      trim: true,
      default: "",
    },
    conditions: {
      type: String,
      trim: true,
      default: "",
    },
    lastCheckup: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Cleared", "Pending Review", "Needs Update"],
      default: "Pending Review",
    },
    documents: [
      {
        fileName: {
          type: String,
          trim: true,
          default: "",
        },
        storedFileName: {
          type: String,
          trim: true,
          default: "",
        },
        filePath: {
          type: String,
          trim: true,
          default: "",
        },
        mimeType: {
          type: String,
          trim: true,
          default: "",
        },
        uploadDate: {
          type: String,
          default: "",
        },
        fileSize: {
          type: String,
          default: "",
        },
      },
    ],
    history: [
      {
        checkupDate: {
          type: String,
          default: "",
        },
        conditions: {
          type: String,
          default: "",
        },
        bloodType: {
          type: String,
          default: "",
        },
        dateCompleted: {
          type: String,
          default: "",
        },
        status: {
          type: String,
          default: "Pending Review",
        },
        documentAttached: {
          type: String,
          default: "None",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.models.MedicalRecord || mongoose.model("MedicalRecord", medicalRecordSchema);
