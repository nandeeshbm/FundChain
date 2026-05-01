const Transaction = require('../models/Transaction');
const transactionService = require('../services/transactionService');
const auditService = require('../services/auditService');
const apiResponse = require('../utils/apiResponse');

// GET /api/transactions — Filtered, paginated, role-aware
const getTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, projectId, status, type, startDate, endDate } = req.query;
    const userRole = req.user ? req.user.role : 'public';
    const userId = req.user ? req.user._id : null;

    const result = await transactionService.getFilteredTransactions({
      filters: { projectId, status, type, startDate, endDate },
      page: parseInt(page),
      limit: parseInt(limit),
      userRole,
      userId,
    });

    return apiResponse.paginated(res, 'Transactions retrieved', result.transactions, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/transactions/:txnId — Full transaction details
const getTransactionById = async (req, res, next) => {
  try {
    const txn = await Transaction.findOne({ txnId: req.params.txnId })
      .populate('projectId', 'projectName projectId department contractAddress')
      .populate('milestoneId', 'phaseNumber title status amount')
      .populate('initiatedBy', 'name email role')
      .populate('proofSubmissionId')
      .lean();

    if (!txn) {
      return apiResponse.error(res, 'Transaction not found', [], 404);
    }

    // Get related audit logs
    const auditLogs = await require('../models/AuditLog')
      .find({ transactionId: txn._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Role-based field filtering
    const userRole = req.user ? req.user.role : 'public';
    if (userRole === 'public') {
      delete txn.initiatedBy;
      delete txn.notes;
    }

    return apiResponse.success(res, 'Transaction details retrieved', {
      transaction: txn,
      auditTrail: auditLogs,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTransactions, getTransactionById };
