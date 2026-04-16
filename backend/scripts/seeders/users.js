const User = require("../../models/User");
const { connectAndRun, upsertUser } = require("./shared");
const { usersToSeed } = require("./data");

const seedUsersCore = async ({ reset = false } = {}) => {
  if (reset) {
    await User.deleteMany({});
  }

  const userMap = new Map();

  for (const userData of usersToSeed) {
    const user = await upsertUser(userData);
    userMap.set(userData.userId, user);
  }

  console.log("Users seed completed.");
  return userMap;
};

const seedUsers = async (options = {}) => connectAndRun(() => seedUsersCore(options));

if (require.main === module) {
  const reset = process.argv.includes("--reset");

  seedUsers({ reset }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  seedUsersCore,
  seedUsers,
};