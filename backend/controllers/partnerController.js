// Partner Controller
const { query } = require('../config/database');

// Get partner dashboard stats
exports.getDashboard = async (req, res) => {
    try {
        const partnerId = req.user.partnerId;

        // Get partner info
        const partnerResult = await query(
            'SELECT * FROM partners WHERE id = $1',
            [partnerId]
        );

        if (partnerResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Partner not found'
            });
        }

        // Get ticket stats
        const ticketStats = await query(
            `SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN status = 'open' THEN 1 END) as open,
                COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
                COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved
             FROM tickets WHERE partner_id = $1`,
            [partnerId]
        );

        // Get subscription info
        const subscription = await query(
            'SELECT * FROM subscriptions WHERE partner_id = $1 AND status = $2 ORDER BY end_date DESC LIMIT 1',
            [partnerId, 'active']
        );

        // Get recent leads
        const leads = await query(
            'SELECT * FROM leads WHERE assigned_partner_id = $1 ORDER BY created_at DESC LIMIT 5',
            [partnerId]
        );

        res.json({
            success: true,
            data: {
                partner: partnerResult.rows[0],
                tickets: ticketStats.rows[0],
                subscription: subscription.rows[0] || null,
                recentLeads: leads.rows
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load dashboard'
        });
    }
};

// Get partner profile
exports.getProfile = async (req, res) => {
    try {
        const partnerId = req.user.partnerId;

        const result = await query(
            'SELECT * FROM partners WHERE id = $1',
            [partnerId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Partner not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get profile'
        });
    }
};

// Update partner profile
exports.updateProfile = async (req, res) => {
    try {
        const partnerId = req.user.partnerId;
        const { business_name, phone, whatsapp, website, address, city, district } = req.body;

        const result = await query(
            `UPDATE partners 
             SET business_name = $1, phone = $2, whatsapp = $3, website = $4, 
                 address = $5, city = $6, district = $7
             WHERE id = $8
             RETURNING *`,
            [business_name, phone, whatsapp, website, address, city, district, partnerId]
        );

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
};

module.exports = exports;
