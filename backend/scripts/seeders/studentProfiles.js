const StudentProfile = require("../../models/StudentProfile");
const Section = require("../../models/Section");
const { connectAndRun } = require("./shared");
const { seedUsersCore } = require("./users");
const { studentProfilesToSeed } = require("./data");

const formatSchoolYearLabel = (schoolYearSemester) => {
  if (!schoolYearSemester) return "";
  return `${schoolYearSemester.schoolYear} (${schoolYearSemester.semester})`;
};

const seedStudentProfilesCore = async ({ reset = false, userMap } = {}) => {
  const resolvedUserMap = userMap || await seedUsersCore({ reset: false });

  if (reset) {
    await StudentProfile.deleteMany({});
  }

  const sections = await Section.find().populate("schoolYearSemester", "schoolYear semester isCurrent");
  const currentSections = sections.filter((section) => section.schoolYearSemester?.isCurrent);
  const activeSectionPool = currentSections.length > 0 ? currentSections : sections;

  for (let index = 0; index < studentProfilesToSeed.length; index += 1) {
    const profileData = studentProfilesToSeed[index];
    const user = resolvedUserMap.get(profileData.userId);
    if (!user) continue;

    const programSections = activeSectionPool.filter((section) => section.program === profileData.program);
    const yearSections = programSections.filter((section) => section.yearLevel === profileData.yearLevel);
    const candidateSections =
      yearSections.length > 0 ? yearSections : (programSections.length > 0 ? programSections : activeSectionPool);
    const assignedSection = candidateSections.length > 0 ? candidateSections[index % candidateSections.length] : null;

    await StudentProfile.findOneAndUpdate(
      { user: user._id },
      {
        user: user._id,
        studentNumber: profileData.studentNumber,
        firstName: profileData.firstName,
        middleName: profileData.middleName,
        lastName: profileData.lastName,
        gender: profileData.gender,
        yearLevel: assignedSection?.yearLevel || profileData.yearLevel,
        schoolYear: formatSchoolYearLabel(assignedSection?.schoolYearSemester),
        program: assignedSection?.program || profileData.program,
        section: assignedSection?._id,
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
