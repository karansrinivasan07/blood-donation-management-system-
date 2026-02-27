const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');
const auth = require('../middleware/auth');

router.get('/profile', auth(['HOSPITAL']), hospitalController.getProfile);
router.put('/profile', auth(['HOSPITAL']), hospitalController.updateProfile);
router.get('/requests', auth(['HOSPITAL']), hospitalController.getHospitalRequests);
router.post('/requests', auth(['HOSPITAL']), hospitalController.createRequest);
router.get('/requests/:id/pledges', auth(['HOSPITAL']), hospitalController.getRequestPledges);
router.put('/requests/:id', auth(['HOSPITAL']), hospitalController.updateRequestStatus);
router.put('/requests/:id/pledges/:pledgeId', auth(['HOSPITAL']), hospitalController.updatePledgeStatus);

module.exports = router;
