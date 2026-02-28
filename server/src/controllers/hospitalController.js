const HospitalProfile = require('../models/HospitalProfile');
const BloodRequest = require('../models/BloodRequest');
const Pledge = require('../models/Pledge');
const DonorProfile = require('../models/DonorProfile');

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
        const { hospitalName, address, city, pincode, location, contactEmail, contactPhone, isCampActive, campAddress, campCity } = req.body;
        let profile = await HospitalProfile.findOne({ userId: req.user.id });

        if (!profile) {
            profile = new HospitalProfile({ userId: req.user.id });
        }

        profile.hospitalName = hospitalName || profile.hospitalName;
        profile.address = address || profile.address;
        profile.city = city || profile.city;
        profile.pincode = pincode || profile.pincode;
        profile.location = location || profile.location;
        profile.contactEmail = contactEmail || profile.contactEmail;
        profile.contactPhone = contactPhone || profile.contactPhone;
        profile.isCampActive = isCampActive !== undefined ? isCampActive : profile.isCampActive;
        profile.campAddress = campAddress || profile.campAddress;
        profile.campCity = campCity || profile.campCity;

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
        const requests = await BloodRequest.find({ hospitalId: req.user.id }).sort({ createdAt: -1 }).lean();

        // Fetch pledge counts for each request
        const requestsWithCounts = await Promise.all(requests.map(async (request) => {
            const pledgeCount = await Pledge.countDocuments({ requestId: request._id });
            const completedCount = await Pledge.countDocuments({ requestId: request._id, status: 'COMPLETED' });
            return { ...request, pledgeCount, completedCount };
        }));

        res.json(requestsWithCounts);
    } catch (err) {
        console.error('getHospitalRequests Error:', err);
        res.status(500).json({
            message: 'Server error',
            error: err.message
        });
    }
};

exports.getRequestPledges = async (req, res) => {
    try {
        const requestId = req.params.id;

        // Verify hospital owns this request
        const request = await BloodRequest.findById(requestId);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        if (request.hospitalId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized access to this request' });
        }

        const pledges = await Pledge.find({ requestId })
            .populate('donorId', 'name email phone')
            .populate('donorProfile')
            .sort({ createdAt: -1 });

        console.log(`Found ${pledges.length} pledges for request ${requestId}`);
        res.json(pledges);
    } catch (err) {
        console.error('getRequestPledges Error:', err);
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
            pledge.completedAt = new Date();
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
