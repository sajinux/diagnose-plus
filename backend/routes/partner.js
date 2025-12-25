// Partner Routes
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const partnerController = require('../controllers/partnerController');
const ticketController = require('../controllers/ticketController');
const { verifyToken, isPartner } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// All routes require authentication and partner role
router.use(verifyToken, isPartner);

// Dashboard
router.get('/dashboard', partnerController.getDashboard);

// Profile
router.get('/profile', partnerController.getProfile);
router.put('/profile', [
    body('business_name').notEmpty().withMessage('Business name is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('district').notEmpty().withMessage('District is required')
], validate, partnerController.updateProfile);

// Tickets
router.get('/tickets', ticketController.getTickets);
router.post('/tickets', [
    body('subject').notEmpty().withMessage('Subject is required'),
    body('description').notEmpty().withMessage('Description is required')
], validate, ticketController.createTicket);
router.get('/tickets/:id', ticketController.getTicketDetails);
router.post('/tickets/:id/reply', [
    body('message').notEmpty().withMessage('Message is required')
], validate, ticketController.replyToTicket);

module.exports = router;
