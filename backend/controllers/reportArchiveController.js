const ReportArchive = require('../models/ReportArchive');
const Project = require('../models/Project');
const Transaction = require('../models/Transaction');
const AuditLog = require('../models/AuditLog');
const apiResponse = require('../utils/apiResponse');

// GET /api/admin/report-archives
const listReportArchives = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [archives, total] = await Promise.all([
      ReportArchive.find()
        .select('-transactionSnapshots')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('generatedBy', 'name email role')
        .lean(),
      ReportArchive.countDocuments(),
    ]);

    return apiResponse.paginated(res, 'Report archives retrieved', archives, {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    next(err);
  }
};

const applyStatusFilter = (filters, reportStatus) => {
  if (!reportStatus || reportStatus === 'all') return;
  if (reportStatus === 'flagged') {
    filters.$or = [{ status: 'flagged' }, { sentinelStatus: 'flagged' }];
    return;
  }
  if (['success', 'failed', 'pending'].includes(reportStatus)) {
    filters.status = reportStatus;
  }
};

const buildSnapshotsFromFilters = async (filterParameters = {}) => {
  const { projectId, startDate, endDate, reportStatus } = filterParameters;
  const filters = {};

  if (projectId) {
    const project = await Project.findOne({ projectId }).select('_id').lean();
    if (project) filters.projectId = project._id;
  }
  if (startDate || endDate) {
    filters.createdAt = {};
    if (startDate) filters.createdAt.$gte = new Date(startDate);
    if (endDate) filters.createdAt.$lte = new Date(endDate);
  }
  applyStatusFilter(filters, reportStatus);

  const transactions = await Transaction.find(filters)
    .sort({ createdAt: -1 })
    .populate('projectId', 'projectName projectId')
    .populate('proofSubmissionId', 'ipfsPhotoCid sentinelReasons')
    .lean();

  const auditLogs = await AuditLog.find({
    transactionId: { $in: transactions.map((t) => t._id) },
    action: { $regex: 'SENTINEL|TRANSACTION', $options: 'i' },
  }).sort({ createdAt: -1 }).lean();

  const auditLogMap = new Map();
  auditLogs.forEach((log) => {
    if (log.transactionId) {
      auditLogMap.set(log.transactionId.toString(), log.reason || '');
    }
  });

  return transactions.map((txn) => {
    const proof = txn.proofSubmissionId;
    const reason = proof?.sentinelReasons?.length
      ? proof.sentinelReasons.join('; ')
      : (auditLogMap.get(txn._id.toString()) || '—');

    return {
      txnId: txn.txnId,
      projectId: txn.projectId?.projectId || '—',
      projectName: txn.projectNameSnapshot || txn.projectId?.projectName || '—',
      amount: txn.amount || 0,
      type: txn.type || '—',
      status: txn.status || null,
      sentinelStatus: txn.sentinelStatus || null,
      reason,
      ipfsCid: proof?.ipfsPhotoCid || '—',
      txHash: txn.onChainTxnHash || '—',
      createdAt: txn.createdAt || null,
    };
  });
};

// GET /api/admin/report-archives/:archiveId
const getReportArchiveDetail = async (req, res, next) => {
  try {
    const archive = await ReportArchive.findById(req.params.archiveId)
      .populate('generatedBy', 'name email role')
      .lean();

    if (!archive) {
      return apiResponse.error(res, 'Report archive not found', [], 404);
    }

    // Backward compatibility: old archives may not have snapshot rows.
    if (!Array.isArray(archive.transactionSnapshots) || archive.transactionSnapshots.length === 0) {
      const snapshots = await buildSnapshotsFromFilters(archive.filterParameters || {});
      archive.transactionSnapshots = snapshots;
      archive.summary = {
        totalTransactions: snapshots.length,
        flaggedTransactions: snapshots.filter((s) => s.status === 'flagged' || s.sentinelStatus === 'flagged').length,
        totalAmount: snapshots.reduce((sum, s) => sum + Number(s.amount || 0), 0),
        projectsCovered: new Set(snapshots.map((s) => s.projectId).filter(Boolean)).size,
      };
    }

    return apiResponse.success(res, 'Report archive retrieved', archive);
  } catch (err) {
    next(err);
  }
};

module.exports = { listReportArchives, getReportArchiveDetail };
