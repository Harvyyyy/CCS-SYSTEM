const ViolationType = require("../../models/ViolationType");
const { connectAndRun } = require("./shared");
const { violationTypesToSeed } = require("./data");

const seedViolationTypesCore = async ({ reset = false } = {}) => {
  if (reset) {
    await ViolationType.deleteMany({});
  }

  for (const item of violationTypesToSeed) {
    await ViolationType.findOneAndUpdate(
      { violationName: item.violationName },
      item,
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );
  }

  console.log("Violation types seed completed.");
};

const seedViolationTypes = async (options = {}) => connectAndRun(() => seedViolationTypesCore(options));

if (require.main === module) {
  const reset = process.argv.includes("--reset");
  seedViolationTypes({ reset }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  seedViolationTypesCore,
  seedViolationTypes,
};
