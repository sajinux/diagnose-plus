// Admin Routes
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// All routes require authentication and admin role
router.use(verifyToken, isAdmin);

// Partners Management
router.get('/partners', adminController.getAllPartners);
router.put('/partners/:id/status', [
    body('status').isIn(['pending', 'active', 'suspended', 'rejected']).withMessage('Invalid status')
], validate, adminController.updatePartnerStatus);

// Leads Management
router.get('/leads', adminController.getAllLeads);
router.put('/leads/:id/assign', [
    body('partner_id').isInt().withMessage('Valid partner ID is required')
], validate, adminController.assignLead);

// Analytics
router.get('/analytics/overview', adminController.getAnalytics);

module.exports = router;
