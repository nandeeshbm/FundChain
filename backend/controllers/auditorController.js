const Transaction = require('../models/Transaction');
const ProofSubmission = require('../models/ProofSubmission');
const Milestone = require('../models/Milestone');
const Project = require('../models/Project');
const AuditLog = require('../models/AuditLog');
const auditService = require('../services/auditService');
const apiResponse = require('../utils/apiResponse');

// GET /api/auditor/flagged-transactions
const getFlaggedTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = { $or: [{ status: 'flagged' }, { sentinelStatus: 'flagged' }] };

    const [transactions, total] = await Promise.all([
      Transaction.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit))
        .populate('projectId', 'projectName projectId department')
        .populate('milestoneId', 'phaseNumber title')
        .populate('initiatedBy', 'name role').lean(),
      Transaction.countDocuments(query),
    ]);

    return apiResponse.paginated(res, 'Flagged transactions retrieved', transactions, {
      total, page: parseInt(page), limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) { next(err); }
};

// GET /api/auditor/transactions/:txnId/review
const getTransactionReview = async (req, res, next) => {
  try {
    const txn = await Transaction.findOne({ txnId: req.params.txnId })
      .populate('projectId').populate('milestoneId')
      .populate('initiatedBy', 'name email role')
      .populate('proofSubmissionId').lean();

    if (!txn) return apiResponse.error(res, 'Transaction not found', [], 404);

    const auditLogs = await AuditLog.find({
      $or: [{ transactionId: txn._id }, { entityId: txn.txnId }],
    }).sort({ createdAt: -1 }).limit(20).lean();

    let proof = null;
    if (txn.proofSubmissionId) {
      proof = await ProofSubmission.findById(txn.proofSubmissionId._id || txn.proofSubmissionId)
        .populate('contractorId', 'vendorName companyName').lean();
    }

    return apiResponse.success(res, 'Transaction review data', {
      transaction: txn, proof, auditLogs,
      flagReasons: proof?.sentinelReasons || [],
    });
  } catch (err) { next(err); }
};

// POST /api/auditor/transactions/:txnId/resolve
const resolveTransaction = async (req, res, next) => {
  try {
    const { resolutionStatus, resolutionNote } = req.body;
    const txn = await Transaction.findOne({ txnId: req.params.txnId });
    if (!txn) return apiResponse.error(res, 'Transaction not found', [], 404);

    txn.notes = `${txn.notes || ''}\n[AUDITOR] ${resolutionStatus}: ${resolutionNote}`;
    if (resolutionStatus === 'resolved') {
      txn.sentinelStatus = 'success';
      txn.status = 'success';
    } else if (resolutionStatus === 'frozen') {
      txn.sentinelStatus = 'flagged';
      txn.status = 'flagged';
    } else if (resolutionStatus === 'escalated') {
      txn.sentinelStatus = 'flagged';
    } else {
      txn.sentinelStatus = 'dismissed';
    }
    await txn.save();

    // Also update the linked milestone
    if (txn.milestoneId) {
      const ms = await Milestone.findById(txn.milestoneId);
      if (ms) {
        if (resolutionStatus === 'resolved') ms.status = 'verified';
        else if (resolutionStatus === 'frozen') ms.status = 'flagged';
        await ms.save();
      }
    }

    await auditService.logAction({
      userId: req.user._id, userRole: req.user.role,
      action: 'TRANSACTION_RESOLVED_BY_AUDITOR',
      entityType: 'transaction', entityId: txn.txnId,
      projectId: txn.projectId, transactionId: txn._id,
      newValues: { resolutionStatus, resolutionNote },
      reason: resolutionNote,
      ipAddress: req.ip, userAgent: req.headers['user-agent'],
    });

    return apiResponse.success(res, 'Resolution recorded', { txnId: txn.txnId, resolutionStatus });
  } catch (err) { next(err); }
};

// POST /api/auditor/projects/:projectId/freeze
const freezeProject = async (req, res, next) => {
  try {
    const { frozen, reason } = req.body;
    const project = await Project.findOne({ projectId: req.params.projectId });
    if (!project) return apiResponse.error(res, 'Project not found', [], 404);

    let onChainTxHash = null;
    if (project.contractAddress) {
      const blockchainService = require('../services/blockchainService');
      const bcResult = await blockchainService.setProjectFreezeStatus(
        project.contractAddress,
        project.projectId,
        frozen
      );
      onChainTxHash = bcResult.txHash;
    }

    project.status = frozen ? 'flagged' : 'active';
    await project.save();

    await auditService.logAction({
      userId: req.user._id,
      userRole: req.user.role,
      action: frozen ? 'PROJECT_FROZEN' : 'PROJECT_UNFROZEN',
      entityType: 'project',
      entityId: project.projectId,
      projectId: project._id,
      newValues: { frozen, reason, txHash: onChainTxHash },
      reason,
      ipAddress: req.ip,
    });

    return apiResponse.success(res, `Project ${frozen ? 'frozen' : 'unfrozen'} successfully`, {
      projectId: project.projectId,
      status: project.status,
      txHash: onChainTxHash,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getFlaggedTransactions, getTransactionReview, resolveTransaction, freezeProject };
