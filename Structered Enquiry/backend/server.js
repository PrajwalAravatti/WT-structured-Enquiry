require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const billRoutes = require('./routes/billRoutes');
const authRoutes = require('./routes/authRoutes');

// Initialize Express application
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use('/api', billRoutes);
app.use('/api/auth', authRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date() });
});

// Get port from environment or use default
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`\n✓ Server running on port ${PORT}`);
    console.log(`✓ API endpoint: http://localhost:${PORT}/api/paybill`);
    console.log(`✓ Auth endpoint: http://localhost:${PORT}/api/auth`);
    console.log(`✓ Health check: http://localhost:${PORT}/api/health\n`);
});

