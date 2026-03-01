const mongoose = require('mongoose');

const donorProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bloodGroup: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    lastDonationDate: { type: Date },
    isAvailable: { type: Boolean, default: true },
    location: {
        lat: { type: Number },
        lng: { type: Number }
    },
    donationCount: { type: Number, default: 0 },
    badges: [{
        name: { type: String },
        awardedAt: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('DonorProfile', donorProfileSchema);
