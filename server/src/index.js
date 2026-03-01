require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);

// 1. TOP-LEVEL MANUAL CORS (First middleware, no exceptions)
const allowedOrigins = [
    'http://localhost:5173',
    'https://flashsaver.vercel.app',
    'https://blood-donation-management-system-beryl.vercel.app'
];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app'))) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (!origin) {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// 2. Standard Middleware
app.use(express.json());
app.use(morgan('dev'));

// 3. LAZY DATABASE CONNECTION (Ensures CORS is already set)
app.use(async (req, res, next) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            await connectDB();
        }
        next();
    } catch (err) {
        console.error('DB Middleware Error:', err);
        res.status(503).json({ message: 'Database connection failed' });
    }
});

// 4. Load Routes & Models
const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const adminRoutes = require('./routes/adminRoutes');
const bloodRequestRoutes = require('./routes/bloodRequestRoutes');
const qrRoutes = require('./routes/qrRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

require('./models/User');
require('./models/DonorProfile');
require('./models/HospitalProfile');
require('./models/BloodRequest');
require('./models/Pledge');

app.use('/api/auth', authRoutes);
app.use('/api/donor', donorRoutes);
app.use('/api/hospital', hospitalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/requests', bloodRequestRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/appointments', appointmentRoutes);

app.get('/', (req, res) => res.send('Blood Donation API is running...'));

// 5. Socket.io setup
const io = new Server(server, {
    cors: {
        origin: true,
        credentials: true
    }
});

io.on('connection', (socket) => {
    socket.on('join', (userId) => socket.join(userId));
});

app.set('socketio', io);

// 6. Error handling
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;
