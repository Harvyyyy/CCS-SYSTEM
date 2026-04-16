const StudentProfile = require("../../models/StudentProfile");
const { connectAndRun } = require("./shared");
const { seedUsersCore } = require("./users");
const { studentProfilesToSeed } = require("./data");

const seedStudentProfilesCore = async ({ reset = false, userMap } = {}) => {
  const resolvedUserMap = userMap || await seedUsersCore({ reset: false });

  if (reset) {
    await StudentProfile.deleteMany({});
  }

  for (const profileData of studentProfilesToSeed) {
    const user = resolvedUserMap.get(profileData.userId);
    if (!user) continue;

    await StudentProfile.findOneAndUpdate(
      { user: user._id },
      {
        user: user._id,
        studentNumber: profileData.studentNumber,
        firstName: profileData.firstName,
        middleName: profileData.middleName,
        lastName: profileData.lastName,
        gender: profileData.gender,
        yearLevel: profileData.yearLevel,
        program: profileData.program,
        academicStatus: profileData.academicStatus,
        height: profileData.height,
        weight: profileData.weight,
        contactNumber: profileData.contactNumber,
        emergencyContactName: profileData.emergencyContactName,
        emergencyContactNumber: profileData.emergencyContactNumber,
        emergencyContactRelation: profileData.emergencyContactRelation,
        achievements: profileData.achievements,
        skills: profileData.skills,
        interests: profileData.interests,
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );
  }

  console.log("Student profiles seed completed.");
  return resolvedUserMap;
};

const seedStudentProfiles = async (options = {}) => connectAndRun(() => seedStudentProfilesCore(options));

if (require.main === module) {
  const reset = process.argv.includes("--reset");

  seedStudentProfiles({ reset }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  seedStudentProfilesCore,
  seedStudentProfiles,
};