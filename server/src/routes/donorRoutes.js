const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');
const auth = require('../middleware/auth');

router.get('/profile', auth(['DONOR']), donorController.getProfile);
router.put('/profile', auth(['DONOR']), donorController.updateProfile);
router.get('/pledges', auth(['DONOR']), donorController.getPledges);
router.get('/notifications', auth(['DONOR']), donorController.getNotifications);
router.patch('/notifications/:id/read', auth(['DONOR']), donorController.markNotificationRead);
router.get('/leaderboard', auth(['DONOR', 'HOSPITAL', 'ADMIN']), donorController.getLeaderboard);
router.get('/active-camps', auth(['DONOR']), donorController.getActiveCamps);

module.exports = router;
