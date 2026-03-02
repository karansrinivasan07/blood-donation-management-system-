const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');
const auth = require('../middleware/auth');

router.get('/profile', auth(['HOSPITAL']), hospitalController.getProfile);
router.put('/profile', auth(['HOSPITAL']), hospitalController.updateProfile);
router.get('/requests', auth(['HOSPITAL']), hospitalController.getHospitalRequests);
router.post('/requests', auth(['HOSPITAL']), hospitalController.createRequest);
router.get('/requests/:id/pledges', auth(['HOSPITAL']), hospitalController.getRequestPledges);
router.get('/pledges/completed', auth(['HOSPITAL']), hospitalController.getCompletedPledges);
router.patch('/pledges/:id/mark-used', auth(['HOSPITAL']), hospitalController.markUnitAsUsed);
router.patch('/requests/:id/status', auth(['HOSPITAL']), hospitalController.updateRequestStatus);
router.put('/requests/:id/pledges/:pledgeId', auth(['HOSPITAL']), hospitalController.updatePledgeStatus);
router.put('/pledges/:pledgeId/complete', auth(['HOSPITAL']), hospitalController.completePledgeDirectly);

module.exports = router;
