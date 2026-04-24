const mongoose = require("mongoose");

const schoolYearSemesterSchema = new mongoose.Schema(
  {
    schoolYear: {
      type: String,
      required: true,
      trim: true,
    },
    semester: {
      type: String,
      enum: ["1st", "2nd", "Summer"],
      default: "1st",
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

schoolYearSemesterSchema.index({ schoolYear: 1, semester: 1 }, { unique: true });

module.exports =
  mongoose.models.SchoolYearSemester ||
  mongoose.model("SchoolYearSemester", schoolYearSemesterSchema);
