const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const authorizeRoles = require('../middleware/authorizeRoles');
const { validate, resolveTransactionSchema } = require('../middleware/validateRequest');
const {
  getFlaggedTransactions,
  getTransactionReview,
  resolveTransaction,
} = require('../controllers/auditorController');

router.use(authenticateUser, authorizeRoles('auditor'));

router.get('/flagged-transactions', getFlaggedTransactions);
router.get('/transactions/:txnId/review', getTransactionReview);
router.post('/transactions/:txnId/resolve', validate(resolveTransactionSchema), resolveTransaction);

module.exports = router;
