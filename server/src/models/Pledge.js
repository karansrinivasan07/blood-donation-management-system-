const mongoose = require('mongoose');

const pledgeSchema = new mongoose.Schema({
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodRequest', required: true },
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    donorProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'DonorProfile' },
    status: { type: String, enum: ['PLEDGED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'], default: 'PLEDGED' },
    appointmentTime: { type: Date },
    completedAt: { type: Date },
    isUsed: { type: Boolean, default: false },
    usedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pledge', pledgeSchema);
