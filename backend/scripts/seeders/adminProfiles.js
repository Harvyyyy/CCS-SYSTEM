const AdminProfile = require("../../models/AdminProfile");
const { connectAndRun } = require("./shared");
const { seedUsersCore } = require("./users");
const { adminProfilesToSeed } = require("./data");

const seedAdminProfilesCore = async ({ reset = false, userMap } = {}) => {
  const resolvedUserMap = userMap || await seedUsersCore({ reset: false });

  if (reset) {
    await AdminProfile.deleteMany({});
  }

  for (const profileData of adminProfilesToSeed) {
    const user = resolvedUserMap.get(profileData.userId);
    if (!user) continue;

    await AdminProfile.findOneAndUpdate(
      { user: user._id },
      {
        user: user._id,
        fullName: profileData.fullName,
        position: profileData.position,
        contactNumber: profileData.contactNumber,
        achievements: profileData.achievements,
        skills: profileData.skills,
        interests: profileData.interests,
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );
  }

  console.log("Admin profiles seed completed.");
  return resolvedUserMap;
};

const seedAdminProfiles = async (options = {}) => connectAndRun(() => seedAdminProfilesCore(options));

if (require.main === module) {
  const reset = process.argv.includes("--reset");

  seedAdminProfiles({ reset }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  seedAdminProfilesCore,
  seedAdminProfiles,
};