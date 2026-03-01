const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const appointmentController = require('../controllers/appointmentController');

router.post('/book', auth(['DONOR']), appointmentController.bookAppointment);
router.get('/donor', auth(['DONOR']), appointmentController.getDonorAppointments);
router.get('/hospital', auth(['HOSPITAL']), appointmentController.getHospitalAppointments);
router.patch('/:id/status', auth(['DONOR', 'HOSPITAL']), appointmentController.updateAppointmentStatus);

module.exports = router;
