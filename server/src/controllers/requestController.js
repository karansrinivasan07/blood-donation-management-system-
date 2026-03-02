const BloodRequest = require('../models/BloodRequest');
const HospitalProfile = require('../models/HospitalProfile'); // Required for populate
const DonorProfile = require('../models/DonorProfile');
const Pledge = require('../models/Pledge'); // Required for counts

exports.getAllRequests = async (req, res) => {
    try {
        const { bloodGroup, city, status } = req.query;
        let query = {};

        if (bloodGroup) {
            query.bloodGroup = bloodGroup;
        } else if (req.user && req.user.role === 'DONOR') {
            // Find donor's blood group and filter automatically
            const donorProfile = await DonorProfile.findOne({ userId: req.user.id });
            if (donorProfile && donorProfile.bloodGroup) {
                query.bloodGroup = donorProfile.bloodGroup;
            }
        }

        if (status && status !== 'ALL') {
            query.status = status;
        } else if (status !== 'ALL') {
            query.status = { $in: ['OPEN', 'PARTIAL'] };
        }

        let requests = await BloodRequest.find(query)
            .populate('hospitalProfile')
            .sort({ createdAt: -1 });

        if (city) {
            requests = requests.filter(req => req.hospitalProfile && req.hospitalProfile.city.toLowerCase() === city.toLowerCase());
        }

        res.json(requests);
    } catch (err) {
        console.error('getAllRequests Error:', err);
        res.status(500).json({
            message: 'Server error',
            error: err.message
        });
    }
};

exports.getRequestById = async (req, res) => {
    try {
        const request = await BloodRequest.findById(req.params.id).populate('hospitalProfile');
        if (!request) return res.status(404).json({ message: 'Request not found' });
        res.json(request);
    } catch (err) {
        console.error('getRequestById Error:', err);
        res.status(500).json({
            message: 'Server error',
            error: err.message
        });
    }
};
