const express = require('express');
const router = express.Router();
const { verifyIRN } = require('../controllers/govtController');

// Mock Government API Endpoints
// In a real scenario, these would be on a separate server or behind a VPN
router.post('/verify-irn', verifyIRN);

module.exports = router;
