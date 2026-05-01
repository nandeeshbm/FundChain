const Transaction = require('../models/Transaction');

const generateTxnId = async () => {
  const last = await Transaction.findOne().sort({ createdAt: -1 }).select('txnId');
  if (!last || !last.txnId) return 'TXN001';

  const num = parseInt(last.txnId.replace('TXN', ''), 10);
  return `TXN${String(num + 1).padStart(3, '0')}`;
};

module.exports = generateTxnId;
