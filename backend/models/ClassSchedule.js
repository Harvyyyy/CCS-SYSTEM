const mongoose = require("mongoose");

const classScheduleSchema = new mongoose.Schema(
  {
    schoolYearSemester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SchoolYearSemester",
      required: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FacultyProfile",
      required: true,
    },
    roomName: {
      type: String,
      required: true,
      trim: true,
    },
    dayOfWeek: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      required: true,
    },
    timeStart: {
      type: String,
      required: true,
    },
    timeEnd: {
      type: String,
      required: true,
    },
    scheduleType: {
      type: String,
      enum: ["Lecture", "Laboratory"],
      default: "Lecture",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

classScheduleSchema.index({
  schoolYearSemester: 1,
  section: 1,
  dayOfWeek: 1,
  timeStart: 1,
  timeEnd: 1,
});

module.exports =
  mongoose.models.ClassSchedule || mongoose.model("ClassSchedule", classScheduleSchema);
