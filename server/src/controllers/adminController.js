const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const DonorProfile = require('../models/DonorProfile');
const Pledge = require('../models/Pledge');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getRequests = async (req, res) => {
    try {
        const requests = await BloodRequest.find()
            .populate('hospitalProfile')
            .sort({ createdAt: -1 })
            .lean();

        // Fetch pledge counts for each request
        const requestsWithCounts = await Promise.all(requests.map(async (request) => {
            const pledgeCount = await Pledge.countDocuments({ requestId: request._id });
            return { ...request, pledgeCount };
        }));

        res.json(requestsWithCounts);
    } catch (err) {
        console.error('getRequests Admin Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.status = status;
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAnalytics = async (req, res) => {
    try {
        const totalDonors = await User.countDocuments({ role: 'DONOR' });
        const totalHospitals = await User.countDocuments({ role: 'HOSPITAL' });
        const totalRequests = await BloodRequest.countDocuments();
        const openRequests = await BloodRequest.countDocuments({ status: 'OPEN' });
        const totalPledges = await Pledge.countDocuments();

        const requestsByBloodGroup = await BloodRequest.aggregate([
            { $group: { _id: '$bloodGroup', count: { $sum: 1 } } }
        ]);

        const donorsByBloodGroup = await DonorProfile.aggregate([
            { $group: { _id: '$bloodGroup', count: { $sum: 1 } } }
        ]);

        res.json({
            metrics: {
                totalDonors,
                totalHospitals,
                totalRequests,
                openRequests,
                totalPledges
            },
            requestsByBloodGroup,
            donorsByBloodGroup
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
