const User = require('../models/User');
const DonorProfile = require('../models/DonorProfile');
const HospitalProfile = require('../models/HospitalProfile');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, role, details } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            passwordHash,
            phone,
            role
        });

        await user.save();

        if (role === 'DONOR') {
            const donorProfile = new DonorProfile({
                userId: user._id,
                bloodGroup: details.bloodGroup,
                city: details.city,
                pincode: details.pincode
            });
            await donorProfile.save();
        } else if (role === 'HOSPITAL') {
            const hospitalProfile = new HospitalProfile({
                userId: user._id,
                hospitalName: details.hospitalName,
                address: details.address,
                city: details.city,
                pincode: details.pincode
            });
            await hospitalProfile.save();
        }

        const payload = {
            id: user._id,
            role: user.role
        };

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({
            message: 'Registration failed',
            error: err.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (user.status === 'BLOCKED') {
            return res.status(403).json({ message: 'User account is blocked' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
            id: user._id,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.me = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-passwordHash');
        let profile = null;

        if (user.role === 'DONOR') {
            profile = await DonorProfile.findOne({ userId: user._id });
        } else if (user.role === 'HOSPITAL') {
            profile = await HospitalProfile.findOne({ userId: user._id });
        }

        res.json({ user, profile });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
