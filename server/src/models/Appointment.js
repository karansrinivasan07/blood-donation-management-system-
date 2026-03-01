const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hospitalProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'HospitalProfile', required: true },
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    donorProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'DonorProfile', required: true },
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodRequest' },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING'
    },
    message: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
