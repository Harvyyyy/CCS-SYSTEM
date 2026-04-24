const express = require('express');
const router = express.Router();
const {
  getClubsOrgs,
  createClubOrg,
  updateClubOrg,
  deleteClubOrg
} = require('../controllers/clubOrgController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getClubsOrgs)
  .post(protect, admin, createClubOrg);

router.route('/:id')
  .put(protect, admin, updateClubOrg)
  .delete(protect, admin, deleteClubOrg);

module.exports = router;
