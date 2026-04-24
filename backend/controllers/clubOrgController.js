const ClubOrg = require('../models/ClubOrg');

// @desc    Get all clubs and organizations
// @route   GET /api/clubs
// @access  Public/Private
exports.getClubsOrgs = async (req, res) => {
  try {
    const clubs = await ClubOrg.find({});
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new club or organization
// @route   POST /api/clubs
// @access  Admin/Faculty
exports.createClubOrg = async (req, res) => {
  try {
    const { name, description, adviser, category, lookingForMembers, openPositions } = req.body;

    const clubExists = await ClubOrg.findOne({ name });

    if (clubExists) {
      return res.status(400).json({ message: 'Club/Organization already exists' });
    }

    const club = await ClubOrg.create({
      name,
      description,
      adviser,
      category,
      lookingForMembers,
      openPositions: openPositions || []
    });

    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a club or organization
// @route   PUT /api/clubs/:id
// @access  Admin/Faculty
exports.updateClubOrg = async (req, res) => {
  try {
    const { name, description, adviser, category, lookingForMembers, openPositions } = req.body;

    const club = await ClubOrg.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ message: 'Club/Organization not found' });
    }

    club.name = name || club.name;
    club.description = description || club.description;
    club.adviser = adviser !== undefined ? adviser : club.adviser;
    club.category = category || club.category;
    club.lookingForMembers = lookingForMembers !== undefined ? lookingForMembers : club.lookingForMembers;
    club.openPositions = openPositions !== undefined ? openPositions : club.openPositions;

    const updatedClub = await club.save();
    res.json(updatedClub);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a club or organization
// @route   DELETE /api/clubs/:id
// @access  Admin
exports.deleteClubOrg = async (req, res) => {
  try {
    const club = await ClubOrg.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ message: 'Club/Organization not found' });
    }

    await club.deleteOne();
    res.json({ message: 'Club/Organization removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
