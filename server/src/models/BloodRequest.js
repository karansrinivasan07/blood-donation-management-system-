const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hospitalProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'HospitalProfile' },
    bloodGroup: { type: String, required: true },
    unitsRequired: { type: Number, required: true },
    urgency: { type: String, enum: ['NORMAL', 'URGENT', 'CRITICAL'], default: 'NORMAL' },
    requiredBefore: { type: Date, required: true },
    status: { type: String, enum: ['OPEN', 'PARTIAL', 'CLOSED'], default: 'OPEN' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
