const Appointment = require('../models/Appointment');
const DonorProfile = require('../models/DonorProfile');
const HospitalProfile = require('../models/HospitalProfile');

exports.bookAppointment = async (req, res) => {
    try {
        const { hospitalId, requestId, date, timeSlot, message } = req.body;
        const donorProfile = await DonorProfile.findOne({ userId: req.user.id });
        const hospitalProfile = await HospitalProfile.findOne({ userId: hospitalId });

        if (!donorProfile || !hospitalProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        const appointment = new Appointment({
            hospitalId,
            hospitalProfile: hospitalProfile._id,
            donorId: req.user.id,
            donorProfile: donorProfile._id,
            requestId,
            date,
            timeSlot,
            message
        });

        await appointment.save();
        res.status(201).json(appointment);
    } catch (err) {
        console.error('Booking Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getDonorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ donorId: req.user.id })
            .populate('hospitalProfile', 'hospitalName city')
            .sort({ date: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getHospitalAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ hospitalId: req.user.id })
            .populate('donorId', 'name email phone')
            .populate('donorProfile', 'bloodGroup')
            .sort({ date: 1, timeSlot: 1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        // Ensure hospital or donor owns this
        if (appointment.hospitalId.toString() !== req.user.id && appointment.donorId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        appointment.status = status;
        await appointment.save();
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
