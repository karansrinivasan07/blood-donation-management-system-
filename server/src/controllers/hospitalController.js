const HospitalProfile = require('../models/HospitalProfile');
const BloodRequest = require('../models/BloodRequest');
const Pledge = require('../models/Pledge');

exports.getProfile = async (req, res) => {
    try {
        const profile = await HospitalProfile.findOne({ userId: req.user.id });
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { hospitalName, address, city, pincode } = req.body;
        let profile = await HospitalProfile.findOne({ userId: req.user.id });

        if (!profile) {
            profile = new HospitalProfile({ userId: req.user.id });
        }

        profile.hospitalName = hospitalName || profile.hospitalName;
        profile.address = address || profile.address;
        profile.city = city || profile.city;
        profile.pincode = pincode || profile.pincode;

        await profile.save();
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createRequest = async (req, res) => {
    try {
        const { bloodGroup, unitsRequired, urgency, requiredBefore } = req.body;
        const profile = await HospitalProfile.findOne({ userId: req.user.id });

        if (!profile) {
            return res.status(400).json({ message: 'Hospital profile not found' });
        }

        const bloodRequest = new BloodRequest({
            hospitalId: req.user.id,
            hospitalProfile: profile._id,
            bloodGroup,
            unitsRequired,
            urgency,
            requiredBefore
        });

        await bloodRequest.save();
        res.status(201).json(bloodRequest);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getHospitalRequests = async (req, res) => {
    try {
        const requests = await BloodRequest.find({ hospitalId: req.user.id }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getRequestPledges = async (req, res) => {
    try {
        const pledges = await Pledge.find({ requestId: req.params.id })
            .populate('donorId', 'name email phone')
            .populate('donorProfile');
        res.json(pledges);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updatePledgeStatus = async (req, res) => {
    try {
        const { id, pledgeId } = req.params;
        const { status, appointmentTime } = req.body;

        const pledge = await Pledge.findById(pledgeId);
        if (!pledge) return res.status(404).json({ message: 'Pledge not found' });

        pledge.status = status || pledge.status;
        pledge.appointmentTime = appointmentTime || pledge.appointmentTime;

        if (status === 'COMPLETED') {
            const donorProfile = await DonorProfile.findOne({ userId: pledge.donorId });
            if (donorProfile) {
                donorProfile.lastDonationDate = new Date();
                await donorProfile.save();
            }
        }

        await pledge.save();
        res.json(pledge);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const request = await BloodRequest.findById(req.params.id);

        if (!request) return res.status(404).json({ message: 'Request not found' });
        if (request.hospitalId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

        request.status = status || request.status;
        await request.save();
        res.json(request);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
