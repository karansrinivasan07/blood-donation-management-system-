const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

router.get('/users', auth(['ADMIN']), adminController.getUsers);
router.get('/requests', auth(['ADMIN']), adminController.getRequests);
router.put('/users/:id/status', auth(['ADMIN']), adminController.updateUserStatus);
router.get('/analytics', auth(['ADMIN']), adminController.getAnalytics);

module.exports = router;
