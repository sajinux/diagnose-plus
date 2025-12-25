// Admin Controller
const { query } = require('../config/database');

// Get all partners
exports.getAllPartners = async (req, res) => {
    try {
        const { status, district } = req.query;

        let queryText = `
            SELECT p.*, u.email, u.is_active, u.created_at as user_created_at
            FROM partners p
            JOIN users u ON p.user_id = u.id
            WHERE 1=1
        `;
        const params = [];

        if (status) {
            params.push(status);
            queryText += ` AND p.status = $${params.length}`;
        }

        if (district) {
            params.push(district);
            queryText += ` AND p.district = $${params.length}`;
        }

        queryText += ' ORDER BY p.created_at DESC';

        const result = await query(queryText, params);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Get partners error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get partners'
        });
    }
};

// Update partner status
exports.updatePartnerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await query(
            'UPDATE partners SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Partner not found'
            });
        }

        res.json({
            success: true,
            message: 'Partner status updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Update partner status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update partner status'
        });
    }
};

// Get all leads
exports.getAllLeads = async (req, res) => {
    try {
        const { status, district } = req.query;

        let queryText = 'SELECT * FROM leads WHERE 1=1';
        const params = [];

        if (status) {
            params.push(status);
            queryText += ` AND status = $${params.length}`;
        }

        if (district) {
            params.push(district);
            queryText += ` AND district = $${params.length}`;
        }

        queryText += ' ORDER BY created_at DESC';

        const result = await query(queryText, params);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Get leads error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get leads'
        });
    }
};

// Assign lead to partner
exports.assignLead = async (req, res) => {
    try {
        const { id } = req.params;
        const { partner_id } = req.body;

        const result = await query(
            'UPDATE leads SET assigned_partner_id = $1, status = $2 WHERE id = $3 RETURNING *',
            [partner_id, 'assigned', id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Lead not found'
            });
        }

        res.json({
            success: true,
            message: 'Lead assigned successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Assign lead error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to assign lead'
        });
    }
};

// Get analytics overview
exports.getAnalytics = async (req, res) => {
    try {
        // Total partners by status
        const partnersStats = await query(
            `SELECT status, COUNT(*) as count 
             FROM partners 
             GROUP BY status`
        );

        // Total tickets by status
        const ticketsStats = await query(
            `SELECT status, COUNT(*) as count 
             FROM tickets 
             GROUP BY status`
        );

        // Total leads by status
        const leadsStats = await query(
            `SELECT status, COUNT(*) as count 
             FROM leads 
             GROUP BY status`
        );

        // Active subscriptions
        const subscriptionsStats = await query(
            `SELECT COUNT(*) as active_subscriptions, SUM(amount) as total_revenue
             FROM subscriptions 
             WHERE status = 'active'`
        );

        res.json({
            success: true,
            data: {
                partners: partnersStats.rows,
                tickets: ticketsStats.rows,
                leads: leadsStats.rows,
                subscriptions: subscriptionsStats.rows[0]
            }
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get analytics'
        });
    }
};

module.exports = exports;
