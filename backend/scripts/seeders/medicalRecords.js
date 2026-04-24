const MedicalRecord = require("../../models/MedicalRecord");
const StudentProfile = require("../../models/StudentProfile");
const Event = require("../../models/Event");
const { connectAndRun } = require("./shared");

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const MEDICAL_STATUSES = ["Cleared", "Pending Review", "Needs Update"];

const toDateString = (date) => date.toISOString().slice(0, 10);

const seedMedicalRecordsCore = async ({ reset = false } = {}) => {
  if (reset) {
    await MedicalRecord.deleteMany({});
  }

  const [students, events] = await Promise.all([
    StudentProfile.find().sort({ studentNumber: 1 }),
    Event.find().sort({ date: -1 }),
  ]);

  if (students.length === 0) {
    console.log("Medical records seed skipped: no student profiles found.");
    return;
  }

  for (let i = 0; i < students.length; i += 1) {
    const student = students[i];
    const fullName = [student.firstName, student.middleName, student.lastName].filter(Boolean).join(" ").trim();
    const status = MEDICAL_STATUSES[i % MEDICAL_STATUSES.length];
    const event = i % 5 === 0 && events.length > 0 ? events[i % events.length] : null;
    const scope = event ? "Event Requirement" : "Standalone";
    const checkupDate = new Date();
    checkupDate.setDate(checkupDate.getDate() - (i % 90));

    await MedicalRecord.findOneAndUpdate(
      { studentId: student.studentNumber },
      {
        scope,
        event: event?._id || null,
        studentId: student.studentNumber,
        name: fullName || student.studentNumber,
        bloodType: BLOOD_TYPES[i % BLOOD_TYPES.length],
        conditions: i % 9 === 0 ? "Mild asthma" : "",
        lastCheckup: toDateString(checkupDate),
        status,
        documents: [
          {
            fileName: `medical-clearance-${student.studentNumber}.pdf`,
            uploadDate: toDateString(checkupDate),
            fileSize: `${180 + (i % 120)} KB`,
          },
        ],
        history: [
          {
            checkupDate: toDateString(checkupDate),
            conditions: i % 9 === 0 ? "Mild asthma" : "",
            bloodType: BLOOD_TYPES[i % BLOOD_TYPES.length],
            dateCompleted: toDateString(checkupDate),
            status,
            documentAttached: `medical-clearance-${student.studentNumber}.pdf`,
          },
        ],
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );
  }

  console.log("Medical records seed completed.");
};

const seedMedicalRecords = async (options = {}) => connectAndRun(() => seedMedicalRecordsCore(options));

if (require.main === module) {
  const reset = process.argv.includes("--reset");
  seedMedicalRecords({ reset }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  seedMedicalRecordsCore,
  seedMedicalRecords,
};
