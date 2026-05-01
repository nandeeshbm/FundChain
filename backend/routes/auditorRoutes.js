const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const authorizeRoles = require('../middleware/authorizeRoles');
const { validate, resolveTransactionSchema } = require('../middleware/validateRequest');
const {
  getFlaggedTransactions,
  getTransactionReview,
  resolveTransaction,
  freezeProject,
} = require('../controllers/auditorController');

// Auditor AND admin can read flagged data; only auditor can resolve
router.use(authenticateUser);

router.get('/flagged-transactions', authorizeRoles('auditor', 'admin'), getFlaggedTransactions);
router.get('/transactions/:txnId/review', authorizeRoles('auditor', 'admin'), getTransactionReview);
router.post('/transactions/:txnId/resolve', authorizeRoles('auditor'), validate(resolveTransactionSchema), resolveTransaction);
router.post('/projects/:projectId/freeze', authorizeRoles('auditor'), freezeProject);

module.exports = router;
