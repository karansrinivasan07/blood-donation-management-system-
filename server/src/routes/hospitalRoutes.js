const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');
const auth = require('../middleware/auth');

router.get('/profile', auth(['HOSPITAL']), hospitalController.getProfile);
router.put('/profile', auth(['HOSPITAL']), hospitalController.updateProfile);
router.get('/requests', auth(['HOSPITAL']), hospitalController.getHospitalRequests);
router.get('/requests/:id/pledges', auth(['HOSPITAL']), hospitalController.getRequestPledges);
router.get('/pledges/completed', auth(['HOSPITAL']), hospitalController.getCompletedPledges);
router.patch('/pledges/:id/mark-used', auth(['HOSPITAL']), hospitalController.markUnitAsUsed);
router.patch('/requests/:id/status', auth(['HOSPITAL']), hospitalController.updateRequestStatus);
router.put('/requests/:id/pledges/:pledgeId', auth(['HOSPITAL']), hospitalController.updatePledgeStatus);

module.exports = router;
