const mongoose = require('mongoose');

const hospitalProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hospitalName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    contactEmail: { type: String },
    contactPhone: { type: String },
    isCampActive: { type: Boolean, default: true },
    campAddress: { type: String, default: '' },
    campCity: { type: String, default: '' },
    location: {
        lat: { type: Number },
        lng: { type: Number }
    }
});

module.exports = mongoose.model('HospitalProfile', hospitalProfileSchema);
