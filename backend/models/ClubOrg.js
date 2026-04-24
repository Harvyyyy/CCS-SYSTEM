const mongoose = require('mongoose');

const clubOrgSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  adviser: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'General'
  },
  lookingForMembers: {
    type: Boolean,
    default: false
  },
  openPositions: {
    type: [String],
    default: []
  },
  membersCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('ClubOrg', clubOrgSchema);
