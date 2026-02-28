require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const adminRoutes = require('./routes/adminRoutes');
const bloodRequestRoutes = require('./routes/bloodRequestRoutes');

// Connect to Database
connectDB();

// Register Models for global access (fixes population issues)
require('./models/User');
require('./models/DonorProfile');
require('./models/HospitalProfile');
require('./models/BloodRequest');
require('./models/Pledge');

// Middleware
const app = express();

// Simple and robust CORS config for Vercel
const allowedOrigins = [
    'http://localhost:5173',
    'https://flashsaver.vercel.app',
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(morgan('dev'));

// Database connection check middleware (Ensures DB is ready before handling requests)
app.use(async (req, res, next) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            console.log('Database not ready, waiting for connection...');
            await connectDB();
        }
        next();
    } catch (err) {
        res.status(503).json({
            message: 'Database connection failed',
            error: err.message
        });
    }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donor', donorRoutes);
app.use('/api/hospital', hospitalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/requests', bloodRequestRoutes);

app.get('/', (req, res) => {
    res.send('Blood Donation API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;

// Only listen if not running as a Vercel serverless function
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;
