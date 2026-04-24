const StudentViolation = require("../../models/StudentViolation");
const StudentProfile = require("../../models/StudentProfile");
const ViolationType = require("../../models/ViolationType");
const User = require("../../models/User");
const { connectAndRun } = require("./shared");

const OFFENSE_LEVELS = ["1st", "2nd", "3rd", "4th"];

const seedViolationsCore = async ({ reset = false } = {}) => {
  if (reset) {
    await StudentViolation.deleteMany({});
  }

  const [students, violationTypes, reporters] = await Promise.all([
    StudentProfile.find().sort({ studentNumber: 1 }),
    ViolationType.find().sort({ violationName: 1 }),
    User.find({ role: { $in: ["admin", "faculty"] } }).sort({ userId: 1 }),
  ]);

  if (students.length === 0 || violationTypes.length === 0 || reporters.length === 0) {
    console.log("Violations seed skipped: missing students/violation types/reporters.");
    return;
  }

  const totalRecords = Math.min(Math.max(120, Math.floor(students.length * 0.7)), 450);
  const baseDate = new Date("2026-04-15T00:00:00.000Z");

  for (let i = 0; i < totalRecords; i += 1) {
    const student = students[i % students.length];
    const violationType = violationTypes[(i * 3) % violationTypes.length];
    const reporter = reporters[(i * 5) % reporters.length];
    const date = new Date(baseDate);
    date.setUTCDate(baseDate.getUTCDate() - (i % 180));

    await StudentViolation.findOneAndUpdate(
      {
        student: student._id,
        violationType: violationType._id,
        violationDate: date,
      },
      {
        student: student._id,
        violationType: violationType._id,
        offenseLevel: OFFENSE_LEVELS[i % OFFENSE_LEVELS.length],
        violationDate: date,
        violationTime: `${String(7 + (i % 10)).padStart(2, "0")}:${i % 2 === 0 ? "15" : "45"}`,
        description: `Recorded ${violationType.violationName.toLowerCase()} incident during class hours.`,
        concernedPersonnel: reporter.name,
        disciplinaryAction: i % 4 === 0 ? "Written warning issued" : "Counseling and reminder",
        remarks: i % 6 === 0 ? "Parent informed." : "",
        reportedBy: reporter._id,
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );
  }

  console.log("Violations seed completed.");
};

const seedViolations = async (options = {}) => connectAndRun(() => seedViolationsCore(options));

if (require.main === module) {
  const reset = process.argv.includes("--reset");
  seedViolations({ reset }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  seedViolationsCore,
  seedViolations,
};
