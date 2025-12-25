// Main Express Server
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const partnerRoutes = require('./routes/partner');
const adminRoutes = require('./routes/admin');
const blogRoutes = require('./routes/blog');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ===================================
// Middleware
// ===================================

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:8000',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (for uploaded files)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging (development only)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// ===================================
// Routes
// ===================================

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Diagnose Plus API is running',
        timestamp: new Date().toISOString()
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/partner', partnerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blog', blogRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ===================================
// Start Server
// ===================================

app.listen(PORT, () => {
    console.log('');
    console.log('╔════════════════════════════════════════╗');
    console.log('║   Diagnose Plus API Server Started    ║');
    console.log('╠════════════════════════════════════════╣');
    console.log(`║   Port: ${PORT.toString().padEnd(31)}║`);
    console.log(`║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(23)}║`);
    console.log(`║   Database: ${(process.env.DB_NAME || 'diagnose_plus').padEnd(26)}║`);
    console.log('╚════════════════════════════════════════╝');
    console.log('');
    console.log('📡 API Endpoints:');
    console.log(`   - Health: http://localhost:${PORT}/health`);
    console.log(`   - Auth: http://localhost:${PORT}/api/auth`);
    console.log(`   - Partner: http://localhost:${PORT}/api/partner`);
    console.log(`   - Admin: http://localhost:${PORT}/api/admin`);
    console.log('');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

module.exports = app;
