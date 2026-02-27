require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const DonorProfile = require('./models/DonorProfile');
const HospitalProfile = require('./models/HospitalProfile');
const BloodRequest = require('./models/BloodRequest');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await DonorProfile.deleteMany({});
        await HospitalProfile.deleteMany({});
        await BloodRequest.deleteMany({});

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);

        // Create Admin
        const admin = new User({
            name: 'System Admin',
            email: 'admin@blood.com',
            passwordHash,
            phone: '1234567890',
            role: 'ADMIN'
        });
        await admin.save();

        // Create Hospitals
        const hospitals = [];
        for (let i = 1; i <= 2; i++) {
            const hospitalUser = new User({
                name: `City Hospital ${i}`,
                email: `hospital${i}@test.com`,
                passwordHash,
                phone: `987654321${i}`,
                role: 'HOSPITAL'
            });
            await hospitalUser.save();

            const hospitalProfile = new HospitalProfile({
                userId: hospitalUser._id,
                hospitalName: `City General Hospital ${i}`,
                address: `${i}23 Health St, Medical District`,
                city: 'Mumbai',
                pincode: '400001'
            });
            await hospitalProfile.save();
            hospitals.push({ user: hospitalUser, profile: hospitalProfile });
        }

        // Create Donors
        const bloodGroups = ['A+', 'B+', 'O+', 'AB+', 'O-'];
        for (let i = 1; i <= 5; i++) {
            const donorUser = new User({
                name: `Donor User ${i}`,
                email: `donor${i}@test.com`,
                passwordHash,
                phone: `888888880${i}`,
                role: 'DONOR'
            });
            await donorUser.save();

            const donorProfile = new DonorProfile({
                userId: donorUser._id,
                bloodGroup: bloodGroups[i - 1],
                city: 'Mumbai',
                pincode: '400001',
                isAvailable: true
            });
            await donorProfile.save();
        }

        // Create Blood Requests
        for (let i = 1; i <= 3; i++) {
            const request = new BloodRequest({
                hospitalId: hospitals[i % 2].user._id,
                hospitalProfile: hospitals[i % 2].profile._id,
                bloodGroup: bloodGroups[i],
                unitsRequired: Math.floor(Math.random() * 5) + 1,
                urgency: i === 1 ? 'CRITICAL' : 'NORMAL',
                requiredBefore: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                status: 'OPEN'
            });
            await request.save();
        }

        console.log('Seed data inserted successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
