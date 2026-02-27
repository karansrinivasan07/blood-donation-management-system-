const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const donorController = require('../controllers/donorController');
const auth = require('../middleware/auth');

router.get('/', auth(['DONOR', 'HOSPITAL', 'ADMIN']), requestController.getAllRequests);
router.get('/:id', auth(['DONOR', 'HOSPITAL', 'ADMIN']), requestController.getRequestById);
router.post('/:id/pledges', auth(['DONOR']), donorController.pledgeToDonate);

module.exports = router;
