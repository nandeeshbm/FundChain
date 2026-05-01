const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const { getTransactions, getTransactionById } = require('../controllers/transactionController');

// Authenticated users can view transactions (role filtering happens in service)
router.get('/', authenticateUser, getTransactions);
router.get('/:txnId', authenticateUser, getTransactionById);

module.exports = router;
