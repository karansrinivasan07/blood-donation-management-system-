const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
    if (cachedConnection) {
        return cachedConnection;
    }

    try {
        const opts = {
            bufferCommands: false, // Disable buffering to fail fast if connection drops
        };

        cachedConnection = mongoose.connect(process.env.MONGODB_URI, opts);
        const conn = await cachedConnection;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (err) {
        console.error(`MongoDB Connection Error: ${err.message}`);
        cachedConnection = null; // Reset on failure
        throw err;
    }
};

module.exports = connectDB;
