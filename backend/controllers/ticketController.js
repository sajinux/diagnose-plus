// Ticket Controller
const { query } = require('../config/database');

// Get all tickets for a partner
exports.getTickets = async (req, res) => {
    try {
        const partnerId = req.user.partnerId;
        const { status, priority } = req.query;

        let queryText = 'SELECT * FROM tickets WHERE partner_id = $1';
        const params = [partnerId];

        if (status) {
            params.push(status);
            queryText += ` AND status = $${params.length}`;
        }

        if (priority) {
            params.push(priority);
            queryText += ` AND priority = $${params.length}`;
        }

        queryText += ' ORDER BY created_at DESC';

        const result = await query(queryText, params);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Get tickets error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get tickets'
        });
    }
};

// Create new ticket
exports.createTicket = async (req, res) => {
    try {
        const partnerId = req.user.partnerId;
        const { subject, description, priority } = req.body;

        const result = await query(
            `INSERT INTO tickets (partner_id, subject, description, priority, status)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [partnerId, subject, description, priority || 'medium', 'open']
        );

        res.status(201).json({
            success: true,
            message: 'Ticket created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Create ticket error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create ticket'
        });
    }
};

// Get ticket details with replies
exports.getTicketDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const partnerId = req.user.partnerId;

        // Get ticket
        const ticketResult = await query(
            'SELECT * FROM tickets WHERE id = $1 AND partner_id = $2',
            [id, partnerId]
        );

        if (ticketResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }

        // Get replies
        const repliesResult = await query(
            `SELECT tr.*, u.full_name, u.role 
             FROM ticket_replies tr
             JOIN users u ON tr.user_id = u.id
             WHERE tr.ticket_id = $1
             ORDER BY tr.created_at ASC`,
            [id]
        );

        res.json({
            success: true,
            data: {
                ticket: ticketResult.rows[0],
                replies: repliesResult.rows
            }
        });
    } catch (error) {
        console.error('Get ticket details error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get ticket details'
        });
    }
};

// Reply to ticket
exports.replyToTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;
        const userId = req.user.id;

        const result = await query(
            `INSERT INTO ticket_replies (ticket_id, user_id, message)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [id, userId, message]
        );

        // Update ticket status to in_progress if it was open
        await query(
            `UPDATE tickets 
             SET status = CASE WHEN status = 'open' THEN 'in_progress' ELSE status END,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $1`,
            [id]
        );

        res.status(201).json({
            success: true,
            message: 'Reply added successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Reply to ticket error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add reply'
        });
    }
};

module.exports = exports;
