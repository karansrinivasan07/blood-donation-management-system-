const DonorProfile = require('../models/DonorProfile');
const User = require('../models/User');

exports.getQRData = async (req, res) => {
    try {
        const donor = await DonorProfile.findOne({ userId: req.user._id });
        if (!donor) {
            return res.status(404).json({ message: 'Donor profile not found' });
        }

        const user = await User.findById(req.user._id);

        // Construct a data object for the QR code
        // In a real app, this could be a signed JWT for security
        const qrData = {
            id: donor.userId,
            name: user.name,
            bloodGroup: donor.bloodGroup,
            city: donor.city,
            lastDonation: donor.lastDonationDate || 'N/A'
        };

        res.json({
            qrString: JSON.stringify(qrData)
        });
    } catch (err) {
        console.error('QR Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
