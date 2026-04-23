const Event = require("../../models/Event");
const User = require("../../models/User");
const { connectAndRun } = require("./shared");

const EVENT_BLUEPRINTS = [
  { title: "CodeFest Hackathon", location: "CCS Main Lab", status: "Upcoming", maxParticipants: 120, hour: "08:00" },
  { title: "Web Development Workshop", location: "Room 302", status: "Upcoming", maxParticipants: 60, hour: "13:00" },
  { title: "AI and Data Science Forum", location: "Auditorium A", status: "Ongoing", maxParticipants: 180, hour: "10:00" },
  { title: "Cybersecurity Awareness Seminar", location: "Room 401", status: "Completed", maxParticipants: 90, hour: "09:00" },
  { title: "IT Skills Assessment Day", location: "Lab 2", status: "Upcoming", maxParticipants: 80, hour: "14:00" },
  { title: "Mobile App Sprint", location: "Innovation Hub", status: "Cancelled", maxParticipants: 70, hour: "11:00" },
];

const toDateString = (date) => date.toISOString().slice(0, 10);

const seedEventsCore = async ({ reset = false, userMap } = {}) => {
  if (reset) {
    await Event.deleteMany({});
  }

  const allUsers = await User.find().sort({ userId: 1 });
  const studentUsers = allUsers.filter((user) => user.role === "student");
  const facultyAndAdmin = allUsers.filter((user) => user.role !== "student");

  for (let i = 0; i < 24; i += 1) {
    const blueprint = EVENT_BLUEPRINTS[i % EVENT_BLUEPRINTS.length];
    const offsetDays = i - 8;
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + offsetDays);
    const title = `${blueprint.title} ${2026 + Math.floor(i / EVENT_BLUEPRINTS.length)}`;

    const participants = studentUsers.slice((i * 7) % Math.max(studentUsers.length, 1), ((i * 7) % Math.max(studentUsers.length, 1)) + 10).map((user) => user._id);
    const applications = studentUsers.slice((i * 5) % Math.max(studentUsers.length, 1), ((i * 5) % Math.max(studentUsers.length, 1)) + 12).map((user, idx) => ({
      user: user._id,
      applicationStatus: idx % 4 === 0 ? "Rejected" : (idx % 3 === 0 ? "Pending" : "Approved"),
      role: idx % 5 === 0 ? "Volunteer" : "Participant",
      applicationDate: new Date(eventDate.getTime() - (idx + 2) * 24 * 60 * 60 * 1000),
      reviewedBy: facultyAndAdmin.length > 0 ? facultyAndAdmin[idx % facultyAndAdmin.length]._id : null,
      reviewDate: idx % 3 === 0 ? null : new Date(eventDate.getTime() - (idx + 1) * 24 * 60 * 60 * 1000),
      remarks: idx % 4 === 0 ? "Requirements incomplete." : "",
    }));

    await Event.findOneAndUpdate(
      { title },
      {
        title,
        description: `${blueprint.title} activity focused on student engagement, practical outcomes, and institutional collaboration.`,
        date: toDateString(eventDate),
        time: blueprint.hour,
        location: blueprint.location,
        status: blueprint.status,
        maxParticipants: blueprint.maxParticipants,
        participants,
        applications,
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );
  }

  console.log("Events seed completed.");
};

const seedEvents = async (options = {}) => connectAndRun(() => seedEventsCore(options));

if (require.main === module) {
  const reset = process.argv.includes("--reset");

  seedEvents({ reset }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  seedEventsCore,
  seedEvents,
};
