const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const authorizeRoles = require('../middleware/authorizeRoles');
const { generateForensicReport } = require('../controllers/forensicReportController');

// Auditor-only forensic report export
router.get('/forensic', authenticateUser, authorizeRoles('auditor'), generateForensicReport);

module.exports = router;
