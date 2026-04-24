const ClubOrg = require("../../models/ClubOrg");

const initialClubs = [
  {
    name: "Computer Science Society (CSS)",
    description: "The primary organization for Computer Science students emphasizing teamwork, active learning, and technical skills development.",
    adviser: "Prof. Alan Turing",
    category: "Academic",
    lookingForMembers: true,
    openPositions: ["Event Coordinator", "Designer", "General Member"],
    membersCount: 154
  },
  {
    name: "Cybersecurity Guild",
    description: "Dedicated to exploring the ins and outs of network security, ethical hacking, and participating in global CTF competitions.",
    adviser: "Dr. Ada Lovelace",
    category: "Technical",
    lookingForMembers: true,
    openPositions: ["CTF Lead", "Member"],
    membersCount: 42
  },
  {
    name: "Esports Club",
    description: "Collegiate competitive gaming organization fielding teams for Valorant, League of Legends, and Dota 2 tournaments.",
    adviser: "Mr. John Doe",
    category: "Sports",
    lookingForMembers: false,
    openPositions: [],
    membersCount: 200
  },
  {
    name: "Web Development Group",
    description: "Empowering students to build modern, responsive front-end and back-end applications through collaborative projects.",
    adviser: "Ms. Grace Hopper",
    category: "Technical",
    lookingForMembers: true,
    openPositions: ["Frontend Developer", "Backend Developer", "UI/UX Designer"],
    membersCount: 89
  },
  {
    name: "Data Science Enthusiasts",
    description: "Exploring the fundamentals of machine learning, AI, and big data visualization with hands-on, real-world datasets.",
    adviser: "Dr. John von Neumann",
    category: "Academic",
    lookingForMembers: false,
    openPositions: [],
    membersCount: 56
  },
  {
    name: "CCS Arts and Creatives",
    description: "The creative outlet for CCS students interested in digital arts, video editing, photography, and UI/UX design.",
    adviser: "Mrs. Margaret Hamilton",
    category: "Arts",
    lookingForMembers: true,
    openPositions: ["Photographer", "Video Editor"],
    membersCount: 30
  }
];

const seedClubOrgsCore = async ({ reset = false } = {}) => {
  if (reset) {
    console.log("Resetting ClubOrgs...");
    await ClubOrg.deleteMany({});
  }

  console.log("Seeding ClubOrgs...");
  for (const org of initialClubs) {
    const exists = await ClubOrg.findOne({ name: org.name });
    if (!exists) {
      await ClubOrg.create(org);
    }
  }
  console.log("ClubOrgs seeded.");
};

module.exports = {
  seedClubOrgsCore,
};