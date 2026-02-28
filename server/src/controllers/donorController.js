const DonorProfile = require('../models/DonorProfile');
const Pledge = require('../models/Pledge');
const BloodRequest = require('../models/BloodRequest');

exports.getProfile = async (req, res) => {
    try {
        const profile = await DonorProfile.findOne({ userId: req.user.id });
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { bloodGroup, city, pincode, isAvailable, lastDonationDate } = req.body;
        let profile = await DonorProfile.findOne({ userId: req.user.id });

        if (!profile) {
            profile = new DonorProfile({ userId: req.user.id });
        }

        profile.bloodGroup = bloodGroup || profile.bloodGroup;
        profile.city = city || profile.city;
        profile.pincode = pincode || profile.pincode;
        profile.isAvailable = isAvailable !== undefined ? isAvailable : profile.isAvailable;
        profile.lastDonationDate = lastDonationDate || profile.lastDonationDate;

        await profile.save();
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getPledges = async (req, res) => {
    try {
        const pledges = await Pledge.find({ donorId: req.user.id })
            .populate({
                path: 'requestId',
                populate: { path: 'hospitalProfile' }
            })
            .sort({ createdAt: -1 });
        res.json(pledges);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.pledgeToDonate = async (req, res) => {
    try {
        const requestId = req.params.id;
        const donorId = req.user.id;

        // Check donor eligibility (90 days)
        const profile = await DonorProfile.findOne({ userId: donorId });
        if (profile.lastDonationDate) {
            const ninetyDaysInMs = 90 * 24 * 60 * 60 * 1000;
            if (Date.now() - new Date(profile.lastDonationDate).getTime() < ninetyDaysInMs) {
                return res.status(400).json({ message: 'You must wait 90 days between donations' });
            }
        }

        // Check if already pledged
        const existingPledge = await Pledge.findOne({ requestId, donorId });
        if (existingPledge) {
            return res.status(400).json({ message: 'You have already pledged for this request' });
        }

        const pledge = new Pledge({
            requestId,
            donorId,
            donorProfile: profile._id
        });

        await pledge.save();

        // Update request status to PARTIAL if it's currently OPEN
        const request = await BloodRequest.findById(requestId);
        if (request && request.status === 'OPEN') {
            request.status = 'PARTIAL';
            await request.save();
        }

        res.status(201).json(pledge);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
