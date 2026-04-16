const FacultyProfile = require("../../models/FacultyProfile");
const { connectAndRun } = require("./shared");
const { seedUsersCore } = require("./users");
const { facultyProfilesToSeed } = require("./data");

const seedFacultyProfilesCore = async ({ reset = false, userMap } = {}) => {
  const resolvedUserMap = userMap || await seedUsersCore({ reset: false });

  if (reset) {
    await FacultyProfile.deleteMany({});
  }

  for (const profileData of facultyProfilesToSeed) {
    const user = resolvedUserMap.get(profileData.userId);
    if (!user) continue;

    await FacultyProfile.findOneAndUpdate(
      { user: user._id },
      {
        user: user._id,
        employeeIdNumber: profileData.employeeIdNumber,
        firstName: profileData.firstName,
        middleName: profileData.middleName,
        lastName: profileData.lastName,
        gender: profileData.gender,
        department: profileData.department,
        position: profileData.position,
        contactNumber: profileData.contactNumber,
        achievements: profileData.achievements,
        skills: profileData.skills,
        interests: profileData.interests,
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );
  }

  console.log("Faculty profiles seed completed.");
  return resolvedUserMap;
};

const seedFacultyProfiles = async (options = {}) => connectAndRun(() => seedFacultyProfilesCore(options));

if (require.main === module) {
  const reset = process.argv.includes("--reset");

  seedFacultyProfiles({ reset }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  seedFacultyProfilesCore,
  seedFacultyProfiles,
};