const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');
const auth = require('../middleware/auth');

router.get('/profile', auth(['DONOR']), donorController.getProfile);
router.put('/profile', auth(['DONOR']), donorController.updateProfile);
router.get('/pledges', auth(['DONOR']), donorController.getPledges);
router.get('/leaderboard', auth(['DONOR', 'HOSPITAL', 'ADMIN']), donorController.getLeaderboard);

module.exports = router;
