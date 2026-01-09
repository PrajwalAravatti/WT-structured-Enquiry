const mongoose = require('mongoose');

/**
 * Database Connection Utility
 * Connects to MongoDB using the MONGODB_URI from .env file
 */
const connectDB = async () => {
    try {
        // Connect to MongoDB (no options needed for Mongoose 8.x)
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
        console.log(`✓ Database Name: ${conn.connection.name}`);
        console.log(`✓ Collection "billpayments" will be created on first document insert`);

    } catch (error) {
        console.error(`✗ MongoDB Connection Error: ${error.message}`);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
