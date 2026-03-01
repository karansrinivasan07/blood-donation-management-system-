require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);

// 1. TOP-LEVEL CORS (Must be first)
app.use(cors({
    origin: true, // Reflects request origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    optionsSuccessStatus: 200
}));

// Explicit Preflight Handling
app.options('*', cors());

// 2. Standard Middleware
app.use(express.json());
app.use(morgan('dev'));

// 3. LAZY DATABASE CONNECTION
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

// 4. Load Models (Required for population)
require('./models/User');
require('./models/DonorProfile');
require('./models/HospitalProfile');
require('./models/BloodRequest');
require('./models/Pledge');
require('./models/Appointment');

// 5. Load & Register Routes
const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const adminRoutes = require('./routes/adminRoutes');
const bloodRequestRoutes = require('./routes/bloodRequestRoutes');
const qrRoutes = require('./routes/qrRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/donor', donorRoutes);
app.use('/api/hospital', hospitalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/requests', bloodRequestRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/appointments', appointmentRoutes);

app.get('/', (req, res) => res.send('Blood Donation API is running...'));

// 6. Socket.io setup
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

// 7. Error handling
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;
