const BloodRequest = require('../models/BloodRequest');

exports.getAllRequests = async (req, res) => {
    try {
        const { bloodGroup, city, status } = req.query;
        let query = {};

        if (bloodGroup) query.bloodGroup = bloodGroup;
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
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getRequestById = async (req, res) => {
    try {
        const request = await BloodRequest.findById(req.params.id).populate('hospitalProfile');
        if (!request) return res.status(404).json({ message: 'Request not found' });
        res.json(request);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
