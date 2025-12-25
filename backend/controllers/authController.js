// Authentication Controller
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const authConfig = require('../config/auth');

// Register new partner
exports.register = async (req, res) => {
    try {
        const { email, password, full_name, business_name, phone, district, city, address } = req.body;

        // Check if user already exists
        const existingUser = await query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, authConfig.bcrypt.saltRounds);

        // Create user
        const userResult = await query(
            'INSERT INTO users (email, password_hash, role, full_name) VALUES ($1, $2, $3, $4) RETURNING id, email, role',
            [email, password_hash, 'partner', full_name]
        );

        const user = userResult.rows[0];

        // Create partner profile
        await query(
            `INSERT INTO partners (user_id, business_name, phone, email, district, city, address, status) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [user.id, business_name, phone, email, district, city, address, 'pending']
        );

        // Send email notification to admin
        const emailService = require('../utils/emailService');
        await emailService.sendPartnerApplicationEmail({
            email,
            full_name,
            business_name,
            phone,
            district,
            city,
            address
        });

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
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const userResult = await query(
            'SELECT u.*, p.id as partner_id FROM users u LEFT JOIN partners p ON u.id = p.user_id WHERE u.email = $1',
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = userResult.rows[0];

        // Check if account is active
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

        // Generate tokens
        const accessToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                partnerId: user.partner_id
            },
            authConfig.jwt.secret,
            { expiresIn: authConfig.jwt.expiresIn }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            authConfig.jwt.refreshSecret,
            { expiresIn: authConfig.jwt.refreshExpiresIn }
        );

        // Update last login
        await query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
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
                    partnerId: user.partner_id
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
};

// Refresh token
exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token required'
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, authConfig.jwt.refreshSecret);

        // Get user
        const userResult = await query(
            'SELECT u.*, p.id as partner_id FROM users u LEFT JOIN partners p ON u.id = p.user_id WHERE u.id = $1',
            [decoded.id]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        const user = userResult.rows[0];

        // Generate new access token
        const accessToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                partnerId: user.partner_id
            },
            authConfig.jwt.secret,
            { expiresIn: authConfig.jwt.expiresIn }
        );

        res.json({
            success: true,
            data: { accessToken }
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired refresh token'
        });
    }
};

// Get current user
exports.me = async (req, res) => {
    try {
        const userResult = await query(
            `SELECT u.id, u.email, u.role, u.full_name, u.is_active, u.last_login,
                    p.id as partner_id, p.business_name, p.status as partner_status
             FROM users u 
             LEFT JOIN partners p ON u.id = p.user_id 
             WHERE u.id = $1`,
            [req.user.id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: userResult.rows[0]
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user information'
        });
    }
};

// Logout (client-side token removal, optional server-side blacklist)
exports.logout = async (req, res) => {
    // In a production app, you might want to blacklist the token
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
};
