// Simple Test Server with In-Memory Database
// This allows testing the login system without PostgreSQL
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// In-memory database
const users = [];
const partners = [];

// Middleware
app.use(cors({ origin: 'http://localhost:8000', credentials: true }));
app.use(express.json());

// JWT Configuration
const JWT_SECRET = 'diagnose_plus_jwt_secret_key_2024';
const JWT_REFRESH_SECRET = 'diagnose_plus_refresh_secret_key_2024';

// Create default admin user
(async () => {
    const adminPassword = await bcrypt.hash('admin123', 10);
    users.push({
        id: 1,
        email: 'admin@diagnoseplus.lk',
        password_hash: adminPassword,
        role: 'admin',
        full_name: 'System Administrator',
        is_active: true
    });
    console.log('✅ Default admin user created: admin@diagnoseplus.lk / admin123');
})();

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Diagnose Plus API is running (Test Mode - In-Memory Database)',
        timestamp: new Date().toISOString()
    });
});

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, full_name, business_name, phone, district, city, address } = req.body;

        // Check if user exists
        if (users.find(u => u.email === email)) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Create user
        const user = {
            id: users.length + 1,
            email,
            password_hash,
            role: 'partner',
            full_name,
            is_active: true,
            created_at: new Date()
        };
        users.push(user);

        // Create partner profile
        const partner = {
            id: partners.length + 1,
            user_id: user.id,
            business_name,
            phone,
            email,
            district,
            city,
            address,
            status: 'pending',
            created_at: new Date()
        };
        partners.push(partner);

        res.status(201).json({
            success: true,
            message: 'Registration successful. Your account is pending approval.',
            data: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if active
        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Find partner if exists
        const partner = partners.find(p => p.user_id === user.id);

        // Generate tokens
        const accessToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                partnerId: partner ? partner.id : null
            },
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    full_name: user.full_name,
                    partnerId: partner ? partner.id : null
                },
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

// Get current user
app.get('/api/auth/me', (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = users.find(u => u.id === decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const partner = partners.find(p => p.user_id === user.id);

        res.json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                role: user.role,
                full_name: user.full_name,
                is_active: user.is_active,
                partner_id: partner ? partner.id : null,
                business_name: partner ? partner.business_name : null,
                phone: partner ? partner.phone : null,
                city: partner ? partner.city : null,
                district: partner ? partner.district : null,
                partner_status: partner ? partner.status : null
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
});

// Refresh token
app.post('/api/auth/refresh-token', (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token required'
            });
        }

        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const user = users.find(u => u.id === decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        const partner = partners.find(p => p.user_id === user.id);

        const accessToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                partnerId: partner ? partner.id : null
            },
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.json({
            success: true,
            data: { accessToken }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired refresh token'
        });
    }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('');
    console.log('╔════════════════════════════════════════╗');
    console.log('║   Diagnose Plus API Server Started    ║');
    console.log('║        (TEST MODE - In-Memory DB)      ║');
    console.log('╠════════════════════════════════════════╣');
    console.log(`║   Port: ${PORT.toString().padEnd(31)}║`);
    console.log('║   Mode: Test (No PostgreSQL needed)   ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('');
    console.log('📡 API Endpoints:');
    console.log(`   - Health: http://localhost:${PORT}/health`);
    console.log(`   - Login: http://localhost:${PORT}/api/auth/login`);
    console.log(`   - Register: http://localhost:${PORT}/api/auth/register`);
    console.log('');
    console.log('👤 Default Admin Account:');
    console.log('   Email: admin@diagnoseplus.lk');
    console.log('   Password: admin123');
    console.log('');
});
