const Course = require("../../models/Course");
const { connectAndRun, upsertCourse } = require("./shared");
const { coursesToSeed } = require("./data");

const seedCoursesCore = async ({ reset = false } = {}) => {
  if (reset) {
    await Course.deleteMany({});
  }

  for (const courseData of coursesToSeed) {
    await upsertCourse(courseData);
  }

  console.log("Courses seed completed.");
};

const seedCourses = async (options = {}) => connectAndRun(() => seedCoursesCore(options));

if (require.main === module) {
  const reset = process.argv.includes("--reset");

  seedCourses({ reset }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  seedCoursesCore,
  seedCourses,
};