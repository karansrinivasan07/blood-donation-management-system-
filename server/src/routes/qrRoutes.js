const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const qrController = require('../controllers/qrController');

router.get('/data', auth(['DONOR']), qrController.getQRData);

module.exports = router;
