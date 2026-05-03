const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const authorizeRoles = require('../middleware/authorizeRoles');
const { validate, resolveTransactionSchema, resolveIssueReportSchema } = require('../middleware/validateRequest');
const {
  getFlaggedTransactions,
  getTransactionReview,
  resolveTransaction,
  freezeProject,
} = require('../controllers/auditorController');
const { getIssueReportsForAuditor, resolveIssueReport } = require('../controllers/reportController');

// Auditor AND admin can read flagged data; only auditor can resolve
router.use(authenticateUser);

router.get('/flagged-transactions', authorizeRoles('auditor', 'admin'), getFlaggedTransactions);
router.get('/transactions/:txnId/review', authorizeRoles('auditor', 'admin'), getTransactionReview);
router.post('/transactions/:txnId/resolve', authorizeRoles('auditor'), validate(resolveTransactionSchema), resolveTransaction);
router.post('/projects/:projectId/freeze', authorizeRoles('auditor'), freezeProject);
router.get('/report-issues', authorizeRoles('auditor'), getIssueReportsForAuditor);
router.post('/report-issues/:reportId/resolve', authorizeRoles('auditor'), validate(resolveIssueReportSchema), resolveIssueReport);

module.exports = router;
